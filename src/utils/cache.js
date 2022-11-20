const chalk = require("chalk");
const { Client } = require("discord.js");
const redis = require("redis");

class PterodactylCache {
    /**
     * @param {Client} client The Discord Client
     * @param {Object} redis The Redis Client
     * @param {String} redis.host The Redis Host
     * @param {Number} redis.port The Redis Port
     * @param {String} redis.username The Redis username 
     * @param {String} redis.password The Redis Password
     */
    constructor(client, redis) {
        this.client = client;

        this.redisObject = redis;

        this.redis = null;
    }

    async connect() {

        this.redis = redis.createClient({
            url: `redis://${this.redisObject.host}:${this.redisObject.port}`,
            username: this.redisObject.username,
            password: this.redisObject.password
        })

        this.redis.on("error", (err) => {
            console.log(chalk.red("[ERROR]"), `An error occured (${err.message})`, err.stack);
        })

        this.redis.on("ready", () => {
            console.log(chalk.green("[READY]"), "Connected to Redis!");
        })

        await this.redis.connect();

        return this.redis;
    }

    async get(key) {
        return await this.redis.get(key);
    }

    async set(key, value, expire) {
        if (!expire) {
            return await this.redis.set(key, value);
        } else {
            return await this.redis.SETEX(key, expire, value);
        }
    }

    async delete(key) {
        return await this.redis.del(key);
    }

    async keys(pattern) {
        return await this.redis.keys(pattern);
    }

    async close() {
        return await this.redis.quit();
    }

    async getAll() {
        return await this.redis.keys("*");
    }

    async getTTL(key) {
        return await this.redis.ttl(key);
    }
}

module.exports = PterodactylCache;