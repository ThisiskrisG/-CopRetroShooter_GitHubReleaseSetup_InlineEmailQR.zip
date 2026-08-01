import React, { useEffect, useRef } from 'react';
import bgSrc from '../assets/backgrounds/gritty-street.svg';
import fighterLeftSrc from '../assets/sprites/fighter-left.svg';
import fighterRightSrc from '../assets/sprites/fighter-right.svg';
import './GrittyStreetsScene.css';

type Sprite = {
  img: HTMLImageElement;
  x: number;
  y: number;
  w: number;
  h: number;
};

export default function GrittyStreetsScene(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    let w = (canvas.width = Math.min(window.innerWidth, 1200));
    let h = (canvas.height = Math.min(window.innerHeight, 720));

    function handleResize() {
      w = canvas.width = Math.min(window.innerWidth, 1200);
      h = canvas.height = Math.min(window.innerHeight, 720);
    }
    window.addEventListener('resize', handleResize);

    // Load images
    const bg = new Image();
    const l = new Image();
    const r = new Image();
    let loaded = 0;
    [bg, l, r].forEach((img) => {
      img.onload = () => {
        loaded += 1;
        if (loaded === 3) start();
      };
      img.onerror = () => {
        // still start if images fail to avoid blocking during tests
        loaded += 1;
        if (loaded === 3) start();
      };
    });
    bg.src = bgSrc;
    l.src = fighterLeftSrc;
    r.src = fighterRightSrc;

    const fighterLeft: Sprite = { img: l, x: 120, y: h - 260, w: 160, h: 220 };
    const fighterRight: Sprite = { img: r, x: w - 280, y: h - 260, w: 160, h: 220 };
    const background = { img: bg, x: 0, y: 0, w: w, h: h };

    let last = performance.now();
    let punchTimer = 0;
    let shake = 0;

    function start() {
      function loop(now: number) {
        const dt = Math.min(40, now - last);
        last = now;
        update(dt / 1000);
        render();
        rafRef.current = requestAnimationFrame(loop);
      }
      rafRef.current = requestAnimationFrame(loop);
    }

    function update(dt: number) {
      fighterLeft.y = (h - 260) + Math.sin(performance.now() / 700) * 4;
      fighterRight.y = (h - 260) + Math.cos(performance.now() / 700) * 4;

      if (punchTimer > 0) {
        punchTimer -= dt;
        shake = Math.max(0, shake - dt * 8);
      } else {
        shake = 0;
      }
    }

    function render() {
      const t = performance.now() / 1000;
      const bgOffset = Math.sin(t / 8) * 16;
      ctx.clearRect(0, 0, w, h);

      // background
      ctx.save();
      ctx.drawImage(background.img, bgOffset - 30, 0, w + 60, h);
      ctx.globalCompositeOperation = 'multiply';
      ctx.fillStyle = 'rgba(10,10,12,0.32)';
      ctx.fillRect(0, 0, w, h);
      ctx.restore();

      // gritty ground
      const grd = ctx.createLinearGradient(0, h - 160, 0, h);
      grd.addColorStop(0, 'rgba(0,0,0,0.5)');
      grd.addColorStop(1, 'rgba(0,0,0,0.85)');
      ctx.fillStyle = grd;
      ctx.fillRect(0, h - 160, w, 160);

      // fighters with shake
      const s = Math.round(shake * 6);
      ctx.drawImage(fighterLeft.img, fighterLeft.x + (Math.random() - 0.5) * s, fighterLeft.y, fighterLeft.w, fighterLeft.h);
      ctx.drawImage(fighterRight.img, fighterRight.x + (Math.random() - 0.5) * s, fighterRight.y, fighterRight.w, fighterRight.h);

      // atmosphere text
      ctx.fillStyle = 'rgba(230,180,120,0.95)';
      ctx.font = '18px monospace';
      ctx.fillText('Back-alley — Midnight', 22, 34);
    }

    function onClick(e: MouseEvent) {
      const x = e.clientX;
      if (x > w / 2) {
        punchTimer = 0.36;
        shake = 1;
        fighterRight.x += 14;
        setTimeout(() => (fighterRight.x -= 14), 120);
      } else {
        punchTimer = 0.36;
        shake = 1;
        fighterLeft.x -= 14;
        setTimeout(() => (fighterLeft.x += 14), 120);
      }
    }
    canvas.addEventListener('click', onClick);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('click', onClick);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="gritty-scene">
      <canvas ref={canvasRef} className="gritty-canvas" />
    </div>
  );
}
