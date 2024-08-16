'use client';

import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import Image from "next/image";
import atariImg from '../../public/atari-bg.png'
import qrcode from '../../public/blob-para-qrcode.png'

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
  
  const activationCircle = (color: string) => {
    return (
      <div className="pinpoint">
        <div className="content"></div>
        <div className="pinpoint-ring">
          <svg viewBox="0 0 36 36">
            <circle className="circle" r="16" cx="18" cy="18" fill="transparent" stroke={`#${color}`}></circle>
          </svg>
        </div>
      </div>
    )
  }

  useEffect(() => {
    initialize();

    return () => {
      if (!engineRef.current) return;

      Matter.Engine.clear(engineRef.current);
    };
  }, []);

  return (
    <div className='grid grid-cols-12 gap-14 w-full h-screen px-12 py-10'>
      <div className="col-start-1 col-span-4 relative flex flex-col justify-between z-10">
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
      <Image src={atariImg} alt="Imagem de um Lego Atari"  className="z-0 absolute top-0 left-0" />
      <div className="col-start-5 col-span-12 bg-[#C9C4D114] rounded-[40px] p-10 flex flex-col">
        <div className="flex justify-between">
          <div>
            <p className="font-black text-5xl">Veja quem já garantiu pontos e está concorrendo</p>
            <p className="text-2xl mt-1.5">Aponte a câmera para o QR code pra participar</p>
          </div>
          <div>
            <Image src={qrcode} width={107} height={107} alt="QR Code para ativação"/>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-9 mt-9 grow">
          <div className="col-start-1 col-span-4 p-8 bg-[#7e7a88]/10 rounded-2xl h-fit">
            <p className="text-xl">Ativações</p>
            <div className="mt-6 flex align-center">
              <span className="mr-3 activations">
                {activationCircle('957AFF')}
              </span>
              <span className="text-2xl font-black">Experimente nosso <span
                className="text-[#957AFF]">Jogo</span></span>
            </div>
            <div className="mt-6 flex align-center">
            <span className="mr-3 activations">{activationCircle('0077FF')}</span>
              <span className="text-2xl font-black">Junte-se ao nosso <span
                className="text-[#0077FF]">Discord</span></span>
            </div>
            <div className="mt-6 flex align-center">
              <span className="mr-3 activations">{activationCircle('DB6583')}</span>
              <span className="text-2xl font-black">Cadastre na nossa <span className="text-[#DB6583]">Newsletter</span></span>
            </div>
            <div className="mt-6 flex align-center">
              <span className="mr-3 activations">{activationCircle('56E29E')}</span>
              <span className="text-2xl font-black">Inscreva-se no <span className="text-[#56E29E]">Hackathon</span>
                <br/>
                <span className="text-lg">E concorra a <span className="text-[#56E29E]">$5.000</span></span>
              </span>
            </div>
          </div>
          <div ref={containerRef} className="col-start-5 col-span-12 bg-orange-200 relative overflow-hidden w-full">
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
        <div className="flex justify-between mt-9">
          <div className="flex items-center">
            <span>Online agora:</span>
            <div className="ml-3 bg-white h-9 w-9 rounded-full text-[#26242A] text-lg font-black flex items-center justify-center"><span>I</span></div>
            <div className="ml-3 bg-white h-9 w-9 rounded-full text-[#26242A] text-lg font-black flex items-center justify-center"><span>I</span></div>
            <div className="ml-3 bg-white h-9 w-9 rounded-full text-[#26242A] text-lg font-black flex items-center justify-center"><span>I</span></div>
            <div className="ml-3 bg-white h-9 w-9 rounded-full text-[#26242A] text-lg font-black flex items-center justify-center"><span>I</span></div>
            <div className="ml-3 bg-white h-9 w-9 rounded-full text-[#26242A] text-lg font-black flex items-center justify-center"><span>I</span></div>
            <div className="ml-3 bg-white h-9 w-9 rounded-full text-[#26242A] text-lg font-black flex items-center justify-center"><span>I</span></div>
            <div className="ml-3 bg-white h-9 w-9 rounded-full text-[#26242A] text-lg font-black flex items-center justify-center"><span>I</span></div>
            <div className="ml-3 bg-white h-9 w-9 rounded-full text-[#26242A] text-lg font-black flex items-center justify-center"><span>I</span></div>
            <div className="ml-3 bg-white h-9 w-9 rounded-full text-[#26242A] text-lg font-black flex items-center justify-center"><span>I</span></div>
            <div className="ml-3 bg-white h-9 w-9 rounded-full text-[#26242A] text-lg font-black flex items-center justify-center"><span>...</span></div>
          </div>
          <div className="flex gap-3 items-center">
            <Image src="./sync-logo.svg" width={25} height={20} alt="Logo Superviz"/>
            <span>Sincronização de dados por </span>
            <Image src="./logo-md.svg" width={80} height={15} alt="Logo Superviz"/>
          </div>
        </div>  
      </div>
    </div>
  );
};

export default App;