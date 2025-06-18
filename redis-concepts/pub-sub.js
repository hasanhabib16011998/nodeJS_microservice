const redis = require('redis');

const client = redis.createClient({
    host: "localhost",
    port: 6379
});

//event listener
client.on('error', (error)=> console.log('Redis client error occurred', error));

async function testAdditionalFeatures(){
    try{
        await client.connect();

        // const subscriber = client.duplicate(); //create a new client that share the same connection
        // await subscriber.connect();
        // await subscriber.subscribe('dummy-channel',(message,channel) => {
        //     console.log(`Received message from ${channel}: ${message}`);
        // });

        // await client.publish('dummy-channel', 'Some dummy Data from publisher');
        // await client.publish('dummy-channel', 'Some new Data from publisher');

        // await new Promise((resolve)=> setTimeout(resolve, 3000));
        // await subscriber.unsubscribe('dummy-channel');
        // await subscriber.quit();

        //pipelining and transactions
        const multi = client.multi();
        multi.set('key-transaction1', 'value1');
        multi.set('key-transaction2', 'value2');
        multi.get('key-transaction1');
        multi.get('key-transaction2');

        const results = await multi.exec();
        console.log(results);

        const pipeline = client.multi();
        multi.set('key-pipeline1', 'value1');
        multi.set('key-pipeline2', 'value1');
        multi.get('key-pipeline1');
        multi.get('key-pipeline2');
        const pipelineresults = await multi.exec();
        console.log(pipelineresults);

        //batch data operation
        const pipelineOne = client.multi();
        for(let i=0; i<1000;i++){
            pipeline.set(`user:${i}:action`, `Action ${i}`)
        }
        await pipelineOne.exec()
        const dummyExample = client.multi()

    } catch(e){
        console.error(e);

    } finally {
        client.quit();
    }
}

testAdditionalFeatures();