# 🎨 AgentDraw canvas

A **modular, extensible canvas drawing library** built on [Konva.js](https://konvajs.org/).  
Plugin-ready architecture — add custom shapes, animations, and tools without touching core files.

[![Konva](https://img.shields.io/badge/Konva-v9-blue)](https://konvajs.org/)

---

## ✨ Features

- 🧩 **Fully modular** — 13 independent ES modules
- 🔌 **Plugin API** — register custom shapes, animations, tools
- 🎨 **40+ Built-in Shapes** — including 20 Bohr model Atoms (H–Ca), Physics mechanics (car, spring, pulley, incline), and Teacher essentials (curly brace, beaker, magnifier)
- 🎭 **20 animations** — pulse, spin, float, rainbow, glitch, orbit, and more
- 🖱️ **Smooth pan & zoom** — wheel zoom toward cursor, space/middle-mouse pan
- 🌗 **Dark & light modes** — persisted to localStorage
- ✏️ **Pencil tool** with live colour/size cursor
- 🖊️ **Inline text editing** — click to place, double-click to edit
- ↶ **Undo/redo** — 60-step history with batch operations
- 🤖 **Agent-ready API** — UUID-based shape targeting, state serialization, batch operations
- 📦 **Zero build step** — works with `npx serve .`

---

## 🚀 Quick Start

```bash
git clone https://github.com/mehulcode12/agentdraw-canvas.git
cd agentdraw-canvas
npx serve .          # opens on http://localhost:3000
```

No bundler required. Runs as native ES modules in modern browsers.

---

## 📁 Project Structure

```
agentdraw-canvas/
├── index.html                  ← Entry point (HTML)
├── package.json
├── src/
│   ├── EventBus.js             ← Pub/sub event system
│   ├── CanvasStudio.js         ← Public API orchestrator
│   ├── core/
│   │   ├── Core.js             ← Konva stage, layer, transformer
│   │   └── History.js          ← Undo / redo
│   ├── ui/
│   │   ├── Theme.js            ← Dark / light mode
│   │   └── UI.js               ← Stats, toast, cursors, props
│   ├── modules/
│   │   ├── Color.js            ← Colour palette
│   │   ├── Interaction.js      ← Hover, select, drag
│   │   ├── Drawing.js          ← Pencil + drag-draw
│   │   ├── Text.js             ← Text placement & editing
│   │   ├── PanZoom.js          ← Pan / zoom
│   │   └── Export.js           ← PNG / SVG / JSON + Agent API
│   ├── registry/
│   │   ├── ShapeRegistry.js    ← Extensible shape factory
│   │   ├── ToolRegistry.js     ← Extensible tool system
│   │   └── AnimationRegistry.js← Extensible animation engine
│   ├── shapes/
│   │   └── builtins.js         ← Built-in shape registrations
│   ├── animations/
│   │   └── builtins.js         ← 20 built-in animation presets
│   └── tools/
│       └── definitions.js      ← Built-in tool registrations
├── styles/
│   ├── theme.css               ← CSS variables (dark + light)
│   ├── base.css                ← Reset + layout
│   └── components.css          ← All UI components
├── docs/
│   ├── API.md                  ← Full API reference
│   └── EXTENDING.md            ← Plugin authoring guide
└── examples/
    └── custom-plugin.html      ← Custom shape + animation example
```

---

## 🔌 Plugin API

### Add a custom shape

```js
studio.Shapes.register('cloud', (cfg) => {
  const group = new Konva.Group(cfg);
  const blobs = [
    { x: 0,  y: 0,  r: 30 }, { x: 40, y: -10, r: 35 },
    { x: 75, y: 0,  r: 30 }, { x: 20, y: 15,  r: 25 },
  ];
  blobs.forEach(b => group.add(
    new Konva.Circle({ x: b.x, y: b.y, radius: b.r, fill: cfg.fill })
  ));
  return group;
});

studio.Shapes.quickAdd('cloud');
```

### Add a custom animation

```js
studio.Animations.register(
  'disco',
  (shape, state, layer) =>
    new Konva.Animation(frame => {
      shape.rotation(state.origRot + frame.time / 500 * 360);
      shape.fill(`hsl(${frame.time / 5 % 360}, 80%, 60%)`);
    }, layer),
  { icon: '🪩', label: 'Disco' }          // appears in the panel
);
```

### Add a custom tool

```js
studio.Tools.register('stamp', {
  label: 'Stamp', icon: '🔖', shortcut: 'Q', cursor: 'crosshair',
  onMousedown: (e, services) => {
    if (e.target !== services.core.stage) return;
    services.shapes.quickAdd('star');
  },
});
```

### Listen to events

```js
studio.Events.on('selection:change', shape => {
  console.log('Selected:', shape?.getClassName());
});

studio.Events.on('animation:start', ({ shapeId, type }) => {
  console.log('Animation started:', type);
});
```

---

## 🌗 Dark / Light Mode

```js
studio.Theme.toggle();          // toggle
studio.Theme.mode();            // 'dark' | 'light'
```

Or click the ☀️/🌙 button in the header. Preference is saved to `localStorage`.

---

## 🤖 Agent-Ready Features

AgentDraw Canvas includes APIs designed for AI agents and programmatic control:

### UUID-Based Shape Targeting

Every shape gets a stable, unique identifier:

```js
const circle = studio.Shapes.create('circle');
console.log(circle._publicId);  // 'a0b1c2d3-e4f5-...'

// Target shape by UUID later
studio.Shapes.updateById(circle._publicId, { fill: '#ff0000' });
```

### State Serialization

Export and restore complete canvas state:

```js
// Save state
const state = studio.Export.getState();
localStorage.setItem('canvas', JSON.stringify(state));

// Restore state
const saved = JSON.parse(localStorage.getItem('canvas'));
studio.Export.loadState(saved);
```

### Batch Operations

Group multiple operations into a single undo step:

```js
studio.History.batch(() => {
  studio.Shapes.create('circle', { x: 100, y: 100 });
  studio.Shapes.create('rect', { x: 200, y: 200 });
  studio.Shapes.create('star', { x: 300, y: 300 });
});
// All 3 shapes = 1 undo action
```

---

## 📖 API Reference

See [docs/API.md](docs/API.md) for the full public API reference.  
See [docs/EXTENDING.md](docs/EXTENDING.md) for the plugin authoring guide.

---

## 📄 License

Made with ❤️ by **Mehul Ligade**
