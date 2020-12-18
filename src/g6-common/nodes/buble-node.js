import G6 from "@antv/g6";
G6.registerNode(
    'bubble',
    {
        drawShape(cfg, group) {
            const self = this;
            const r = cfg.size / 2;
            // a circle by path
            const path = [
                ['M', -r, 0],
                ['C', -r, r / 2, -r / 2, r, 0, r],
                ['C', r / 2, r, r, r / 2, r, 0],
                ['C', r, -r / 2, r / 2, -r, 0, -r],
                ['C', -r / 2, -r, -r, -r / 2, -r, 0],
                ['Z'],
            ];
            const keyShape = group.addShape('path', {
                attrs: {
                    x: 0,
                    y: 0,
                    path,
                    fill: cfg.color || 'steelblue',
                },
                name: 'path-shape',
            });

            const mask = group.addShape('path', {
                attrs: {
                    x: 0,
                    y: 0,
                    path,
                    opacity: 0.25,
                    fill: cfg.color || 'steelblue',
                    shadowColor: cfg.color.split(' ')[2].substr(2),
                    shadowBlur: 40,
                    shadowOffsetX: 0,
                    shadowOffsetY: 30,
                },
                name: 'mask-shape',
            });

            const spNum = 10; // split points number
            const directions = [],
                rs = [];
            self.changeDirections(spNum, directions);
            for (let i = 0; i < spNum; i++) {
                const rr = r + directions[i] * ((Math.random() * r) / 1000); // +-r/6, the sign according to the directions
                if (rs[i] < 0.97 * r) rs[i] = 0.97 * r;
                else if (rs[i] > 1.03 * r) rs[i] = 1.03 * r;
                rs.push(rr);
            }
            keyShape.animate(
                () => {
                    const path = self.getBubblePath(r, spNum, directions, rs);
                    return { path };
                },
                {
                    repeat: true,
                    duration: 10000,
                },
            );

            const directions2 = [],
                rs2 = [];
            self.changeDirections(spNum, directions2);
            for (let i = 0; i < spNum; i++) {
                const rr = r + directions2[i] * ((Math.random() * r) / 1000); // +-r/6, the sign according to the directions
                if (rs2[i] < 0.97 * r) rs2[i] = 0.97 * r;
                else if (rs2[i] > 1.03 * r) rs2[i] = 1.03 * r;
                rs2.push(rr);
            }
            mask.animate(
                () => {
                    const path = self.getBubblePath(r, spNum, directions2, rs2);
                    return { path };
                },
                {
                    repeat: true,
                    duration: 10000,
                },
            );
            return keyShape;
        },
        changeDirections(num, directions) {
            for (let i = 0; i < num; i++) {
                if (!directions[i]) {
                    const rand = Math.random();
                    const dire = rand > 0.5 ? 1 : -1;
                    directions.push(dire);
                } else {
                    directions[i] = -1 * directions[i];
                }
            }
            return directions;
        },
        getBubblePath(r, spNum, directions, rs) {
            const path = [];
            const cpNum = spNum * 2; // control points number
            const unitAngle = (Math.PI * 2) / spNum; // base angle for split points
            let angleSum = 0;
            const sps = [];
            const cps = [];
            for (let i = 0; i < spNum; i++) {
                const speed = 0.001 * Math.random();
                rs[i] = rs[i] + directions[i] * speed * r; // +-r/6, the sign according to the directions
                if (rs[i] < 0.97 * r) {
                    rs[i] = 0.97 * r;
                    directions[i] = -1 * directions[i];
                } else if (rs[i] > 1.03 * r) {
                    rs[i] = 1.03 * r;
                    directions[i] = -1 * directions[i];
                }
                const spX = rs[i] * Math.cos(angleSum);
                const spY = rs[i] * Math.sin(angleSum);
                sps.push({ x: spX, y: spY });
                for (let j = 0; j < 2; j++) {
                    const cpAngleRand = unitAngle / 3;
                    const cpR = rs[i] / Math.cos(cpAngleRand);
                    const sign = j === 0 ? -1 : 1;
                    const x = cpR * Math.cos(angleSum + sign * cpAngleRand);
                    const y = cpR * Math.sin(angleSum + sign * cpAngleRand);
                    cps.push({ x, y });
                }
                angleSum += unitAngle;
            }
            path.push(['M', sps[0].x, sps[0].y]);
            for (let i = 1; i < spNum; i++) {
                path.push([
                    'C',
                    cps[2 * i - 1].x,
                    cps[2 * i - 1].y,
                    cps[2 * i].x,
                    cps[2 * i].y,
                    sps[i].x,
                    sps[i].y,
                ]);
            }
            path.push(['C', cps[cpNum - 1].x, cps[cpNum - 1].y, cps[0].x, cps[0].y, sps[0].x, sps[0].y]);
            path.push(['Z']);
            return path;
        },
        setState(name, value, item) {
            const shape = item.get('keyShape');
            if (name === 'dark') {
                if (value) {
                    if (shape.attr('fill') !== '#fff') {
                        shape.oriFill = shape.attr('fill');
                        const uColor = unlightColorMap.get(shape.attr('fill'));
                        shape.attr('fill', uColor);
                    } else {
                        shape.attr('opacity', 0.2);
                    }
                } else {
                    if (shape.attr('fill') !== '#fff') {
                        shape.attr('fill', shape.oriFill || shape.attr('fill'));
                    } else {
                        shape.attr('opacity', 1);
                    }
                }
            }
        },
    },
    'single-node',
);