const redis = require('redis');

const client = redis.createClient({
    host: "localhost",
    port: 6379
});

//event listener
client.on('error', (error)=> console.log('Redis client error occurred', error));

async function redisDataStructures(){
    try{
        await client.connect();
        //strings
        await client.set("user:name", "Hasan Habib")
        const name = await client.get("user:name")
        //console.log(name);

        await client.mSet(["user:email", "hasan16habib@gmail.com","user:age", "27", "user:country", "Bangladesh"])
        const [email,age,country] = await client.mGet(["user:email","user:age","user:country"]);
        //console.log(email,age,country);

        //lists -> LPUSH, RPUSH, LRANGE, LPOP
        //await client.lPush("tasks", ["task 1","task 2","task 3"]);
        const extractAllTasks = await client.lRange("tasks", 0, -1);
        //console.log(extractAllTasks);

        const firstTask = await client.lPop("tasks");
        //console.log(firstTask);

        const remainingTasks = await client.lRange("tasks", 0, -1);
        //console.log(remainingTasks);

        //sets -> SADD, SMEMBERS, SISMEMBER, SREM


        //hases -> HSET,HGET.HGETALL,HDEL
        await client.hSet('product:1',{
            name: 'Product 1',
            description: 'product 1 description',
            rating: '5'
        })
        const getProductRating = await client.hGet('product:1','rating');
        console.log(getProductRating);

        const getProductDetails = await client.hGetAll('product:1');
        console.log(getProductDetails);

        await client.hDel('product:1','rating');
        const updatedProductDetails = await client.hGetAll('product:1');
        console.log(updatedProductDetails);


    } catch(e){
        console.error(e);

    } finally {
        client.quit();
    }
}

redisDataStructures();