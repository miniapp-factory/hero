"use client";

import { useEffect, useRef, useState } from "react";

export default function PingPong() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState({ left: 0, right: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = 400;
    const height = 200;
    canvas.width = width;
    canvas.height = height;

    let ballX = width / 2;
    let ballY = height / 2;
    let ballSpeedX = 2;
    let ballSpeedY = 2;
    const paddleWidth = 10;
    const paddleHeight = 50;
    let leftPaddleY = height / 2 - paddleHeight / 2;
    let rightPaddleY = height / 2 - paddleHeight / 2;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // ball
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(ballX, ballY, 5, 0, Math.PI * 2);
      ctx.fill();

      // paddles
      ctx.fillRect(0, leftPaddleY, paddleWidth, paddleHeight);
      ctx.fillRect(width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight);

      // score
      ctx.font = "20px Arial";
      ctx.fillText(`${score.left}`, width / 4, 30);
      ctx.fillText(`${score.right}`, (3 * width) / 4, 30);
    };

    const update = () => {
      ballX += ballSpeedX;
      ballY += ballSpeedY;

      // top/bottom collision
      if (ballY <= 0 || ballY >= height) ballSpeedY *= -1;

      // paddle collision
      if (
        ballX <= paddleWidth &&
        ballY >= leftPaddleY &&
        ballY <= leftPaddleY + paddleHeight
      ) {
        ballSpeedX *= -1;
      }
      if (
        ballX >= width - paddleWidth &&
        ballY >= rightPaddleY &&
        ballY <= rightPaddleY + paddleHeight
      ) {
        ballSpeedX *= -1;
      }

      // score
      if (ballX < 0) {
        setScore((s) => ({ ...s, right: s.right + 1 }));
        ballX = width / 2;
        ballY = height / 2;
        ballSpeedX = 2;
      }
      if (ballX > width) {
        setScore((s) => ({ ...s, left: s.left + 1 }));
        ballX = width / 2;
        ballY = height / 2;
        ballSpeedX = -2;
      }
    };

    const loop = () => {
      update();
      draw();
      requestAnimationFrame(loop);
    };
    loop();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const y = e.clientY - rect.top;
      leftPaddleY = Math.max(0, Math.min(height - paddleHeight, y - paddleHeight / 2));
    };

    const handleTouchMove = (e: TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const y = e.touches[0].clientY - rect.top;
      leftPaddleY = Math.max(0, Math.min(height - paddleHeight, y - paddleHeight / 2));
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("touchmove", handleTouchMove);

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("touchmove", handleTouchMove);
    };
  }, [score]);

  return (
    <div className="flex flex-col items-center gap-4">
      <canvas ref={canvasRef} className="border border-gray-300" />
      <div className="text-lg">
        Score: {score.left} : {score.right}
      </div>
    </div>
  );
}
