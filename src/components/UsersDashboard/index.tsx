"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import { TVUser } from "@/components/User";
import { IUser, IUserActivation } from "../../../types";
import { ActivationColor } from "@/data/activationsData";
import { useSuperviz } from "@superviz/react-sdk";
import { ActivationType } from "@/global/global.types";
import { getOnlineUsersIds, getUsers } from "@/app/services/getUserData";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRealtime } from "@/hooks/useRealtime";

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
  const [ballsFiltered, setBallsFiltered] = useState<Ball[]>([]);
  const initialized = useRef(false);
  const { defaultChannel, gameChannel } = useRealtime();

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

  useEffect(() => {
    const interval = setInterval(() => {
      filterBalls();
    }, 10 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const filterBalls = () => {
    try {
      if (!engineRef.current || !engineRef.current.world) {
        console.error("Engine or world not initialized");
        return;
      }

      const filtered = ballsRef.current
        .filter((ball) => ball && !!ball.user && !!ball.user?.name) // Ensure ball and user exist
        .sort((a, b) => {
          if (a.user.isOnline && !b.user.isOnline) return -1;
          if (!a.user.isOnline && b.user.isOnline) return 1;

          const hasIncompleteActivations = a.user.activations.filter(
            (activation) => !activation.completed
          ).length;
          const bIncompleteActivations = b.user.activations.filter(
            (activation) => !activation.completed
          ).length;

          if (hasIncompleteActivations >= 2 && bIncompleteActivations < 2)
            return 1;
          if (hasIncompleteActivations < 2 && bIncompleteActivations >= 2)
            return -1;
          return 0;
        })
        .slice(0, 80); // Take only the first 80 balls

      ballsRef.current.forEach((ball) => {
        if (!ball) return; // Skip if ball is undefined
        const body = Matter.Composite.get(
          engineRef.current!.world,
          ball.id,
          "body"
        ) as Matter.Body;
        if (
          !filtered.some((filteredBall) => filteredBall.id === ball.id) &&
          body
        ) {
          Matter.Composite.remove(engineRef.current!.world, body);
        }
      });

      filtered.forEach((ball) => {
        if (!ball) return; // Skip if ball is undefined
        const body = Matter.Composite.get(
          engineRef.current!.world,
          ball.id,
          "body"
        ) as Matter.Body;
        if (!body) {
          const newBody = Matter.Bodies.circle(
            ball.position.x,
            ball.position.y,
            ball.size / 2,
            {
              restitution: 0.8,
              friction: 0,
              frictionAir: 0,
              mass: 1,
            }
          );
          Matter.Body.set(newBody, "id", ball.id);
          Matter.Composite.add(engineRef.current!.world, newBody);
        }
      });

      ballsRef.current = filtered;
      setBallsFiltered(filtered);

      console.log("Filtering completed successfully");
    } catch (error) {
      console.error("Error in filterBalls:", error);
    }
  };

  const createBall = (user: IUser) => {
    const containerWidth = containerRef.current!.clientWidth;
    const containerHeight = containerRef.current!.clientHeight;
    const userActivationDiameter = 184;

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
      size: size * 2,
      ...ball,
      user,
    };
  };

  const initialize = (users: IUser[]) => {
    if (!containerRef.current) return;

    const engine = Matter.Engine.create();
    engineRef.current = engine;
    engine.gravity.y = 0;

    initialized.current = true;

    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;

    // Calculate the dimensions for the inner area (80% of the container)
    const innerWidth = containerWidth * 1.2;
    const innerHeight = containerHeight * 1;
    const offsetX = (containerWidth - innerWidth) / 2;
    const offsetY = (containerHeight - innerHeight) / 2;

    const wallThickness = 30; // Increased thickness for visibility
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
        const randomAngle = (Math.random() - 0.5) * Math.PI;
        const velocityA = Matter.Vector.rotate(
          pair.bodyA.velocity,
          randomAngle
        );
        const velocityB = Matter.Vector.rotate(
          pair.bodyB.velocity,
          randomAngle
        );
        Matter.Body.setVelocity(pair.bodyA, {
          x: velocityA.x * -1,
          y: velocityA.y * -1,
        });
        Matter.Body.setVelocity(pair.bodyB, {
          x: velocityB.x * -1,
          y: velocityB.y * -1,
        });
      }
    });

    ballsRef.current = newBalls;
    setBalls(newBalls);
    Matter.Runner.run(engine);
    animate();
    filterBalls();
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
        y: body.velocity.y * SPEED_MULTIPLIER,
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

  const setUsersToNewState = (user: IUser) => {
    const newUsers = users.map((u) => {
      if (u.id === user.id) {
        return user;
      }
      return u;
    });

    const balls = ballsRef.current.map((ball) => {
      if (ball?.user.id === user.id) {
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

  function completeActivation(
    userId: string,
    activationName: ActivationType,
    completed: boolean
  ) {
    const user = { ...users.find((user) => user.id === userId) } as IUser;

    if (!user) return;

    if (
      !completed &&
      !user.activations.some((activation) => activation.name === activationName)
    ) {
      const activation: IUserActivation = {
        name: activationName,
        completed: completed,
        color: ActivationColor[activationName],
      };

      user.activations.push(activation);
    } else {
      const activation = user.activations.find(
        (activation) => activation.name === activationName
      );
      if (activation) activation.completed = true;
    }

    setUsersToNewState(user);
  }

  const handleGameUpdate = useCallback((message: any) => {
    const userFromMessage: IUser = message?.data?.user;
    const element = message.data.element;
    const points = message.data.points;

    const elementId = `${userFromMessage.email}-${element.name}`;

    if (!toast.isActive(elementId)) {
      toast(
        `${element.emoji} ${
          userFromMessage?.name
        } acabou de descobrir ${element.name.toUpperCase()} e tem mais chance de ganhar!`,
        {
          toastId: elementId,
          position: "top-right",
          autoClose: 15000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          closeButton: false,
          progress: undefined,
          theme: "dark",
          style: {
            transform: "scale(3)",
            top: "150px",
            right: "400px",
          },
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
        if (ball?.user?.id === userFromMessage?.id) {
          const updatedUser = updatedUsers.find(
            (u) => u.id === userFromMessage.id
          )!;
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
        if (ball?.user?.id === userId) {
          const updatedUser = updatedUsers.find((u) => u.id === userId)!;
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
    const userId = message.data?.userId;
    const activationName = message.data.activation;

    completeActivation(userId, activationName, false);
  }

  function handleActivationComplete(message: any) {
    const userId = message.data?.userId;
    const activationName = message.data.activation;

    completeActivation(userId, activationName, true);
  }

  const handleParticipantUpdate = useCallback(
    async (message: { data: IUser }) => {
      const userExists = users.some((user) => message.data?.id === user?.id);

      if (!userExists) {
        const users = await fetchUsers();
        const user = users.find((user) => user.id === message.data.id);

        user && createUser(user);
        filterBalls();
      }

      const user = message?.data;

      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === user?.id ? user : u))
      );
      setBalls((prevBalls) =>
        prevBalls.map((ball) =>
          ball?.user?.id === user?.id ? { ...ball, user } : ball
        )
      );
      ballsRef.current = ballsRef.current.map((ball) =>
        ball?.user?.id === user?.id ? { ...ball, user } : ball
      );
    },
    [users, balls, ballsRef]
  );

  function createUser(user: IUser) {
    const ball = createBall(user);

    if (ballsRef.current?.some((ball) => ball?.user.id === user?.id)) return;

    ballsRef.current = [...ballsRef.current, ball];
    setBalls((previous) => [...previous, ball]);
  }

  async function fetchUsers() {
    const fetchedUsers = await getUsers();
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
    const onlineUsersIds = await getOnlineUsersIds();
    if (!onlineUsersIds.length) {
      setUsers(users);
    }

    const updatedUsers = users.map((user) => ({
      ...user,
      isOnline: onlineUsersIds.includes(user.id),
    }));

    setUsers(updatedUsers);

    if (!initialized.current) {
      initialize(!onlineUsersIds.length ? users : updatedUsers);
    }

    return !onlineUsersIds.length ? users : updatedUsers;
  }

  useEffect(() => {
    if (!defaultChannel || !gameChannel) return;
    fetchUsers();

    defaultChannel.subscribe("activation.start", handleActivationStart);
    defaultChannel.subscribe("activation.start", handleActivationStart);
    defaultChannel.subscribe("activation.complete", handleActivationComplete);
    gameChannel.subscribe("new.element", handleGameUpdate);

    defaultChannel.participant.subscribe("presence.leave", (message) =>
      handleParticipantStatusChange(message.id, false)
    );
    defaultChannel.participant.subscribe("presence.joined-room", (message) =>
      handleParticipantStatusChange(message.id, true)
    );
    defaultChannel.participant.subscribe<IUser>("presence.update", (message) =>
      handleParticipantUpdate(message)
    );

    const handleBeforeUnload = () => {
      if (hasJoinedRoom) {
        stopRoom();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      // defaultChannel.unsubscribe("activation.start", handleActivationStart);
      // defaultChannel.unsubscribe("activation.start", handleActivationStart);
      // defaultChannel.unsubscribe(
      //   "activation.complete",
      //   handleActivationComplete
      // );
      // gameChannel.unsubscribe("new.element", handleGameUpdate);

      // defaultChannel.participant.unsubscribe("presence.leave");
      // defaultChannel.participant.unsubscribe("presence.joined-room");
      // defaultChannel.participant.unsubscribe("presence.update");

      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (!engineRef.current) return;

      Matter.Engine.clear(engineRef.current);
    };
  }, [defaultChannel, gameChannel]);

  return (
    <div
      ref={containerRef}
      className="walls relative overflow-hidden w-full h-full"
    >
      {balls
        .filter((ball) =>
          ballsFiltered.some((ballVisible) => ballVisible.id === ball.id)
        )
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
