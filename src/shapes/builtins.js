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
    const group = new Konva.Group(cfg);
    const circle = new Konva.Circle({
      radius: 15,
      fill: cfg.fill || '#333',
      stroke: '#fff',
      strokeWidth: 2
    });
    const text = new Konva.Text({
      text: cfg.text || '1',
      fontSize: 14,
      fill: '#fff',
      offsetX: 5,
      offsetY: 7
    });
    group.add(circle);
    group.add(text);
    return group;
  });

  shapes.register('axis', cfg => {
    const group = new Konva.Group(cfg);
    const size = cfg.size || 200;
    // X axis
    group.add(new Konva.Arrow({
      points: [-size / 2, 0, size / 2, 0],
      pointerLength: 10,
      pointerWidth: 10,
      fill: cfg.fill || '#555',
      stroke: cfg.fill || '#555',
      strokeWidth: 2
    }));
    // Y axis
    group.add(new Konva.Arrow({
      points: [0, size / 2, 0, -size / 2],
      pointerLength: 10,
      pointerWidth: 10,
      fill: cfg.fill || '#555',
      stroke: cfg.fill || '#555',
      strokeWidth: 2
    }));
    return group;
  });

  shapes.register('timeline-dot', cfg => {
    const group = new Konva.Group(cfg);
    group.add(new Konva.Line({
      points: [-50, 0, 50, 0],
      stroke: cfg.fill || '#333',
      strokeWidth: 2
    }));
    group.add(new Konva.Circle({
      radius: 8,
      fill: cfg.fill || '#333',
      stroke: '#fff',
      strokeWidth: 2
    }));
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
}


