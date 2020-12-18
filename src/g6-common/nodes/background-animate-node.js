import G6 from "@antv/g6";

G6.registerNode(
  'background-animate',
  {
    afterDraw(cfg, group) {
      const r = cfg.size / 2;
      const back1 = group.addShape('circle', {
        zIndex: -3,
        attrs: {
          x: 0,
          y: 0,
          r,
          fill: cfg.color,
          opacity: 0.6,
        },
        name: 'back1-shape',
      });
      const back2 = group.addShape('circle', {
        zIndex: -2,
        attrs: {
          x: 0,
          y: 0,
          r,
          fill: cfg.color,
          opacity: 0.6,
        },
        name: 'back2-shape',
      });
      const back3 = group.addShape('circle', {
        zIndex: -1,
        attrs: {
          x: 0,
          y: 0,
          r,
          fill: cfg.color,
          opacity: 0.6,
        },
        name: 'back3-shape',
      });
      group.sort(); // Sort according to the zIndex
      back1.animate(
        {
          // Magnifying and disappearing
          r: r + 10,
          opacity: 0.1,
        },
        {
          duration: 3000,
          easing: 'easeCubic',
          delay: 0,
          repeat: true, // repeat
        },
      ); // no delay
      back2.animate(
        {
          // Magnifying and disappearing
          r: r + 10,
          opacity: 0.1,
        },
        {
          duration: 3000,
          easing: 'easeCubic',
          delay: 1000,
          repeat: true, // repeat
        },
      ); // 1s delay
      back3.animate(
        {
          // Magnifying and disappearing
          r: r + 10,
          opacity: 0.1,
        },
        {
          duration: 3000,
          easing: 'easeCubic',
          delay: 2000,
          repeat: true, // repeat
        },
      ); // 3s delay
    },
  },
  'circle',
);