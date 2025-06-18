require('dotenv').config()

const express = require('express');
const {configureCors} = require('./config/corsConfig');
const { requestLogger,addTimeStamp } = require('./middleware/customMiddleware');
const { globalErrorHandler } = require('./middleware/errorHandler');
const { urlVersioning } = require('./middleware/apiVersioning');
const { createBasicRatelimiter } = require('./middleware/rateLimiting');
const itemRoutes = require('./routes/item-routes');

const app = express();
const PORT = process.env.PORT || 3000;


//express json middleware
app.use(requestLogger);
app.use(addTimeStamp);
app.use(configureCors());
app.use(createBasicRatelimiter(10, 15*60*1000)); //10 requests per 15 minutes
app.use(express.json())

//version control
app.use(urlVersioning('v1'));
app.use('/api/v1', itemRoutes);

//error handlers
app.use(globalErrorHandler);



app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`)
})