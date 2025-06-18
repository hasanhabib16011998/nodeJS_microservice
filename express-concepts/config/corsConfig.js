const cors = require('cors');

const configureCors = ()=> {
    return cors({
        //origin -> which origins will be allowed to access your API
        origin: (origin, callback) => {
            const allowedOrigins = [
                'http://localhost:3000', //local dev
                'https://yourcustomdomain.com'
            ]

            if(!origin || allowedOrigins.indexOf(origin) !== -1){
                callback(null,true) //giving permission so that req can be allowed
            } else {
                callback(new Error('Not Allowed by cors'))
            }
        },
        methods: ['GET','POST','PUT','DELETE'],
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'Accept-Version'
        ],
        exposedHeaders: ['X-Total_Count', 'Content-Range'],
        credentials: true,//this will enable support for cookies
        preflightContinue: false,
        maxAge: 600, //cache pre flight responses for 10 mins -> avoid sending options requests multiple times
        optionsSuccessStatus: 204
    })
}

module.exports = {configureCors};