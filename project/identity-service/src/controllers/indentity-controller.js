const logger = require('../utils/logger');
const { validateRegistration } = require('../utils/validation');
const User  = require('../models/User');
const generateTokens = require('../utils/generateToken');

// user registration
const registerUser = async(req,res) => {
    logger.info('Registration endpoint hit');

    try {
        const { error } = validateRegistration(req.body);
        if (error) {
            logger.warn('Validation error', error.details[0].message);
            return res.status(400).json({
                success:false,
                message: error.details[0].message,
            })
        }

        const {email,password,username} = req.body;

        let user = await User.findOne({ $or: [{email},{username}]});
        if(user){
            logger.warn('User already exists')
            return res.status(400).json({
                success:false,
                message: 'User already exists',
            })
        }
        user = new User({ username, email, password })
        await user.save()
        logger.warn('User successfully registered', user._id);
        const { accessToken, refreshToken } = await generateTokens(user);
            res.status(201).json({
                success:true,
                message: 'User successfully registered',
                accessToken,
                refreshToken
            })

    } catch (e) {
        logger.error('Registration error occured', e);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })



    }

}



//user login



//refresh token


//logout

module.exports = { registerUser };