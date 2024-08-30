'use client'

import React, { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import User from "@/components/User";
import { IUser, IUserActivation } from "../../../types";
import { ActivationColor, users as mockUsers } from '@/data/activationsData';
import { useRealtime, useSuperviz } from '@superviz/react-sdk';

const BASE_SPEED = .5;
const BALL_MARGIN = 7;

type Ball = {
  id: number;
  size: number;
  position: { x: number; y: number };
  user: IUser,
};

export default function UsersDashboard() {
  const [balls, setBalls] = useState<Ball[]>([]);
  const [users, setUsers] = React.useState<IUser[]>(mockUsers);
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const ballsRef = useRef<Ball[]>([]);



  const createBall = (user: IUser) => {
    const containerWidth = containerRef.current!.clientWidth;
    const containerHeight = containerRef.current!.clientHeight;

    const size = 36 + user.activations.length * 15;
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
      user,
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
    for (const user of users) {
      newBalls.push(createBall(user));
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

  const { stopRoom, hasJoinedRoom } = useSuperviz();
  const { subscribe } = useRealtime('default');

  function handleActivationStart(message: any) {
    const userId = message.data.userId;
    const activationName = message.data.activation;

    const user = users.find(user => user.id === userId);
    if (!user) return;

    const activation: IUserActivation = {
      id: activationName,
      completed: false,
      color: ActivationColor.DISCORD // TODO: Cor da ativação não pode ficar no css não?
    }

    user.activations.push(activation);
  }

  function handleActivationClick(message: any) {
    const userId = message.data.userId;
    const completedActivation = message.data.activation;
    console.log('ativação concluida', userId, completedActivation);
  }

  function handleGameUpdate(message: any) {
    const userId = message.data.userId;
    const points = message.data.points;
    console.log('Atualizou os pontos do usuário', userId, points);
  }

  useEffect(() => {
    initialize();
    subscribe("activation.start", handleActivationStart);
    subscribe("activation.game.update", handleGameUpdate);
    subscribe("activation.complete", handleActivationClick);

    const handleBeforeUnload = () => {
      if (hasJoinedRoom) {
        stopRoom();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (!engineRef.current) return;

      Matter.Engine.clear(engineRef.current);
    };
  }, [hasJoinedRoom]);

  return (
    <div ref={containerRef} className="relative overflow-hidden w-full h-full">
      {balls.map((ball) => (
        <div
          key={ball.id}
          className="absolute flex justify-center items-center"
          style={{
            width: `${ball.size}px`,
            height: `${ball.size}px`,
            top: `${ball.position.y - ball.size / 2}px`,
            left: `${ball.position.x - ball.size / 2}px`,
          }}
        >
          <User user={ball.user} withActivations={true} withUsername={true} withStar={true} />
        </div>
      ))}
    </div>
  )
}