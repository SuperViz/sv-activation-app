'use client';

import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import Image from "next/image";
import atariImg from '../../public/atari-bg.png'

type Ball = {
  id: number;
  size: number;
  position: { x: number; y: number };
};

const BASE_SPEED = .5;
const BALL_MARGIN = 10;

const App = () => {
  const [balls, setBalls] = useState<Ball[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const ballsRef = useRef<Ball[]>([]);

  const createBall = () => {
    const containerWidth = containerRef.current!.clientWidth;
    const containerHeight = containerRef.current!.clientHeight;

    const size = 30;
    const ball = Matter.Bodies.circle(
      (Math.random() * (containerWidth - BALL_MARGIN)) + (BALL_MARGIN / 2),
      (Math.random() * (containerHeight - BALL_MARGIN)) + (BALL_MARGIN / 2),
      size,
      {
        restitution: 1,
        friction: 0,
        frictionAir: 0,
        mass: 1,
      }
    );
      
    Matter.World.add(engineRef.current!.world, ball);

    const direction = Math.random() * Math.PI * 2;

    Matter.Body.setVelocity(ball, {
      x: Math.sin(direction) * BASE_SPEED,
      y: Math.cos(direction) * BASE_SPEED
    });

    return {
      id: ball.id,
      size: size * 2,
      position: ball.position,
    };
  }

  const initialize = () => {
    if (!containerRef.current) return;

    const engine = Matter.Engine.create();
    engineRef.current = engine;
    engine.gravity.y = 0;

    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;

    const wallOptions = { isStatic: true };
    const walls = [
      Matter.Bodies.rectangle(containerWidth / 2, 0, containerWidth, 1, wallOptions),
      Matter.Bodies.rectangle(containerWidth / 2, containerHeight, containerWidth, 1, wallOptions),
      Matter.Bodies.rectangle(0, containerHeight / 2, 1, containerHeight, wallOptions),
      Matter.Bodies.rectangle(containerWidth, containerHeight / 2, 1, containerHeight, wallOptions)
    ];

    Matter.World.add(engine.world, walls);

    // Create balls
    const newBalls: Ball[] = [];
    for (let i = 0; i < 10; i++) {
      newBalls.push(createBall());
    }

    // Add collision detection
    Matter.Events.on(engine, 'collisionStart', (event) => {
      const pairs = event.pairs;
      for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i];
        const randomAngle = (Math.random() - 0.5) * Math.PI;
        const velocityA = Matter.Vector.rotate(pair.bodyA.velocity, randomAngle);
        const velocityB = Matter.Vector.rotate(pair.bodyB.velocity, randomAngle);
        Matter.Body.setVelocity(pair.bodyA, {
          x: velocityA.x * -1,
          y: velocityA.y * -1
        });
        Matter.Body.setVelocity(pair.bodyB, {
          x: velocityB.x * -1,
          y: velocityB.y * -1
        });
      }
    });

    ballsRef.current = newBalls;
    setBalls(newBalls);
    Matter.Runner.run(engine);
    animate();
  }

  // Set up animation loop
  const animate = () => {
    if (!engineRef.current || !ballsRef.current.length) {
      requestAnimationFrame(animate);
      return;
    }

    Matter.Engine.update(engineRef.current);

    const updatedBalls = ballsRef.current.map(ball => {
      const body = engineRef.current?.world.bodies.find(b => b.id === ball.id);
      if (!body) return ball 

      const SPEED_MULTIPLIER = BASE_SPEED / body.speed

      Matter.Body.setVelocity(body, {
        x: body.velocity.x * SPEED_MULTIPLIER,
        y: body.velocity.y * SPEED_MULTIPLIER
      });

      return {
        ...ball,
        position: body.position,
      };
    });

    ballsRef.current = updatedBalls;
    setBalls(updatedBalls);
    requestAnimationFrame(animate);
  };

  useEffect(() => {    
    initialize();

    return () => {
      if(!engineRef.current) return;

      Matter.Engine.clear(engineRef.current);
    };
  }, []);

  return (
    <div className='grid grid-cols-12 gap-14 w-full h-screen px-12 py-10'>
      <div className="col-start-1 col-end-5 relative flex flex-col justify-between z-10">
        <div>
          <Image src="./logo-sm.svg" width={109} height={80} alt="Logo Superviz"/>
          <h1 className="mt-6 text-8xl font-black">
            Ganhe um LEGO<span className="text-3xl align-top">®</span>
            Atari<span className="text-3xl align-top">®</span>
          </h1>
        </div>
        <div className="text-3xl mr-16 mb-10">
          <p>Participe de qualquer ativação e ganhe pontos para concorrer.</p>
          <p className="font-black">Quanto mais ativações, mais chances de ganhar.</p>
          <p className="mt-5">🕹️ Boa sorte!</p>
        </div>
      </div>
      <Image src={atariImg} alt="Imagem de um Lego Atari" className="z-0 absolute top-0 left-0" />
      <div ref={containerRef} className="col-start-5 col-end-12 relative overflow-hidden bg-orange-200 w-full aspect-square max-w-[90vh]">
        {balls.map((ball) => (
          <div
            key={ball.id}
            className="absolute bg-red-500 rounded-full flex justify-center items-center"
            style={{
              width: `${ball.size}px`,
              height: `${ball.size}px`,
              top: `${ball.position.y - ball.size / 2}px`,
              left: `${ball.position.x - ball.size / 2}px`,
            }}
          >
            {ball.id}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;