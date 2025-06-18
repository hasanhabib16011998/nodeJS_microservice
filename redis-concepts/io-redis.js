const Redis = require('ioredis');

//redis client library for nodejs
const redis = new Redis();

async function ioRedisDemo(){
    try{
        await redis.set('key','value');
        const val = await redis.get('key');
        console.log(val);
    } catch(e){


    } finally {
        redis.quit()
    }

}
ioRedisDemo();