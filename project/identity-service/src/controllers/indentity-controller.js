const logger = require('../utils/logger');
const { validateRegistration, validateLogin } = require('../utils/validation');
const User  = require('../models/User');
const generateTokens = require('../utils/generateToken');
const RefreshToken = require('../models/RefreshToken');

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
const loginUser = async(req,res) => {
    logger.info("Login endpoint hit...");
    try{
        const {error} = validateLogin(req.body);
        if (error) {
            logger.warn('Validation error', error.details[0].message);
            return res.status(400).json({
                success:false,
                message: error.details[0].message,
            })
        }
        const {email,password} = req.body;
        const user = await User.findOne({email});
        
        //If user is not present
        if(!user) {
            logger.warn('Invalid User');
            return res.status(400).json({
                success: false,
                message: 'Invalid Credentials'
            })
        }

        //valid password or not
        const isValidPassword = await user.comparePassword(password);
        if(!isValidPassword) {
            logger.warn('Invalid Password');
            return res.status(400).json({
                success: false,
                message: 'Invalid Password'
            })
        }

        //access token
        const { accessToken, refreshToken } = await generateTokens(user);
        res.status(201).json({
            success:true,
            message: 'User successfully logged in',
            userId: user._id,
            accessToken,
            refreshToken
        })

    } catch (e) {
        logger.error('Login error occured', e);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })

    }
}


//refresh token
const refreshToken = async(req,res) =>{
    logger.info("Refresh token Endpoint hit")

    try {
        const { refreshToken } = req.body;
        if(!refreshToken) {
            logger.warn('Refresh token missing');
            return res.status(400).json({
                success: false,
                message: 'Refresh token missing'
            })
        }

        const storedToken = await RefreshToken.findOne({ token: refreshToken })

        if(!storedToken || storedToken.expiresAt < new Date()) {
            logger.warn('Invalid or expired refresh token')

            return res.status(401).json({
                success: false,
                message: 'Invalid or expired refresh token'
            })
        }

        const user = await User.findById(storedToken.user)

        if(!user) {
            logger.warn('User not found');
            return res.status(401).json({
                success: false,
                message: 'User not found'

            })
        }

        const {accesstoken: newAccessToken, refreshToken: newRefreshToken} = await generateToken(user);
        //delete the old refresh Token
        await RefreshToken.deleteOne({_id: storedToken._id})
        res.json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        })

    } catch (e) {
        logger.error('Refresh Token error occured', e);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })

    }
}

//logout
const logoutUser = async(req,res) => {
    logger.info("LogOut Endpoint hit...")

    try {
        const {refreshtoken} = req.body;
        if(!refreshToken) {
            logger.warn('Refresh token missing');
            return res.status(400).json({
                success: false,
                message: 'Refresh token missing'
            })
        }

        await RefreshToken.deleteOne({token: refreshToken})
        logger.info('Refresh Token deleted for logout')
        res.status(201).json({
            success:true,
            message: 'Logged out successfully',
        })



    } catch(e) {
        logger.error('Logout error occured', e);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}


module.exports = { registerUser, loginUser, refreshToken, logoutUser };