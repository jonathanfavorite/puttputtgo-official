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

const GameConfetti: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]); // Use a ref for particles
  
    useEffect(() => {
      if (!canvasRef.current) return;
  
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
  
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

    let particles: Particle[] = [];
    const numParticles = 100;
    const fallingSpeed = 5;

    const getRandomColor = () => {
      const colors = ['red', 'green', 'blue', 'yellow', 'pink', 'purple', 'orange'];
     // const colors = ['#5e4e10', '#490401', '#252e2b', '#252e2b', '#684a27'];
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

          const side = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left

      switch (side) {
        case 0: // top
          this.x = Math.random() * canvas.width;
          this.y = 0;
          break;
        case 1: // right
          this.x = canvas.width;
          this.y = Math.random() * canvas.height;
          break;
        case 2: // bottom
          this.x = Math.random() * canvas.width;
          this.y = canvas.height;
          break;
        case 3: // left
          this.x = 0;
          this.y = Math.random() * canvas.height;
          break;
      }

      const angleToCenter = Math.atan2(canvas.height / 2 - this.y, canvas.width / 2 - this.x);
      const blastSpeed = Math.random() * 3 + 2; // Adjust this value for stronger/weaker blast

      this.speedX = Math.cos(angleToCenter) * blastSpeed;
      this.speedY = Math.sin(angleToCenter) * blastSpeed;

        }

        
      
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.rotation += this.rotationSpeed;
          
            // Adjust the speed to make the confetti fall down after the initial blast
            this.speedX *= 0.95; // Slow down the horizontal speed
            this.speedY += 0.5; // Accelerate downwards
          
            this.opacity = 1 - (this.y / (canvas.height + 10));
          
            // Return whether the particle is still visible
            return this.opacity > 0 && this.x >= 0 && this.x <= canvas.width && this.y >= 0 && this.y <= canvas.height;
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
      
        // Use a filter to update and draw particles, and remove those that are no longer visible
        particles = particles.filter(particle => {
          particle.update();
          particle.draw(ctx);
          return particle.update();
        });
      
        // If there are still particles left, continue the animation
        if (particles.length > 0) {
          requestAnimationFrame(animateParticles);
        }
      };

      const blastConfetti = () => {
        // Initialize particles
        particlesRef.current = Array.from({ length: numParticles }, () => new ConfettiParticle());
  
        const animateParticles = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
  
          particlesRef.current = particlesRef.current.filter(particle => {
            particle.update();
            particle.draw(ctx);
            return particle.update();
          });
  
          if (particlesRef.current.length > 0) {
            requestAnimationFrame(animateParticles);
          }
        };
  
        animateParticles();
      };

    animateParticles();
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'absolute', left:0, top:0, zIndex: 10 }} />;
};

export default GameConfetti;
