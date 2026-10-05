import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "../utils/useReducedMotion";

type Point = { homeX: number; homeY: number; x: number; y: number; vx: number; vy: number; radius: number; color: string };

export default function ParticlePortrait() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0, y: 0, active: false });
  const wake = useRef<() => void>(() => {});
  const [ready, setReady] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    let points: Point[] = [];
    let width = 0;
    let height = 0;
    let frame = 0;
    let visible = true;
    let disposed = false;
    let previousTime = 0;
    const image = new Image();

    function draw(time: number) {
      frame = 0;
      if (!context || !canvas || disposed || !visible) return;
      const step = Math.min((time - previousTime) / 16.67 || 1, 2);
      previousTime = time;
      context.clearRect(0, 0, width, height);
      let moving = false;
      const pointer = mouse.current;
      const reach = Math.min(width * 0.23, 115);
      for (const point of points) {
        let targetX = point.homeX;
        let targetY = point.homeY;
        if (!reduced && pointer.active) {
          const dx = point.homeX - pointer.x;
          const dy = point.homeY - pointer.y;
          const distance = Math.hypot(dx, dy);
          if (distance < reach) {
            const force = Math.pow(1 - distance / reach, 2) * 65;
            targetX += dx / (distance || 1) * force;
            targetY += dy / (distance || 1) * force;
          }
        }
        point.vx = (point.vx + (targetX - point.x) * 0.09 * step) * Math.pow(0.72, step);
        point.vy = (point.vy + (targetY - point.y) * 0.09 * step) * Math.pow(0.72, step);
        point.x += point.vx * step;
        point.y += point.vy * step;
        moving ||= Math.abs(targetX - point.x) + Math.abs(targetY - point.y) + Math.abs(point.vx) + Math.abs(point.vy) > 0.08;
        context.beginPath();
        context.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
        context.fillStyle = point.color;
        context.fill();
      }
      if (moving) frame = requestAnimationFrame(draw);
    }
    function schedule() {
      if (!frame && visible && !disposed) { previousTime = performance.now(); frame = requestAnimationFrame(draw); }
    }
    wake.current = schedule;

    function rebuild() {
      if (!canvas || !image.complete || !image.naturalWidth) return;
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context!.setTransform(dpr, 0, 0, dpr, 0, 0);
      const sample = document.createElement("canvas");
      sample.width = Math.ceil(width);
      sample.height = Math.ceil(height);
      const sampleContext = sample.getContext("2d", { willReadFrequently: true });
      if (!sampleContext) return;
      const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
      sampleContext.drawImage(image, (width - image.naturalWidth * scale) / 2, 0, image.naturalWidth * scale, image.naturalHeight * scale);
      const pixels = sampleContext.getImageData(0, 0, sample.width, sample.height).data;
      const gap = width < 400 ? 3 : 3.5;
      points = [];
      for (let y = gap / 2; y < height - 2; y += gap) {
        for (let x = gap / 2; x < width - 2; x += gap) {
          // Average a small area so the source's tiny dots do not alias away.
          let red = 0;
          let green = 0;
          for (let oy = -1; oy <= 1; oy++) for (let ox = -1; ox <= 1; ox++) {
            const index = (Math.floor(y + oy) * sample.width + Math.floor(x + ox)) * 4;
            red += pixels[index]; green += pixels[index + 1];
          }
          red /= 9; green /= 9;
          if (red < 20) continue;
          const intensity = red / 255;
          points.push({ homeX: x, homeY: y, x, y, vx: 0, vy: 0, radius: 0.45 + intensity * 0.95,
            color: `rgba(248,${Math.round(65 + green * 0.5)},${Math.round(5 + intensity * 18)},${0.3 + intensity * 0.7})` });
        }
      }
      setReady(true);
      schedule();
    }
    const resize = new ResizeObserver(rebuild);
    resize.observe(canvas);
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) schedule();
      else { cancelAnimationFrame(frame); frame = 0; mouse.current.active = false; }
    });
    intersection.observe(canvas);
    image.onload = rebuild;
    image.src = "/images/host-orange-dots.png";
    return () => {
      disposed = true; cancelAnimationFrame(frame); resize.disconnect(); intersection.disconnect();
      image.onload = null; wake.current = () => {};
    };
  }, [reduced]);

  return (
    <div className="absolute inset-0 bg-black" onPointerMove={event => {
      if (event.pointerType === "touch" || reduced) return;
      const rect = event.currentTarget.getBoundingClientRect();
      mouse.current = { x: event.clientX - rect.left, y: event.clientY - rect.top, active: true };
      wake.current();
    }} onPointerLeave={() => { mouse.current.active = false; wake.current(); }}>
      <img src="/images/host-orange-dots.png" alt="Daymi creator in orange particles" className={`absolute inset-0 h-full w-full object-cover object-top ${ready ? "opacity-0" : "opacity-100"}`} />
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />
    </div>
  );
}
