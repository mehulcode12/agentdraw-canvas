/**
 * Agent — headless API for AI reasoning.
 * Provides data about zones, overlaps, and captures clean annotated screenshots.
 */
export function createAgent(services) {
  const metaMap = new Map();

  function getZoneMap() {
    const { core } = services;
    const stage = core.stage;
    const width = stage.width();
    const height = stage.height();

    const zones = {
      'top-left':  { x: 0, y: 0, w: width/3, h: height/3, occupied: false, shapes: [] },
      'top-ctr':   { x: width/3, y: 0, w: width/3, h: height/3, occupied: false, shapes: [] },
      'top-right': { x: 2*width/3, y: 0, w: width/3, h: height/3, occupied: false, shapes: [] },
      'mid-left':  { x: 0, y: height/3, w: width/3, h: height/3, occupied: false, shapes: [] },
      'center':    { x: width/3, y: height/3, w: width/3, h: height/3, occupied: false, shapes: [] },
      'mid-right': { x: 2*width/3, y: height/3, w: width/3, h: height/3, occupied: false, shapes: [] },
      'bot-left':  { x: 0, y: 2*height/3, w: width/3, h: height/3, occupied: false, shapes: [] },
      'bot-ctr':   { x: width/3, y: 2*height/3, w: width/3, h: height/3, occupied: false, shapes: [] },
      'bot-right': { x: 2*width/3, y: 2*height/3, w: width/3, h: height/3, occupied: false, shapes: [] },
    };

    const nodes = core.layer.getChildren().filter(c => c.getClassName() !== 'Transformer' && c.name() !== 'watermark');
    const scale = stage.scaleX();

    nodes.forEach(node => {
      if (!node._publicId) return;
      const rect = node.getClientRect({ skipTransform: false });
      
      for (const [zoneName, z] of Object.entries(zones)) {
        // AABB Collision between shape's client rect and zone rect
        if (
          rect.x < z.x + z.w &&
          rect.x + rect.width > z.x &&
          rect.y < z.y + z.h &&
          rect.y + rect.height > z.y
        ) {
          z.occupied = true;
          z.shapes.push(node._publicId);
        }
      }
    });

    return zones;
  }

  function getOverlaps() {
    const { core } = services;
    const nodes = core.layer.getChildren().filter(c => c.getClassName() !== 'Transformer' && c.name() !== 'watermark');
    const overlaps = [];

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];
        if (!a._publicId || !b._publicId) continue;

        const rectA = a.getClientRect({ skipTransform: false });
        const rectB = b.getClientRect({ skipTransform: false });

        if (
          rectA.x < rectB.x + rectB.width &&
          rectA.x + rectA.width > rectB.x &&
          rectA.y < rectB.y + rectB.height &&
          rectA.y + rectA.height > rectB.y
        ) {
          // Calculate overlap area (px^2 approx)
          const overlapWidth = Math.min(rectA.x + rectA.width, rectB.x + rectB.width) - Math.max(rectA.x, rectB.x);
          const overlapHeight = Math.min(rectA.y + rectA.height, rectB.y + rectB.height) - Math.max(rectA.y, rectB.y);
          overlaps.push({
            a: a._publicId,
            b: b._publicId,
            overlap_px: overlapWidth * overlapHeight
          });
        }
      }
    }
    return overlaps;
  }

  async function toAnnotatedDataURL(pixelRatio = 0.5) {
    const { core } = services;
    const dataUrl = core.stage.toDataURL({ pixelRatio });
    const nodes = core.layer.getChildren().filter(c => c.getClassName() !== 'Transformer' && c.name() !== 'watermark');
    
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        
        ctx.font = '14px monospace';
        ctx.fillStyle = 'rgba(255, 50, 50, 0.9)';
        
        nodes.forEach(node => {
          if (!node._publicId) return;
          // getClientRect gives position relative to the top-left of the stage container
          const rect = node.getClientRect({ skipTransform: false });
          const screenX = rect.x * pixelRatio;
          const screenY = rect.y * pixelRatio;
          
          ctx.fillText(node._publicId, screenX, screenY - 4);
        });
        
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = reject;
      img.src = dataUrl;
    });
  }

  async function getSnapshot(pixelRatio = 0.5) {
    const { core, animations, export: exportMod } = services;
    
    // 1. Temporarily revert animations to base state
    const running = animations.getRunning();
    running.forEach(({ anim, state }) => {
      anim.stop();
      const shape = state.shape;
      shape.x(state.origX - state.dx);
      shape.y(state.origY - state.dy);
      shape.rotation(state.origRot);
      shape.scaleX(state.origScaleX);
      shape.scaleY(state.origScaleY);
      shape.opacity(state.origOpacity);
    });
    
    core.layer.draw();

    // 2. Capture state and annotated screenshot
    const state = exportMod.getState();
    const screenshot_b64 = await toAnnotatedDataURL(pixelRatio);
    
    const viewport = {
      x: core.stage.x(),
      y: core.stage.y(),
      scale: core.stage.scaleX(),
      width: core.stage.width(),
      height: core.stage.height()
    };

    // 3. Resume animations
    running.forEach(({ anim }) => anim.start());

    // Inject semantic meta into state
    state.shapes.forEach(shape => {
      if (shape.id && metaMap.has(shape.id)) {
        shape._agentMeta = metaMap.get(shape.id);
      }
    });

    return {
      screenshot_b64: screenshot_b64.replace(/^data:image\/png;base64,/, ''),
      state,
      viewport,
      timestamp: Date.now()
    };
  }

  function setMeta(id, meta) {
    metaMap.set(id, meta);
  }

  function getMeta(id) {
    return metaMap.get(id);
  }

  function getAnchor(id, anchorName) {
    const node = services.shapes.getById(id);
    if (!node) return null;
    const rect = node.getClientRect({ skipTransform: false });
    
    // Fallback simple anchors
    const anchors = {
      top: { x: rect.x + rect.width / 2, y: rect.y },
      bottom: { x: rect.x + rect.width / 2, y: rect.y + rect.height },
      left: { x: rect.x, y: rect.y + rect.height / 2 },
      right: { x: rect.x + rect.width, y: rect.y + rect.height / 2 },
      center: { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 },
    };
    
    return anchors[anchorName] || anchors.center;
  }

  function clear() {
    const { core, interaction, shapes } = services;
    interaction.deselect();
    const nodes = core.layer.getChildren().slice();
    nodes.forEach(node => {
      if (node._publicId && metaMap.has(node._publicId)) {
        shapes.shapeMap.delete(node._publicId);  // ← clean up ShapeRegistry
        node.destroy();
        metaMap.delete(node._publicId);
      }
    });
    core.layer.draw();
  }

  function clearStage(stageIndex) {
    const { core, interaction, shapes } = services;
    interaction.deselect();
    const nodes = core.layer.getChildren().slice();
    nodes.forEach(node => {
      if (node._publicId && metaMap.has(node._publicId)) {
        const meta = metaMap.get(node._publicId);
        if (meta.stage === stageIndex) {
          shapes.shapeMap.delete(node._publicId);  // ← clean up ShapeRegistry
          node.destroy();
          metaMap.delete(node._publicId);
        }
      }
    });
    core.layer.draw();
  }

  return {
    getSnapshot,
    toAnnotatedDataURL,
    getZoneMap,
    getOverlaps,
    setMeta,
    getMeta,
    getAnchor,
    clear,
    clearStage
  };
}
