import { useEffect, useRef, useState } from "react";

interface Particle {
  x: number;
  y: number;
  r: number;
  dx: number;
  dy: number;
  alpha: number;
}

const SLIDE_COUNT = 4;

interface LiveBackgroundProps {
  showDots?: boolean;
}

export default function LiveBackground({ showDots = false }: LiveBackgroundProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDE_COUNT);
    }, 6000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const spawnParticle = (): Particle => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3,
      dx: (Math.random() - 0.5) * 0.3,
      dy: -Math.random() * 0.4 - 0.1,
      alpha: Math.random() * 0.4 + 0.1,
    });

    resize();
    particlesRef.current = Array.from({ length: 80 }, spawnParticle);

    const onResize = () => resize();
    window.addEventListener("resize", onResize);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current = particlesRef.current.map((particle) => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212,168,83,${particle.alpha})`;
        ctx.fill();

        const next = {
          ...particle,
          x: particle.x + particle.dx,
          y: particle.y + particle.dy,
        };

        if (next.y < -4) {
          return { ...spawnParticle(), y: canvas.height + 4 };
        }

        return next;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide((index + SLIDE_COUNT) % SLIDE_COUNT);
  };

  return (
    <>
      <div className="fp-live-bg" aria-hidden="true">
        <div id="slideshow">
          {Array.from({ length: SLIDE_COUNT }).map((_, index) => (
            <div key={index} className={`slide${index === currentSlide ? " active" : ""}`} />
          ))}
        </div>
        <canvas id="particles" ref={canvasRef} />
      </div>

      {showDots && (
        <div className="fp-slide-dots">
          {Array.from({ length: SLIDE_COUNT }).map((_, index) => (
            <button
              key={index}
              type="button"
              className={`fp-dot${index === currentSlide ? " active" : ""}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </>
  );
}
