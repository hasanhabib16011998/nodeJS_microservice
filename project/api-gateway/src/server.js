require('dotenv').config();
const express = require('express');
const cors = require('cors');
const redis = require('ioredis');
const helmet = require('helmet');
const { rateLimit } = require('express-rate-limit');
const { RedisStore } = require('rate-limit-redis');
const logger = require('./utils/logger');
const proxy = require('express-http-proxy');
const errorHandler = require('./middleware/errorHandler');
const validateToken = require('./middleware/authMiddleware');

const app = express()
const PORT = process.env.PORT || 3000;

const redisClient = new redis(process.env.REDIS_URL);

app.use(helmet());
app.use(cors());
app.use(express.json());

//rate limiting
const ratelimit = rateLimit({
    windowMs: 15*60*1000,
    max: 1000,
    standardHeaders: true,
    legacyHeaders:false,
    handler: (req,res)=>{
        logger.warn(`Sensitive endpoint rate limit exceeded for IP: ${req.ip}`)
        res.status(429).json({
            success: false,
            message: "Too many requests"
        })
    },
    store: new RedisStore({
        sendCommand: (...args)=> redisClient.call(...args),
    })

})

app.use(ratelimit);

app.use((req,res,next) => {
    logger.info(`Received ${req.method} request to ${req.url}`);
    logger.info(`Request body, ${req.body}`);
    next();
})

const proxyOptions = {
    proxyReqPathResolver: (req)=> {
        return req.originalUrl.replace(/^\/v1/,"/api")
    },
    proxyErrorHandler: (err,res,next) => {
        logger.error(`Proxy error: ${err.message}`);
        res.status(500).json({
            message: `Internal Server Error`, error: err.message
        })
    }
}

//setting up proxy for identity service
app.use(
    "/v1/auth",
    proxy(process.env.IDENTITY_SERVICE_URL, {
      ...proxyOptions,
      proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
        proxyReqOpts.headers["Content-Type"] = "application/json";
        return proxyReqOpts;
      },
      userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
        logger.info(
          `Response received from Identity service: ${proxyRes.statusCode}`
        );
  
        return proxyResData;
      },
    })
);

//setting up proxy for post service
app.use(
    "/v1/posts",
    validateToken,
    proxy(process.env.POST_SERVICE_URL, {
      ...proxyOptions,
      proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
        proxyReqOpts.headers["Content-Type"] = "application/json";
        proxyReqOpts.headers["x-user-id"] = srcReq.user.userId;
        return proxyReqOpts;
      },
      userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
        logger.info(
          `Response received from Post service: ${proxyRes.statusCode}`
        );
  
        return proxyResData;
      },
    })
);

//setting up proxy for media service
app.use(
  "/v1/media",
  validateToken,
  proxy(process.env.MEDIA_SERVICE_URL, {
    ...proxyOptions,
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      proxyReqOpts.headers["x-user-id"] = srcReq.user.userId;
      if(!srcReq.headers['content-type'].startsWith('multipart/form-data')) {
        proxyReqOpts.headers["Content-Type"] = "application/json";
      }
      return proxyReqOpts;
    },
    userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
      logger.info(
        `Response received from Media service: ${proxyRes.statusCode}`
      );

      return proxyResData;
    },
    parseReqBody: false,
  })
)

//setting up proxy for search service
app.use(
  "/v1/search",
  validateToken,
  proxy(process.env.SEARCH_SERVICE_URL, {
    ...proxyOptions,
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      proxyReqOpts.headers["Content-Type"] = "application/json";
      proxyReqOpts.headers["x-user-id"] = srcReq.user.userId;
      return proxyReqOpts;
    },
    userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
      logger.info(
        `Response received from Post service: ${proxyRes.statusCode}`
      );

      return proxyResData;
    },
  })
);


app.use(errorHandler);

app.listen(PORT, ()=> {
    logger.info(`API Gateway is running on port ${PORT}`);
    logger.info(`Identity Service is running on port ${process.env.IDENTITY_SERVICE_URL}`);
    logger.info(`Post Service is running on port ${process.env.POST_SERVICE_URL}`);
    logger.info(`Media Service is running on port ${process.env.MEDIA_SERVICE_URL}`);
    logger.info(`Search Service is running on port ${process.env.SEARCH_SERVICE_URL}`);

})