import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  z: number;
  size: number;
  shade: number;
};

type CuriosityOrbProps = {
  isPlaying?: boolean;
  reduced?: boolean;
  className?: string;
  /** Keep the map orb compact while restoring the stronger hero interaction. */
  radiusScale?: number;
  interactionScale?: number;
  rotationSpeed?: number;
  pointOpacityBoost?: number;
};

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function bandAlpha(p: Particle) {
  // A gentle contour emphasis keeps the point pattern legible without making
  // the sphere look like a dense yellow cloud.
  return Math.abs(Math.sin(p.y * Math.PI * 7)) > 0.72 ? 0.08 : 0;
}

export default function CuriosityOrb({
  isPlaying = false,
  reduced = false,
  className,
  radiusScale = 0.38,
  interactionScale = 1,
  rotationSpeed = 1,
  pointOpacityBoost = 0,
}: CuriosityOrbProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isPlayingRef = useRef(isPlaying);
  const reducedRef = useRef(reduced);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);
  useEffect(() => {
    reducedRef.current = reduced;
  }, [reduced]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const isMobile = window.innerWidth < 768;
    const COUNT = isMobile ? 620 : 1180;

    // Fibonacci sphere distribution + contour ring emphasis
    const particles: Particle[] = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < COUNT; i++) {
      const yv = 1 - (i / (COUNT - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - yv * yv);
      const theta = golden * i;
      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;
      // contour ring emphasis: brighten near latitude bands
      const band = Math.pow(Math.abs(Math.sin(yv * Math.PI * 7)), 2.4);
      particles.push({
        x,
        y: yv,
        z,
        size: 0.82 + band * 1.38 + Math.random() * 0.34,
        shade: Math.random(),
      });
    }

    let angle = 0;
    let tiltPhase = 0;
    let raf = 0;
    let visible = true;
    let lastT = performance.now();

    const mouse = { x: 0, y: 0 };
    const mouseSmooth = { x: 0, y: 0 };
    let hasMouse = false;

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
    }

    resize();
    window.addEventListener("resize", resize);

    function onPointerMove(e: PointerEvent) {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      if (Math.abs(nx) <= 1.4 && Math.abs(ny) <= 1.4) {
        mouse.x = nx;
        mouse.y = ny;
        hasMouse = true;
      }
    }
    function onPointerLeave() {
      hasMouse = false;
    }
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerleave", onPointerLeave);

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    io.observe(canvas);

    function onVisibility() {
      visible = visible && document.visibilityState === "visible";
    }
    document.addEventListener("visibilitychange", onVisibility);

    function frame(t: number) {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(40, t - lastT);
      lastT = t;
      if (!visible || document.visibilityState !== "visible") return;
      if (!ctx || !canvas) return;

      const red = reducedRef.current;

      if (!hasMouse) {
        mouseSmooth.x = lerp(mouseSmooth.x, 0, 0.06);
        mouseSmooth.y = lerp(mouseSmooth.y, 0, 0.06);
      } else {
        mouseSmooth.x = lerp(mouseSmooth.x, mouse.x, 0.12);
        mouseSmooth.y = lerp(mouseSmooth.y, mouse.y, 0.12);
      }

      // Map the slider to a deliberately obvious rotation range. The old
      // 0.2–2.4 multiplier was technically working, but the difference was
      // too subtle because the base angular velocity was too low.
      const speed = red ? 0.55 : (0.0011 + Math.pow(rotationSpeed, 1.15) * 0.0048);
      angle += speed * dt;
      tiltPhase += 0.0006 * dt;

      const t2 = t * 0.001;
      let amp: number;
      if (red) {
        amp = 0.015;
      } else if (isPlayingRef.current) {
        amp =
          0.045 * Math.sin(t2 * 9) +
          0.03 * Math.sin(t2 * 5.3 + 1) +
          0.025 * Math.sin(t2 * 13 + 2) +
          0.05;
      } else {
        amp = 0.02 * Math.sin(t2 * 1.1) + 0.012 * Math.sin(t2 * 0.6 + 2);
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const R = Math.min(width, height) * radiusScale;
      const focal = R * 3.2;

      // Mouse input controls the actual orientation of the sphere instead of
      // merely stretching particles. X and Y now use the same sign convention
      // as screen coordinates, so moving the pointer vertically feels natural.
      // Restore the stronger v2 pointer response. The map can opt into the
      // same interaction while keeping its deliberately smaller orb radius.
      const interactiveYaw = red ? 0 : mouseSmooth.x * 0.42 * interactionScale;
      const interactiveTilt = red ? 0 : mouseSmooth.y * 0.34 * interactionScale;
      const cosA = Math.cos(angle + interactiveYaw);
      const sinA = Math.sin(angle + interactiveYaw);
      const tilt = Math.sin(tiltPhase) * 0.12 + interactiveTilt;
      const cosT = Math.cos(tilt);
      const sinT = Math.sin(tilt);

      ctx.globalCompositeOperation = "lighter";

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        // rotate around Y
        let x = p.x * cosA + p.z * sinA;
        let z = -p.x * sinA + p.z * cosA;
        let y = p.y;
        // tilt around X
        const y2 = y * cosT - z * sinT;
        const z2 = y * sinT + z * cosT;
        y = y2;
        z = z2;

        // Subtle radial displacement makes the particle field visibly react
        // to the pointer without stretching the sphere outside its bounds.
        const pushX = red ? 0 : mouseSmooth.x * interactionScale;
        const pushY = red ? 0 : mouseSmooth.y * interactionScale;
        const push = Math.max(0, x * pushX + y * pushY) * 0.55;
        const scale = 1 + amp + push;

        const px = x * R * scale;
        const py = y * R * scale;
        const pz = z * R * scale;

        const persp = focal / (focal + pz);
        const sx = cx + px * persp;
        const sy = cy + py * persp;
        const depth = (pz + R) / (2 * R); // 0..1
        const size = p.size * persp * (0.7 + depth * 0.6);

        const heat = 0.32 + depth * 0.52 + push * 0.18;
        const r = lerp(193, 248, heat);
        const g = lerp(8, 126, heat);
        const b = lerp(1, 28, heat * 0.75);
        const alpha = Math.min(0.98, 0.52 + depth * 0.40 + pointOpacityBoost + bandAlpha(p));

        ctx.beginPath();
        ctx.fillStyle = `rgba(${r | 0},${g | 0},${b | 0},${alpha.toFixed(3)})`;
        ctx.arc(sx, sy, Math.max(0.3, size), 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = "source-over";
    }

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      io.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
