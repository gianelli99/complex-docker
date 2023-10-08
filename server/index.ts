import * as keys from "./keys";

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import redis from "redis";
import { Pool } from "pg";

const app = express();

app.use(cors());
app.use(bodyParser.json());

const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: parseInt(keys.pgPort),
});

pgClient.on("error", () => {
  console.log("Lost PG connection");
});

pgClient.on("connect", (client) => {
  client
    .query("CREATE TABLE IF NOT EXISTS values (number INT)")
    .catch((err) => console.error(err));
});

//redis client setup
const redisClient = redis.createClient({
  host: keys.redisHost,
  port: parseInt(keys.redisPort),
  retry_strategy: () => 1000,
});

const redisPublisher = redisClient.duplicate();

app.get("/", (_req, res) => {
  res.send("Hi");
});

app.get("/values/all", async (_req, res) => {
  const { rows } = await pgClient.query("SELECT * FROM values");

  res.send(rows);
});

app.get("/values/current", async (_req, res) => {
  redisClient.hgetall("values", (_err, values) => {
    res.send(values);
  });
});

app.post("/values", async (req, res) => {
  const index = req.body.value;

  if (parseInt(index) > 40) {
    return res.status(422).send("Index too high");
  }

  redisClient.hset("values", index, "Nothing yet!");
  redisPublisher.publish("insert", index);
  pgClient.query("INSERT INTO values (number) VALUES ($1)", [index]);

  res.send({ working: true });
});

app.listen(5_000, () => {
  console.log("Listening on port 5000");
});
