"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import { TVUser } from "@/components/User";
import { IUser, IUserActivation, IUserResponse } from "../../../types";
import { ActivationColor } from "@/data/activationsData";
import {
  useRealtime,
  useRealtimeParticipant,
  useSuperviz,
} from "@superviz/react-sdk";
import { ActivationType } from "@/global/global.types";
import { getOnlineUsersIds, getUsers } from "@/app/services/getUserData";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BASE_SPEED = 0.5;
const MAX_SPEED = 1;
const MIN_SPEED = 0.1;

type Ball = {
  id: number;
  size: number;
  position: { x: number; y: number };
  user: IUser;
};

export default function UsersDashboard() {
  const [balls, setBalls] = useState<Ball[]>([]);
  const [users, setUsers] = React.useState<IUser[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const ballsRef = useRef<Ball[]>([]);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const started = useRef<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const createBall = (user: IUser) => {
    const containerWidth = containerRef.current!.clientWidth;
    const containerHeight = containerRef.current!.clientHeight;
    const userActivationDiameter = 194;

    const size =
      windowWidth > 3000
        ? userActivationDiameter / 2
        : userActivationDiameter / 4;

    // Calculate the inner area (80% of the container)
    const innerWidth = containerWidth * 1;
    const innerHeight = containerHeight * 1;
    const offsetX = (containerWidth - innerWidth) / 2;
    const offsetY = (containerHeight - innerHeight) / 2;

    // Adjust the position calculation to ensure the ball is within the inner walls
    const x = offsetX + size + Math.random() * (innerWidth - size * 2);
    const y = offsetY + size + Math.random() * (innerHeight - size * 2);

    const ball = Matter.Bodies.circle(x, y, size, {
      restitution: 0.8 + Math.random() * 0.4, // Random restitution between 0.8 and 1.2
      friction: 0,
      frictionAir: 0,
      mass: 1,
    });

    Matter.World.add(engineRef.current!.world, ball);

    const direction = Math.random() * Math.PI * 2;
    const speed = BASE_SPEED;

    Matter.Body.setVelocity(ball, {
      x: Math.sin(direction) * speed,
      y: Math.cos(direction) * speed,
    });

    return {
      id: ball.id,
      size: size * 2,
      position: ball.position,
      user,
    };
  };

  const initialize = () => {
    if (!containerRef.current) return;

    const engine = Matter.Engine.create();
    engineRef.current = engine;
    engine.gravity.y = 0;

    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;

    // Calculate the dimensions for the inner area (80% of the container)
    const innerWidth = containerWidth * 1.2;
    const innerHeight = containerHeight * 1;
    const offsetX = (containerWidth - innerWidth) / 2;
    const offsetY = (containerHeight - innerHeight) / 2;

    const wallThickness = 10; // Increased thickness for visibility
    const wallOptions = {
      isStatic: true,
      render: {
        fillStyle: "rgba(255, 255, 255, 0.5)", // Semi-transparent white
      },
    };

    const walls = [
      // Top wall
      Matter.Bodies.rectangle(
        containerWidth / 2,
        offsetY,
        innerWidth,
        wallThickness,
        wallOptions
      ),
      // Bottom wall
      Matter.Bodies.rectangle(
        containerWidth / 2,
        containerHeight - offsetY,
        innerWidth,
        wallThickness,
        wallOptions
      ),
      // Left wall
      Matter.Bodies.rectangle(
        offsetX,
        containerHeight / 2,
        wallThickness,
        innerHeight,
        wallOptions
      ),
      // Right wall
      Matter.Bodies.rectangle(
        containerWidth - offsetX,
        containerHeight / 2,
        wallThickness,
        innerHeight,
        wallOptions
      ),
    ];

    Matter.World.add(engine.world, walls);

    // Create balls
    const newBalls: Ball[] = [];
    for (const user of users) {
      newBalls.push(createBall(user));
    }

    Matter.Events.on(engine, "collisionStart", (event) => {
      const pairs = event.pairs;
      for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i];
        const normal = pair.collision.normal;
        const relativeVelocity = {
          x: pair.bodyB.velocity.x - pair.bodyA.velocity.x,
          y: pair.bodyB.velocity.y - pair.bodyA.velocity.y,
        };
        const dotProduct =
          relativeVelocity.x * normal.x + relativeVelocity.y * normal.y;

        const restitution = 0.8 + Math.random() * 0.4; // Random restitution between 0.8 and 1.2
        const impulseScalar =
          (-(1 + restitution) * dotProduct) /
          (pair.bodyA.inverseMass + pair.bodyB.inverseMass);
        const impulse = {
          x: normal.x * impulseScalar,
          y: normal.y * impulseScalar,
        };

        Matter.Body.setVelocity(pair.bodyA, {
          x: pair.bodyA.velocity.x - impulse.x * pair.bodyA.inverseMass,
          y: pair.bodyA.velocity.y - impulse.y * pair.bodyA.inverseMass,
        });

        Matter.Body.setVelocity(pair.bodyB, {
          x: pair.bodyB.velocity.x + impulse.x * pair.bodyB.inverseMass,
          y: pair.bodyB.velocity.y + impulse.y * pair.bodyB.inverseMass,
        });

        const perturbation = 3 + Math.random() * 2; // Random perturbation between 3 and 5
        Matter.Body.setVelocity(pair.bodyA, {
          x: pair.bodyA.velocity.x + (Math.random() - 0.5) * perturbation,
          y: pair.bodyA.velocity.y + (Math.random() - 0.5) * perturbation,
        });
        Matter.Body.setVelocity(pair.bodyB, {
          x: pair.bodyB.velocity.x + (Math.random() - 0.5) * perturbation,
          y: pair.bodyB.velocity.y + (Math.random() - 0.5) * perturbation,
        });

        const repulsionForce = 0.5 + Math.random() * 0.5; // Random repulsion force between 0.5 and 1
        Matter.Body.applyForce(pair.bodyA, pair.bodyA.position, {
          x: -normal.x * repulsionForce,
          y: -normal.y * repulsionForce,
        });
        Matter.Body.applyForce(pair.bodyB, pair.bodyB.position, {
          x: normal.x * repulsionForce,
          y: normal.y * repulsionForce,
        });
      }
    });

    ballsRef.current = newBalls;
    setBalls(newBalls);
    Matter.Runner.run(engine);
    animate();
  };

  // Set up animation loop
  const animate = () => {
    if (!engineRef.current || !ballsRef.current.length) {
      requestAnimationFrame(animate);
      return;
    }

    Matter.Engine.update(engineRef.current);

    const updatedBalls = ballsRef.current.map((ball) => {
      const body = engineRef.current?.world.bodies.find(
        (b) => b.id === ball.id
      );
      if (!body) return ball;

      const currentSpeed = Math.sqrt(
        body.velocity.x ** 2 + body.velocity.y ** 2
      );
      let SPEED_MULTIPLIER = BASE_SPEED / currentSpeed;

      SPEED_MULTIPLIER *= 0.9 + Math.random() * 0.2;

      Matter.Body.setVelocity(body, {
        x: body.velocity.x * SPEED_MULTIPLIER,
        y: body.velocity.y * SPEED_MULTIPLIER
      });

      // Occasionally add a small random force
      if (Math.random() < 0.05) {
        // 5% chance each frame
        const randomForce = {
          x: (Math.random() - 0.5) * 0.001,
          y: (Math.random() - 0.5) * 0.001,
        };
        Matter.Body.applyForce(body, body.position, randomForce);
      }

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
  const { subscribe } = useRealtime("default");
  const { subscribe: gameSubscribe } = useRealtime("game");
  const { subscribe: participantSubscribe } = useRealtimeParticipant("default");

  const setUsersToNewState = (user: IUser) => {
    const newUsers = users.map((u) => {
      if (u.id === user.id) {
        return user;
      }
      return u;
    });

    const balls = ballsRef.current.map((ball) => {
      if (ball.user.id === user.id) {
        return {
          ...ball,
          user,
        };
      }
      return ball;
    });

    ballsRef.current = balls;
    setBalls(balls);
    setUsers(newUsers);
  };

  function completeActivation(userId: string, activationName: ActivationType, completed: boolean) {
    const user = { ...users.find(user => user.id === userId) } as IUser;
    if (!user) return;

    if (!completed && !user.activations.some(activation => activation.name === activationName)) {
      const activation: IUserActivation = {
        name: activationName,
        completed: completed,
        color: ActivationColor[activationName],
      };

      user.activations.push(activation);
    } else {
      const activation = user.activations.find(activation => activation.name === activationName);
      if (activation)
        activation.completed = true;
    }

    setUsersToNewState(user);
  }

  const handleGameUpdate = useCallback((message: any) => {
    const userFromMessage: IUser = message.data.user;
    const element = message.data.element;
    const points = message.data.points;
  
    const elementId = `${userFromMessage.email}-${element.name}`;
    
    if(!toast.isActive(elementId)) {
      toast(
        `${element.emoji} ${userFromMessage?.name} acabou de descobrir ${element.name.toUpperCase()} e tem mais chance de ganhar!`,
        {
          toastId: elementId,
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          closeButton: false,
          progress: undefined,
          theme: "dark",
        }
      ); 
    }
  
    setUsers((prevUsers) => {
      const updatedUsers = prevUsers.map((user) => {
        if (user.id === userFromMessage.id) {
          const updatedActivations = user.activations.map((activation) => {
            if (activation.name === ActivationType.GAME) {
              return { ...activation, quantity: points };
            }
            return activation;
          });
          return { ...user, activations: updatedActivations };
        }
        return user;
      });
  
      // Update balls state and ballsRef in a single operation
      const updatedBalls = ballsRef.current.map((ball) => {
        if (ball.user.id === userFromMessage.id) {
          const updatedUser = updatedUsers.find(u => u.id === userFromMessage.id)!;
          return { ...ball, user: updatedUser };
        }
        return ball;
      });
  
      ballsRef.current = updatedBalls;
      setBalls(updatedBalls);
  
      return updatedUsers;
    });
  }, []); // Remove dependencies

  function handleParticipantStatusChange(userId: string, isOnline: boolean) {
    setUsers((prevUsers) => {
      const updatedUsers = prevUsers.map((u) => 
        u.id === userId ? { ...u, isOnline } : u
      );
  
      const updatedBalls = ballsRef.current.map((ball) => {
        if (ball.user.id === userId) {
          const updatedUser = updatedUsers.find(u => u.id === userId)!;
          return { ...ball, user: updatedUser };
        }
        return ball;
      });
  
      ballsRef.current = updatedBalls;
      setBalls(updatedBalls);
  
      return updatedUsers;
    });
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

  function handleParticipantUpdate(message: any) {
    const userExists = users.some((user) => message.data?.id === user?.id);

    if (!userExists) {
      createUser(message.data);
      setUsers((previous) => {
        return [...previous, message.data];
      });
    }
  }

  function createUser(user: IUser) {
    const ball = createBall(user);

    if (ballsRef.current?.some((ball) => ball.user.id === user.id)) return;

    ballsRef.current = [...ballsRef.current, ball];
    setBalls((previous) => [...previous, ball]);
  }

  function fetchUsers() {
    getUsers()
      .then((fetchedUsers: IUserResponse[]) => {
        const users: IUser[] = fetchedUsers.map((user) => {
          const activations: IUserActivation[] = user.activations.map(
            (activation) => {
              return {
                name: activation.name,
                completed: activation.completed,
                quantity: activation.quantity,
                color: ActivationColor[activation.name],
              };
            }
          );
  
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            discordUser: user.discordUser,
            activations: activations,
            isOnline: false, 
          };
        });
        
        return users;
      })
      .then((users) => {
        return getOnlineUsersIds().then((onlineUsersIds: string[]) => {
          if (onlineUsersIds.length === 0) return users;
          
          return users.map(user => ({
            ...user,
            isOnline: onlineUsersIds.includes(user.id)
          }));
        });
      })
      .then((updatedUsers) => {
        setUsers(updatedUsers); 
        initialize();
      });
  }

  useEffect(() => {
    fetchUsers();

    subscribe("activation.start", handleActivationStart);
    subscribe("activation.complete", handleActivationComplete);
    gameSubscribe("new.element", handleGameUpdate);

    participantSubscribe("presence.leave", (message) =>
      handleParticipantStatusChange(message.id, false)
    );
    participantSubscribe("presence.joined-room", (message) =>
      handleParticipantStatusChange(message.id, true)
    );
    participantSubscribe("presence.update", (message) =>
      handleParticipantUpdate(message)
    );

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
    <div
      ref={containerRef}
      className="walls relative overflow-hidden w-full h-full"
    >
      {balls
        .sort((a, b) => {
          if (a.user.isOnline && !b.user.isOnline) return -1;
          if (!a.user.isOnline && b.user.isOnline) return 1;

          const aIncompleteActivations = a.user.activations.filter(
            (activation) => !activation.completed
          ).length;
          const bIncompleteActivations = b.user.activations.filter(
            (activation) => !activation.completed
          ).length;

          if (aIncompleteActivations >= 2 && bIncompleteActivations < 2)
            return 1;
          if (aIncompleteActivations < 2 && bIncompleteActivations >= 2)
            return -1;
          return 0;
        })
        .filter((_, index) => index < 75)
        .map((ball) => (
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
  );
}
