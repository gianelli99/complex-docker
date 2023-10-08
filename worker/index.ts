import { redisHost, redisPort } from "./keys";

import { createClient } from "redis";

const redisClient = createClient({
  host: redisHost,
  port: parseInt(redisPort),
  retry_strategy: () => 1000,
});

const sub = redisClient.duplicate();

const fib = (index: number): number => {
  if (index < 2) {
    return 1;
  }

  return fib(index - 1) + fib(index - 2);
};

sub.on("message", (channel, message) => {
  redisClient.hset("values", message, fib(parseInt(message)).toString());
});

sub.subscribe("insert");
