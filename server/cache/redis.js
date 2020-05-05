const redis = require("redis");
const { promisify } = require("util");
const client = redis.createClient({
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST,
});

client.on("error", function (error) {
  console.error(error);
});

const redisGet = promisify(client.get).bind(client);
const redisSet = promisify(client.set).bind(client);

module.exports = {
  redisGet: redisGet,
  redisSet: redisSet,
};
