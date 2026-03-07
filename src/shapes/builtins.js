/**
 * Built-in shapes — registers all default shape types into the ShapeRegistry.
 * Import and call registerBuiltinShapes(services) during bootstrap.
 */
export function registerBuiltinShapes(services) {
  const { shapes } = services;

  shapes.register('rect', cfg => new Konva.Rect(cfg));
  shapes.register('rounded-rect', cfg => new Konva.Rect({ ...cfg, cornerRadius: cfg.cornerRadius || 12 }));
  shapes.register('circle', cfg => new Konva.Circle(cfg));
  shapes.register('oval', cfg => new Konva.Ellipse({ ...cfg, radiusX: cfg.radiusX || 60, radiusY: cfg.radiusY || 40 }));
  shapes.register('ellipse', cfg => new Konva.Ellipse(cfg));
  shapes.register('triangle', cfg => new Konva.RegularPolygon({ ...cfg, sides: 3 }));
  shapes.register('pentagon', cfg => new Konva.RegularPolygon({ ...cfg, sides: 5 }));
  shapes.register('hexagon', cfg => new Konva.RegularPolygon({ ...cfg, sides: 6 }));
  shapes.register('diamond', cfg => new Konva.RegularPolygon({ ...cfg, sides: 4 }));
  shapes.register('circle-ring', cfg => new Konva.Ring({ ...cfg, innerRadius: cfg.innerRadius || 40, outerRadius: cfg.outerRadius || 60 }));

  shapes.register('star', cfg =>
    new Konva.Star({
      ...cfg,
      numPoints: 5,
      innerRadius: (cfg.radius || 60) * 0.42,
      outerRadius: cfg.radius || 60,
    })
  );

  shapes.register('arrow', cfg =>
    new Konva.Arrow({
      ...cfg,
      stroke: cfg.fill,
      fill: cfg.fill,
      strokeWidth: cfg.strokeWidth || 3,
      pointerLength: 12,
      pointerWidth: 12,
    })
  );

  shapes.register('dashed-arrow', cfg =>
    new Konva.Arrow({
      ...cfg,
      stroke: cfg.fill,
      fill: cfg.fill,
      strokeWidth: cfg.strokeWidth || 3,
      pointerLength: 12,
      pointerWidth: 12,
      dash: [10, 5],
    })
  );

  shapes.register('double-arrow', cfg =>
    new Konva.Arrow({
      ...cfg,
      stroke: cfg.fill,
      fill: cfg.fill,
      strokeWidth: cfg.strokeWidth || 3,
      pointerLength: 12,
      pointerWidth: 12,
      pointerAtBeginning: true,
    })
  );

  shapes.register('curved-arrow', cfg =>
    new Konva.Arrow({
      ...cfg,
      stroke: cfg.fill,
      fill: cfg.fill,
      strokeWidth: cfg.strokeWidth || 3,
      pointerLength: 12,
      pointerWidth: 12,
      tension: 0.5,
    })
  );

  shapes.register('line', cfg =>
    new Konva.Line({
      ...cfg,
      stroke: cfg.fill,
      fill: null,
      strokeWidth: cfg.strokeWidth || 4,
      lineCap: 'round',
    })
  );

  shapes.register('dashed-line', cfg =>
    new Konva.Line({
      ...cfg,
      stroke: cfg.fill,
      fill: null,
      strokeWidth: cfg.strokeWidth || 4,
      lineCap: 'round',
      dash: [10, 5],
    })
  );

  shapes.register('cloud', cfg => {
    return new Konva.Shape({
      ...cfg,
      sceneFunc(ctx, shape) {
        const w = 120, h = 70;
        ctx.beginPath();
        ctx.arc(30, 50, 28, Math.PI, 0, false);
        ctx.arc(55, 30, 32, Math.PI * 1.1, 0, false);
        ctx.arc(85, 40, 25, Math.PI, 0, false);
        ctx.arc(100, 50, 20, Math.PI * 0.8, 0, false);
        ctx.lineTo(125, 70); ctx.lineTo(5, 70);
        ctx.closePath();
        ctx.fillStrokeShape(shape);
      },
      width: 130, height: 70,
    });
  });

  shapes.register('cylinder', cfg => {
    return new Konva.Shape({
      ...cfg,
      sceneFunc(ctx, shape) {
        const w = cfg.width || 80;
        const h = cfg.height || 100;
        const ry = 15;
        // Bottom ellipse
        ctx.beginPath();
        ctx.ellipse(w / 2, h - ry, w / 2, ry, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        // Body (sides only)
        ctx.beginPath();
        ctx.moveTo(0, ry); ctx.lineTo(0, h - ry);
        ctx.moveTo(w, ry); ctx.lineTo(w, h - ry);
        ctx.stroke();
        // Top ellipse
        ctx.beginPath();
        ctx.ellipse(w / 2, ry, w / 2, ry, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStrokeShape(shape);
      }
    });
  });

  shapes.register('wave-shape', cfg => {
    return new Konva.Shape({
      ...cfg,
      sceneFunc(ctx, shape) {
        const w = cfg.width || 200;
        const h = cfg.height || 50;
        const amplitude = h / 2;
        const frequency = cfg.frequency || 2;
        ctx.beginPath();
        ctx.moveTo(0, h / 2);
        for (let x = 0; x <= w; x++) {
          const y = h / 2 + amplitude * Math.sin((x / w) * Math.PI * 2 * frequency);
          ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.fillStrokeShape(shape);
      }
    });
  });

  shapes.register('lightning', cfg => {
    return new Konva.Path({
      ...cfg,
      data: 'M30 0 L0 50 L20 50 L5 100 L40 40 L20 40 L35 0 Z',
      scale: { x: 2, y: 2 },
      strokeWidth: 2
    });
  });

  shapes.register('heart', cfg =>
    new Konva.Path({
      ...cfg,
      data: 'M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z',
      scale: { x: 4, y: 4 },
      stroke: cfg.stroke || cfg.fill,
    })
  );


  shapes.register('text', cfg =>
    new Konva.Text({
      ...cfg,
      text: cfg.text || '',
      fontSize: cfg.fontSize || services.drawing.fontSize,
      fontFamily: "'Kalam', cursive",
      fill: cfg.fill,
      align: 'center',
    })
  );

  shapes.register('speech-bubble', cfg => {
    return new Konva.Shape({
      ...cfg,
      sceneFunc(ctx, shape) {
        const w = cfg.width || 120;
        const h = cfg.height || 80;
        const r = 10;
        ctx.beginPath();
        ctx.moveTo(r, 0);
        ctx.lineTo(w - r, 0);
        ctx.quadraticCurveTo(w, 0, w, r);
        ctx.lineTo(w, h - r);
        ctx.quadraticCurveTo(w, h, w - r, h);
        ctx.lineTo(w * 0.7, h);
        ctx.lineTo(w * 0.5, h + 20);
        ctx.lineTo(w * 0.4, h);
        ctx.lineTo(r, h);
        ctx.quadraticCurveTo(0, h, 0, h - r);
        ctx.lineTo(0, r);
        ctx.quadraticCurveTo(0, 0, r, 0);
        ctx.closePath();
        ctx.fillStrokeShape(shape);
      }
    });
  });

  shapes.register('highlight-box', cfg =>
    new Konva.Rect({
      ...cfg,
      fill: 'rgba(255, 255, 0, 0.2)',
      stroke: cfg.stroke || '#FFD700',
      strokeWidth: 2,
      dash: [5, 5]
    })
  );

  shapes.register('number-badge', cfg => {
    const group = new Konva.Group({ ...cfg, draggable: cfg.draggable ?? true });
    const nucleus = new Konva.Circle({ radius: 15, fill: cfg.fill || '#333', stroke: '#fff', strokeWidth: 2, listening: false });
    const text = new Konva.Text({ text: cfg.text || '1', fontSize: 14, fill: '#fff', offsetX: 5, offsetY: 7, listening: false });
    // Hit area
    group.add(new Konva.Circle({ radius: 16, fill: 'rgba(0,0,0,0.001)', listening: true }));
    group.add(nucleus);
    group.add(text);
    group._nucleus = nucleus;
    group._isCentered = true;
    return group;
  });

  shapes.register('axis', cfg => {
    const group = new Konva.Group({ ...cfg, draggable: cfg.draggable ?? true });
    const size = cfg.size || 200;
    const color = cfg.fill || '#555';
    // Hit area (square covering the axes)
    group.add(new Konva.Rect({ x: -size / 2, y: -size / 2, width: size, height: size, fill: 'rgba(0,0,0,0.001)', listening: true }));
    // X axis
    group.add(new Konva.Arrow({ points: [-size / 2, 0, size / 2, 0], pointerLength: 10, pointerWidth: 10, fill: color, stroke: color, strokeWidth: 2, listening: false }));
    // Y axis
    group.add(new Konva.Arrow({ points: [0, size / 2, 0, -size / 2], pointerLength: 10, pointerWidth: 10, fill: color, stroke: color, strokeWidth: 2, listening: false }));
    group._isCentered = true;
    return group;
  });

  shapes.register('timeline-dot', cfg => {
    const group = new Konva.Group({ ...cfg, draggable: cfg.draggable ?? true });
    const nucleus = new Konva.Circle({ radius: 8, fill: cfg.fill || '#333', stroke: '#fff', strokeWidth: 2, listening: false });
    // Hit area
    group.add(new Konva.Rect({ x: -50, y: -10, width: 100, height: 20, fill: 'rgba(0,0,0,0.001)', listening: true }));
    group.add(new Konva.Line({ points: [-50, 0, 50, 0], stroke: cfg.fill || '#333', strokeWidth: 2, listening: false }));
    group.add(nucleus);
    group._nucleus = nucleus;
    group._isCentered = true;
    return group;
  });

  shapes.register('callout', cfg => {
    return new Konva.Shape({
      ...cfg,
      sceneFunc(ctx, shape) {
        const w = cfg.width || 120;
        const h = cfg.height || 40;
        ctx.beginPath();
        ctx.rect(0, 0, w, h);
        ctx.moveTo(w / 2, h);
        ctx.lineTo(w / 2 - 10, h + 20);
        ctx.lineTo(w / 2 + 10, h);
        ctx.fillStrokeShape(shape);
      }
    });
  });

  shapes.register('curly-brace', cfg => {
    const w = cfg.width || 40;
    const h = cfg.height || 100;
    return new Konva.Path({
      ...cfg,
      data: `M ${w} 0 Q 0 0 0 ${h / 4} T 0 ${h / 2} Q 0 ${h} ${w} ${h}`,
      strokeWidth: 3,
      lineCap: 'round',
      tension: 0.5
    });
  });

  shapes.register('angle-marker', cfg => {
    return new Konva.Arc({
      ...cfg,
      innerRadius: cfg.innerRadius || 20,
      outerRadius: cfg.outerRadius || 25,
      angle: cfg.angle || 90,
      fill: cfg.fill || 'rgba(255, 0, 0, 0.3)',
      stroke: cfg.stroke || 'red',
      strokeWidth: 1
    });
  });

  shapes.register('beaker', cfg => {
    return new Konva.Shape({
      ...cfg,
      sceneFunc(ctx, shape) {
        const w = cfg.width || 60;
        const h = cfg.height || 80;
        const r = 5;
        ctx.beginPath();
        ctx.moveTo(r, 0);
        ctx.lineTo(w - r, 0);
        ctx.lineTo(w, h - r);
        ctx.quadraticCurveTo(w, h, w - r, h);
        ctx.lineTo(r, h);
        ctx.quadraticCurveTo(0, h, 0, h - r);
        ctx.lineTo(r, 0);
        ctx.closePath();
        if (cfg.liquidColor) {
          ctx.fillStyle = cfg.liquidColor;
          ctx.beginPath();
          ctx.rect(r, h * 0.4, w - 2 * r, h * 0.55);
          ctx.fill();
        }
        ctx.fillStrokeShape(shape);
      }
    });
  });

  shapes.register('checkmark', cfg =>
    new Konva.Path({
      ...cfg,
      data: 'M1 7 l4 4 l8 -8',
      strokeWidth: 4,
      lineCap: 'round',
      stroke: cfg.stroke || '#4CAF50'
    })
  );

  shapes.register('x-mark', cfg =>
    new Konva.Path({
      ...cfg,
      data: 'M1 1 l10 10 M11 1 l-10 10',
      strokeWidth: 4,
      lineCap: 'round',
      stroke: cfg.stroke || '#F44336'
    })
  );

  shapes.register('dna-helix', cfg => {
    return new Konva.Shape({
      ...cfg,
      sceneFunc(ctx, shape) {
        const w = cfg.width || 40;
        const h = cfg.height || 120;
        const steps = 15;
        // Strand 1
        ctx.beginPath();
        for (let i = 0; i <= steps; i++) {
          const y = (i / steps) * h;
          const x = Math.sin((y / h) * Math.PI * 4) * (w / 2) + w / 2;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        // Strand 2
        ctx.beginPath();
        for (let i = 0; i <= steps; i++) {
          const y = (i / steps) * h;
          const x = Math.sin((y / h) * Math.PI * 4 + Math.PI) * (w / 2) + w / 2;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.fillStrokeShape(shape);
      }
    });
  });

  shapes.register('lightbulb', cfg => {
    return new Konva.Shape({
      ...cfg,
      sceneFunc(ctx, shape) {
        const r = 20;
        ctx.beginPath();
        ctx.arc(r, r, r, 0.7 * Math.PI, 0.3 * Math.PI, false);
        ctx.lineTo(r + 10, r + 35);
        ctx.lineTo(r - 10, r + 35);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        // Base lines
        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          ctx.moveTo(r - 8, r + 38 + i * 4);
          ctx.lineTo(r + 8, r + 38 + i * 4);
          ctx.stroke();
        }
        ctx.fillStrokeShape(shape);
      }
    });
  });

  shapes.register('warning-sign', cfg => {
    const group = new Konva.Group({ ...cfg, draggable: cfg.draggable ?? true });
    const nucleus = new Konva.RegularPolygon({ sides: 3, radius: 30, fill: '#FFC107', stroke: '#000', strokeWidth: 2, listening: false });
    // Hit area
    group.add(new Konva.Circle({ radius: 32, fill: 'rgba(0,0,0,0.001)', listening: true }));
    group.add(nucleus);
    group.add(new Konva.Text({ text: '!', fontSize: 24, fontStyle: 'bold', fill: '#000', offsetX: 4, offsetY: 12, listening: false }));
    group._nucleus = nucleus;
    group._isCentered = true;
    return group;
  });

  shapes.register('atom', cfg => {
    const group = new Konva.Group({ ...cfg, draggable: cfg.draggable ?? true });
    const r = 30;
    const nucleus = new Konva.Circle({ radius: 8, fill: cfg.fill || '#333', listening: false });
    // Hit area
    group.add(new Konva.Circle({ radius: r + 6, fill: 'rgba(0,0,0,0.001)', listening: true }));
    // Orbits
    for (let i = 0; i < 3; i++) {
      group.add(new Konva.Ellipse({ radiusX: r, radiusY: 12, rotation: i * 60, stroke: cfg.stroke || '#888', strokeWidth: 1, listening: false }));
    }
    group.add(nucleus);
    group._nucleus = nucleus;
    group._isCentered = true;
    return group;
  });

  shapes.register('open-book', cfg => {
    return new Konva.Shape({
      ...cfg,
      sceneFunc(ctx, shape) {
        const w = 60;
        const h = 40;
        // Left page
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(w / 2, -10, w, 0);
        ctx.lineTo(w, h);
        ctx.quadraticCurveTo(w / 2, h - 10, 0, h);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        // Right page
        ctx.beginPath();
        ctx.moveTo(w, 0);
        ctx.quadraticCurveTo(w + w / 2, -10, w * 2, 0);
        ctx.lineTo(w * 2, h);
        ctx.quadraticCurveTo(w + w / 2, h - 10, w, h);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.fillStrokeShape(shape);
      }
    });
  });

  shapes.register('gear', cfg => {
    return new Konva.Shape({
      ...cfg,
      sceneFunc(ctx, shape) {
        const r = 30;
        const inner = 15;
        const teeth = 8;
        ctx.beginPath();
        for (let i = 0; i < teeth * 2; i++) {
          const angle = (i / (teeth * 2)) * Math.PI * 2;
          const dist = i % 2 === 0 ? r : r - 8;
          ctx.lineTo(r + dist * Math.cos(angle), r + dist * Math.sin(angle));
        }
        ctx.closePath();
        ctx.moveTo(r + inner, r);
        ctx.arc(r, r, inner, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.stroke();
        ctx.fillStrokeShape(shape);
      }
    });
  });

  shapes.register('magnifier', cfg => {
    const group = new Konva.Group({ ...cfg, draggable: cfg.draggable ?? true });
    const nucleus = new Konva.Circle({ radius: 20, fill: 'rgba(173,216,230,0.3)', stroke: '#333', strokeWidth: 3, listening: false });
    // Hit area
    group.add(new Konva.Circle({ radius: 22, fill: 'rgba(0,0,0,0.001)', listening: true }));
    group.add(nucleus);
    group.add(new Konva.Line({ points: [14, 14, 30, 30], stroke: '#333', strokeWidth: 5, lineCap: 'round', listening: false }));
    group._nucleus = nucleus;
    group._isCentered = true;
    return group;
  });

  shapes.register('grid-node', cfg =>
    new Konva.Circle({
      ...cfg,
      radius: 4,
      fill: cfg.fill || '#ccc',
      stroke: 'transparent'
    })
  );

  // ── CHEMICAL ELEMENTS — Bohr Model (nucleus + electron shells) ─────────────
  // Agent uses `atom-H`, `atom-C`, `atom-O`, etc.
  // CPK colors for nucleus; correct electron counts per shell.
  const ELEMENTS = [
    { symbol: 'H', num: 1, shells: [1], fill: '#FFFFFF', textFill: '#333', border: '#999' },
    { symbol: 'He', num: 2, shells: [2], fill: '#D9FFFF', textFill: '#333', border: '#8BB' },
    { symbol: 'Li', num: 3, shells: [2, 1], fill: '#CC80FF', textFill: '#fff', border: '#9955CC' },
    { symbol: 'Be', num: 4, shells: [2, 2], fill: '#C2FF00', textFill: '#333', border: '#99CC00' },
    { symbol: 'B', num: 5, shells: [2, 3], fill: '#FFB5B5', textFill: '#333', border: '#CC8888' },
    { symbol: 'C', num: 6, shells: [2, 4], fill: '#404040', textFill: '#fff', border: '#222' },
    { symbol: 'N', num: 7, shells: [2, 5], fill: '#3050F8', textFill: '#fff', border: '#1030CC' },
    { symbol: 'O', num: 8, shells: [2, 6], fill: '#FF0D0D', textFill: '#fff', border: '#CC0000' },
    { symbol: 'F', num: 9, shells: [2, 7], fill: '#90E050', textFill: '#333', border: '#60BB20' },
    { symbol: 'Ne', num: 10, shells: [2, 8], fill: '#B3E3F5', textFill: '#333', border: '#80AABB' },
    { symbol: 'Na', num: 11, shells: [2, 8, 1], fill: '#AB5CF2', textFill: '#fff', border: '#7733BB' },
    { symbol: 'Mg', num: 12, shells: [2, 8, 2], fill: '#8AFF00', textFill: '#333', border: '#55CC00' },
    { symbol: 'Al', num: 13, shells: [2, 8, 3], fill: '#BFA6A6', textFill: '#333', border: '#998080' },
    { symbol: 'Si', num: 14, shells: [2, 8, 4], fill: '#F0C8A0', textFill: '#333', border: '#CC9966' },
    { symbol: 'P', num: 15, shells: [2, 8, 5], fill: '#FF8000', textFill: '#fff', border: '#CC5500' },
    { symbol: 'S', num: 16, shells: [2, 8, 6], fill: '#FFFF30', textFill: '#333', border: '#CCCC00' },
    { symbol: 'Cl', num: 17, shells: [2, 8, 7], fill: '#1FF01F', textFill: '#333', border: '#00CC00' },
    { symbol: 'Ar', num: 18, shells: [2, 8, 8], fill: '#80D1E3', textFill: '#333', border: '#559999' },
    { symbol: 'K', num: 19, shells: [2, 8, 8, 1], fill: '#8F40D4', textFill: '#fff', border: '#5C2299' },
    { symbol: 'Ca', num: 20, shells: [2, 8, 8, 2], fill: '#3DFF00', textFill: '#333', border: '#22CC00' },
  ];

  ELEMENTS.forEach(el => {
    shapes.register(`atom-${el.symbol}`, cfg => {
      const scale = cfg.scale || 1;
      const NUCLEUS_R = 18 * scale;
      const SHELL_GAP = 22 * scale;
      const ELECTRON_R = 4 * scale;
      // Pass draggable through so ShapeRegistry.create()'s base config is respected
      const group = new Konva.Group({
        x: cfg.x || 0,
        y: cfg.y || 0,
        draggable: cfg.draggable ?? true,
      });

      // ── INVISIBLE HIT AREA — covers full atom so group is selectable/draggable
      // (All other children have listening:false, so this is the sole event target)
      const outerR = NUCLEUS_R + SHELL_GAP * el.shells.length;
      group.add(new Konva.Circle({
        radius: outerR,
        fill: 'rgba(0,0,0,0.001)', // near-invisible but registers Konva hit tests
        stroke: 'transparent',
        listening: true,
      }));

      // ── Electron shells + electrons (drawn behind nucleus) ──────────

      el.shells.forEach((electronCount, shellIdx) => {
        const shellR = NUCLEUS_R + SHELL_GAP * (shellIdx + 1);

        // Dashed orbit ring — non-interactive, events pass through to group
        group.add(new Konva.Circle({
          radius: shellR,
          fill: 'transparent',
          stroke: cfg.shellColor || 'rgba(120,180,255,0.5)',
          strokeWidth: 1.2 * scale,
          dash: [4, 3],
          listening: false,
        }));

        // Electron dots — non-interactive, NO shadow (shadowBlur is per-node per-frame, very expensive)
        for (let e = 0; e < electronCount; e++) {
          const angle = ((e / electronCount) * Math.PI * 2) - Math.PI / 2;
          group.add(new Konva.Circle({
            x: shellR * Math.cos(angle),
            y: shellR * Math.sin(angle),
            radius: ELECTRON_R,
            fill: cfg.electronColor || '#7EC8FF',
            stroke: '#fff',
            strokeWidth: 0.8 * scale,
            listening: false,
          }));
        }
      });

      // ── Nucleus ─────────────────────────────────────────────────────
      const nucleus = new Konva.Circle({
        radius: NUCLEUS_R,
        fill: cfg.fill || el.fill,
        stroke: el.border,
        strokeWidth: 2 * scale,
        shadowColor: el.border,
        shadowBlur: 8,
        shadowOpacity: 0.5,
        listening: false,
      });
      group.add(nucleus);

      // Expose nucleus for AnimationRegistry — fill/shadow animations
      // will target this node instead of the Group (which ignores fill)
      group._nucleus = nucleus;
      // Tell _shiftToCenter this group is already origin-centered
      group._isCentered = true;

      // Symbol — centered in nucleus
      const symSize = el.symbol.length > 1 ? NUCLEUS_R * 0.9 : NUCLEUS_R * 1.1;
      group.add(new Konva.Text({
        text: el.symbol,
        fontSize: symSize,
        fontFamily: "'Arial', sans-serif",
        fontStyle: 'bold',
        fill: el.textFill,
        align: 'center',
        width: NUCLEUS_R * 2,
        offsetX: NUCLEUS_R,
        offsetY: symSize * 0.5,
        listening: false,
      }));

      // Atomic number — small, top-left of nucleus
      group.add(new Konva.Text({
        text: String(el.num),
        fontSize: NUCLEUS_R * 0.45,
        fontFamily: "'Arial', sans-serif",
        fill: el.textFill,
        opacity: 0.8,
        x: -NUCLEUS_R + 2 * scale,
        y: -NUCLEUS_R + 2 * scale,
        listening: false,
      }));

      return group;
    });
  });
}

