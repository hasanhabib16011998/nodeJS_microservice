require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const mediaRoutes = require("./routes/media-routes");
const errorHandler = require("./middleware/errorHandler");
const logger = require("./utils/logger");


const app = express();
const PORT = process.env.PORT || 3003;

// connect to mongodb
mongoose
  .connect(process.env.DB_URL)
  .then(() => logger.info('Connected to mongodb'))
  .catch((e) => logger.error('Mongo connection error', e));


app.use(cors());
app.use(helmet());
app.use(express.json());

app.use((req, res, next) => {
    logger.info(`Received ${req.method} request to ${req.url}`);
    logger.info(`Request body, ${req.body}`);
    next();
});

app.use("/api/media", mediaRoutes);


//error handler
app.use(errorHandler);

app.listen(PORT, ()=> {
    logger.info(`Media service is running on port ${PORT}`)
})

//unhandled promise rejection
process.on('unhandledRejection',(reason, promise) => {
    logger.error("Unhandled Rejection at", promise, "reason:", reason);
});