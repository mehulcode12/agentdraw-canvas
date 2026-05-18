# 🎨 AgentDraw canvas

AgentDraw is an AI-ready, multimodal canvas drawing library built on Konva.js. It bridges the gap between LLMs and visual interfaces by providing headless spatial reasoning APIs alongside a rich, extensible diagramming whiteboard.

[![npm version](https://img.shields.io/npm/v/agentdraw-canvas.svg)](https://npmjs.org/package/agentdraw-canvas)
[![Konva](https://img.shields.io/badge/Konva-v9-blue)](https://konvajs.org/)

---

## 🚀 Quick Start

Install via npm:
```bash
npm install agentdraw-canvas
```

**Basic Usage:**
```html
<script type="module">
  import { CanvasStudio } from 'agentdraw-canvas';

  // Initialize the full interactive studio
  const studio = new CanvasStudio();
  window.studio = studio; // Expose for console testing / agent access

  // Programmatically add a shape
  studio.Shapes.create('rect', { x: 100, y: 100, width: 120, height: 80 });
</script>
```

---

## 🤖 Agent-Ready API (v2.0)

AgentDraw v2 introduces a dedicated `studio.Agent` namespace, turning the canvas into a deterministic environment for multimodal AI agents.

---

## ✨ Studio Features

- 🧩 **Fully modular** — 13 independent ES modules
- 🔌 **Plugin API** — register custom shapes, animations, tools
- 🎨 **40+ Built-in Shapes** — including 20 Bohr model Atoms (H–Ca), Physics mechanics, and Teacher essentials
- 🎭 **20 animations** — pulse, spin, float, rainbow, glitch, orbit, and more
- 🖱️ **Smooth pan & zoom** — wheel zoom toward cursor, space/middle-mouse pan
- 🌗 **Dark & light modes** — persisted to localStorage
- ✏️ **Pencil tool** with live colour/size cursor
- 🖊️ **Inline text editing** — click to place, double-click to edit

---

## 🔌 Plugin API

Extend the canvas without touching core files:

```js
// 1. Add a custom shape
studio.Shapes.register('cloud', (cfg) => {
  return new Konva.Circle({ ...cfg, radius: 30 }); // Return any Konva Group/Node
});

// 2. Add a custom tool
studio.Tools.register('stamp', {
  label: 'Stamp', icon: '🔖', shortcut: 'Q', cursor: 'crosshair',
  onMousedown: (e, services) => services.shapes.quickAdd('star')
});

// 3. Listen to events
studio.Events.on('selection:change', shape => console.log('Selected:', shape));
```

---

## 📖 API Reference

See [docs/API.md](docs/API.md) for the full public API reference.  
See [docs/EXTENDING.md](docs/EXTENDING.md) for the plugin authoring guide.

---

## 📄 License

Made with ❤️ by **Mehul Ligade**
