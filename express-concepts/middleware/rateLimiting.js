const rateLimit = require('express-rate-limit');

const createBasicRatelimiter = (maxRequests, time) => {
    return rateLimit({
        max: maxRequests,
        windowMs: time,
        message: 'Too mane requests, please try again later',
        standardHeaders: true,
        legacyHeaders: false,
    })
}

module.exports = { createBasicRatelimiter };