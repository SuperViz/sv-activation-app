'use client'

import React, { useCallback, useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import { TVUser } from "@/components/User";
import { IUser, IUserActivation, IUserResponse } from "../../../types";
import { ActivationColor } from '@/data/activationsData';
import { useRealtime, useRealtimeParticipant, useSuperviz } from '@superviz/react-sdk';
import { ActivationType } from '@/global/global.types';
import { getOnlineUsersIds, getUsers } from '@/app/services/getUserData';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  const [users, setUsers] = React.useState<IUser[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const ballsRef = useRef<Ball[]>([]);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const createBall = (user: IUser) => {
    const containerWidth = containerRef.current!.clientWidth;
    const containerHeight = containerRef.current!.clientHeight;
    const userActivationDiameter = 194;

    const size = windowWidth > 3000 ? userActivationDiameter / 2 : userActivationDiameter / 4;
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
  const { subscribe: gameSubscribe } = useRealtime('game');
  const { subscribe: participantSubscribe } = useRealtimeParticipant('default');

  function completeActivation(userId: string, activationName: ActivationType, completed: boolean) {
    const user = users.find(user => user.id === userId);
    if (!user) return;
    if (!completed && !user.activations.some(activation => activation.name === activationName)) {
      const activation: IUserActivation = {
        name: activationName,
        completed: completed,
        color: ActivationColor[activationName]
      }

      user.activations.push(activation);
    } else {
      const activation = user.activations.find(activation => activation.name === activationName);
      if (activation)
        activation.completed = true;
    }
  }

  function handleParticipantStatusChange(userId: string, isOnline: boolean) {
    const user = users.find(user => user.id === userId);
    if (!user) return;

    user.isOnline = isOnline;
  }

  function handleActivationStart(message: any) {
    const userId = message.data.userId;
    const activationName = message.data.activation;

    completeActivation(userId, activationName, false);
  }

  function handleActivationComplete(message: any) {
    const userId = message.data.userId;
    const activationName = message.data.activation;

    completeActivation(userId, activationName, true);
  }

  const handleGameUpdate = useCallback((message: any) => {
    const userFromMessage = message.data.user;
    const element = message.data.element;
    const points = message.data.points;

    toast(`${element.emoji} ${userFromMessage?.name} acabou de descobrir ${element.name.toUpperCase()} e tem mais chance de ganhar!`, {
      position: 'bottom-left',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      closeButton: false,
      progress: undefined,
      theme: "dark",
    });

    const user = users.find(user => user.id === userFromMessage.id);
    if (!user) return;

    user.activations.forEach(activation => {
      if (activation.name === ActivationType.GAME) {
        activation.quantity = points;
      }
    })
  }, []);

  function fetchUsers() {
    getUsers().then((fetchedUsers: IUserResponse[]) => {
      const users: IUser[] = fetchedUsers.map(user => {
        const activations: IUserActivation[] = user.activations.map(activation => {
          return {
            name: activation.name,
            completed: activation.completed,
            quantity: activation.quantity,
            color: ActivationColor[activation.name]
          };
        });

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          discordUser: user.discordUser,
          activations: activations
        };
      });
      setUsers(users);
    }).then(() => {
      getOnlineUsersIds().then((onlineUsersIds: string[]) => {
        if (onlineUsersIds.length === 0) return;
        users.forEach(user => {
          if (onlineUsersIds.includes(user.id)) {
            user.isOnline = true;
          }
        });
      });
    });
  }

  useEffect(() => {
    fetchUsers();
    initialize();

    // TODO: Add new user to the balls array
    subscribe("activation.start", handleActivationStart);
    subscribe("activation.complete", handleActivationComplete);
    gameSubscribe("new.element", handleGameUpdate);

    participantSubscribe('presence.leave', (message) => handleParticipantStatusChange(message.id, false));
    participantSubscribe('presence.joined-room', (message) => handleParticipantStatusChange(message.id, true));

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
          className="absolute"
          style={{
            width: `${ball.size}px`,
            height: `${ball.size}px`,
            top: `${ball.position.y - ball.size / 2}px`,
            left: `${ball.position.x - ball.size / 2}px`,
          }}
        >
          <TVUser user={ball.user} />
        </div>
      ))}
    </div>
  )
}