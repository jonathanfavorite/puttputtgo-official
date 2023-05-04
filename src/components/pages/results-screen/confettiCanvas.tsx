import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  color: string;
  opacity: number;
  update: () => void;
  draw: (ctx: CanvasRenderingContext2D) => void;
}

const ConfettiCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Particle[] = [];
    const numParticles = 100;
    const fallingSpeed = 5;

    const getRandomColor = () => {
      const colors = ['red', 'green', 'blue', 'yellow', 'pink', 'purple', 'orange'];
      return colors[Math.floor(Math.random() * colors.length)];
    };

    class ConfettiParticle implements Particle {
        x: number;
        y: number;
        width: number;
        height: number;
        speedX: number;
        speedY: number;
        color: string;
        rotation: number;
        rotationSpeed: number;
        opacity: number;
        constructor() {
          this.x = Math.random() * canvas.width;
          this.y = 0;
          this.width = Math.random() * 10 + 2;
          this.height = Math.random() * 10 + 2;
          this.speedX = Math.random() * 3 - 1.5;
          this.speedY = Math.random() * fallingSpeed + 1;
          this.color = getRandomColor();
          this.rotation = Math.random() * Math.PI * 2;
          this.rotationSpeed = Math.random() * 0.05 - 0.025;
          this.opacity = 1;
        }
      
        update() {
          this.x += this.speedX;
          this.y += this.speedY;
          this.rotation += this.rotationSpeed;
          this.opacity = 1 - (this.y / (canvas.height + 10));
        }
      
        draw(ctx: CanvasRenderingContext2D) {
          ctx.save();
          ctx.fillStyle = this.color;
          ctx.globalAlpha = this.opacity;
          ctx.translate(this.x, this.y);
          ctx.rotate(this.rotation);
          ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
          ctx.restore();
        }
      }

   

    for (let i = 0; i < numParticles; i++) {
      particles.push(new ConfettiParticle());
    }

    const animateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw(ctx);

        if (particles[i].y > canvas.height) {
          particles[i].y = 0;
          particles[i].x = Math.random() * canvas.width;
          particles[i].speedY = Math.random() * fallingSpeed + 1;
          particles[i].color = getRandomColor();
        }
      }

      requestAnimationFrame(animateParticles);
    };

    animateParticles();
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'absolute', left:0, top:0, zIndex: 10 }} />;
};

export default ConfettiCanvas;
