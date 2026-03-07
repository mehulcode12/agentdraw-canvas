/**
 * Built-in animations — registers all 20 default animation presets.
 * Import and call registerBuiltinAnimations(services) during bootstrap.
 *
 * Each factory signature: (shape, state, layer) => Konva.Animation | null
 *   shape — Konva node (already centre-shifted by AnimationRegistry)
 *   state — { origX, origY, origRot, origScaleX, origScaleY, origOpacity, origFill, ... }
 *   layer — Konva.Layer for Konva.Animation constructor
 */
export function registerBuiltinAnimations(services) {
  const { animations } = services;
  const reg = (type, meta, factory) => animations.register(type, factory, meta);

  reg('pulse', { icon: '💓', label: 'Pulse' }, (shape, s, layer) =>
    new Konva.Animation(f => {
      const v = 1 + 0.09 * Math.sin(f.time / 1000 * Math.PI * 2);
      shape.scaleX(s.origScaleX * v);
      shape.scaleY(s.origScaleY * v);
    }, layer)
  );

  reg('spin', { icon: '🌀', label: 'Spin' }, (shape, s, layer) =>
    new Konva.Animation(f => {
      shape.rotation(s.origRot + f.time / 1000 * 90);
    }, layer)
  );

  reg('float', { icon: '☁️', label: 'Float' }, (shape, s, layer) =>
    new Konva.Animation(f => {
      shape.y(s.origY + Math.sin(f.time / 1000 * Math.PI) * 10);
    }, layer)
  );

  reg('rainbow', { icon: '🌈', label: 'Rainbow' }, (shape, s, layer) => {
    const ft = s.fillTarget || shape;
    if (!ft.fill) return null;
    return new Konva.Animation(f => {
      const t = (f.time / 100) % 360;
      const R = Math.round(127 + 127 * Math.sin(t * Math.PI / 180));
      const G = Math.round(127 + 127 * Math.sin((t + 120) * Math.PI / 180));
      const B = Math.round(127 + 127 * Math.sin((t + 240) * Math.PI / 180));
      ft.fill(`rgb(${R},${G},${B})`);
    }, layer);
  });

  reg('shake', { icon: '😵', label: 'Shake' }, (shape, s, layer) =>
    new Konva.Animation(f => {
      shape.x(s.origX + Math.sin(f.time / 1000 * 30) * 4);
    }, layer)
  );

  reg('bounce', { icon: '🏀', label: 'Bounce' }, (shape, s, layer) =>
    new Konva.Animation(f => {
      const t = (f.time / 700) % 1;
      shape.y(s.origY - Math.abs(Math.sin(t * Math.PI)) * 20);
    }, layer)
  );

  reg('jello', { icon: '🍮', label: 'Jello' }, (shape, s, layer) =>
    new Konva.Animation(f => {
      const t = f.time / 1000;
      shape.scaleX(s.origScaleX * (1 + 0.07 * Math.sin(t * Math.PI * 4)));
      shape.scaleY(s.origScaleY * (1 - 0.05 * Math.sin(t * Math.PI * 4)));
    }, layer)
  );

  reg('flash', { icon: '⚡', label: 'Flash' }, (shape, s, layer) =>
    new Konva.Animation(f => {
      shape.opacity(Math.round(f.time / 500) % 2 === 0 ? s.origOpacity : s.origOpacity * 0.4);
    }, layer)
  );

  reg('heartbeat', { icon: '❤️', label: 'Heart' }, (shape, s, layer) =>
    new Konva.Animation(f => {
      const t = (f.time / 900) % 1;
      let v = 1;
      if (t < 0.1) v = 1 + t * 1.5;
      else if (t < 0.2) v = 1.15 - (t - 0.1) * 1.5;
      else if (t < 0.3) v = 1 + (t - 0.2);
      else if (t < 0.4) v = 1.1 - (t - 0.3) * 1.5;
      shape.scaleX(s.origScaleX * v);
      shape.scaleY(s.origScaleY * v);
    }, layer)
  );

  reg('rubberband', { icon: '🎸', label: 'Rubber' }, (shape, s, layer) =>
    new Konva.Animation(f => {
      const t = (f.time / 1200) % 1;
      let sx = 1, sy = 1;
      if (t < 0.3) { sx = 1 + t * 0.6; sy = 1 - t * 0.25; }
      else if (t < 0.5) { sx = 1.18 - (t - 0.3) * 0.9; sy = 0.925 + (t - 0.3) * 0.35; }
      else {
        const d = (t - 0.5) / 0.5;
        sx = 1 + 0.03 * Math.sin(d * Math.PI * 4) * (1 - d);
        sy = 1 - 0.03 * Math.sin(d * Math.PI * 4) * (1 - d);
      }
      shape.scaleX(s.origScaleX * sx);
      shape.scaleY(s.origScaleY * sy);
    }, layer)
  );

  reg('swing', { icon: '🎪', label: 'Swing' }, (shape, s, layer) =>
    new Konva.Animation(f => {
      shape.rotation(s.origRot + 15 * Math.sin(f.time / 1000 * Math.PI * 1.5));
    }, layer)
  );

  reg('wobble', { icon: '〰️', label: 'Wobble' }, (shape, s, layer) =>
    new Konva.Animation(f => {
      const t = f.time / 1000;
      shape.rotation(s.origRot + 7 * Math.sin(t * 8));
      shape.x(s.origX + 2.5 * Math.sin(t * 8 + 1));
    }, layer)
  );

  reg('twinkle', { icon: '✨', label: 'Twinkle' }, (shape, s, layer) =>
    new Konva.Animation(f => {
      const t = f.time / 1000;
      const v = 0.82 + 0.18 * Math.abs(Math.sin(t * 3));
      const sc = 0.96 + 0.06 * Math.abs(Math.sin(t * 3));
      shape.opacity(s.origOpacity * v);
      shape.scaleX(s.origScaleX * sc);
      shape.scaleY(s.origScaleY * sc);
    }, layer)
  );

  reg('orbit', { icon: '🔮', label: 'Orbit' }, (shape, s, layer) =>
    new Konva.Animation(f => {
      const t = f.time / 1000;
      shape.x(s.origX + 18 * Math.cos(t * 2));
      shape.y(s.origY + 18 * Math.sin(t * 2));
    }, layer)
  );

  reg('wave', { icon: '🌊', label: 'Wave' }, (shape, s, layer) =>
    new Konva.Animation(f => {
      const t = f.time / 1000;
      shape.x(s.origX + 20 * Math.sin(t * 2));
      shape.y(s.origY + 10 * Math.sin(t * 4));
    }, layer)
  );

  reg('spiral', { icon: '🌀', label: 'Spiral' }, (shape, s, layer) =>
    new Konva.Animation(f => {
      const t = (f.time / 2500) % 1;
      const p = t < 0.5 ? t * 2 : (1 - t) * 2;
      shape.rotation(s.origRot + f.time / 1000 * 120);
      const sc = 0.65 + p * 0.4;
      shape.scaleX(s.origScaleX * sc);
      shape.scaleY(s.origScaleY * sc);
    }, layer)
  );

  reg('pop', { icon: '💥', label: 'Pop' }, (shape, s, layer) =>
    new Konva.Animation(f => {
      const t = (f.time / 600) % 1;
      const v = t < 0.2 ? 1 + t * 5 * 0.2 : Math.max(1, 1.2 - (t - 0.2) * 0.3);
      shape.scaleX(s.origScaleX * v);
      shape.scaleY(s.origScaleY * v);
    }, layer)
  );

  reg('glitch', { icon: '👾', label: 'Glitch' }, (shape, s, layer) => {
    const ft = s.fillTarget || shape;
    if (!ft.fill) return null;
    const cols = ['#ff0000', '#00ffff', '#ff00ff'];
    return new Konva.Animation(f => {
      const tick = Math.floor(f.time / 100);
      if (tick % 6 === 0) {
        shape.x(s.origX + (Math.random() - 0.5) * 10);
        shape.y(s.origY + (Math.random() - 0.5) * 6);
        ft.fill(cols[Math.floor(Math.random() * cols.length)]);
      } else {
        shape.x(s.origX);
        shape.y(s.origY);
        if (s.origFill) ft.fill(s.origFill);
      }
    }, layer);
  });

  reg('pendulum', { icon: '⏳', label: 'Pendulum' }, (shape, s, layer) =>
    new Konva.Animation(f => {
      shape.rotation(s.origRot + 20 * Math.cos(f.time / 1000 * 2.5));
    }, layer)
  );

  reg('throb', { icon: '🫀', label: 'Throb' }, (shape, s, layer) => {
    const ft = s.fillTarget || shape;
    return new Konva.Animation(f => {
      const pulse = 0.5 + 0.5 * Math.sin(f.time / 1000 * Math.PI);
      shape.scaleX(s.origScaleX * (1 + 0.04 * pulse));
      shape.scaleY(s.origScaleY * (1 + 0.04 * pulse));
      if (ft.shadowBlur) ft.shadowBlur(8 + 14 * pulse);
      if (ft.shadowColor) ft.shadowColor('var(--accent)');
    }, layer);
  });

  reg('fade-in', { icon: '👁️', label: 'Fade In' }, (shape, s, layer) =>
    new Konva.Animation(f => {
      const p = Math.min(1, f.time / 800);
      shape.opacity(s.origOpacity * p);
    }, layer)
  );

  reg('highlight-pulse', { icon: '✨', label: 'Highlight' }, (shape, s, layer) =>
    new Konva.Animation(f => {
      const p = 1 + 0.15 * Math.sin(f.time / 300 * Math.PI * 2);
      shape.scaleX(s.origScaleX * p);
      shape.scaleY(s.origScaleY * p);
      shape.stroke(f.time % 400 < 200 ? 'var(--accent)' : s.origStroke);
    }, layer)
  );

  reg('draw-on', { icon: '✍️', label: 'Draw' }, (shape, s, layer) => {
    if (!shape.dash) shape.dash([1000, 1000]); // Large dash to simulate path length
    return new Konva.Animation(f => {
      const p = Math.min(1, f.time / 1000);
      shape.dashOffset(1000 * (1 - p));
    }, layer);
  });
}

