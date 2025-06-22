const express  = require('express');

const {registerUser, loginUser, refreshToken, logoutUser } = require('../controllers/indentity-controller');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh-token', loginUser);
router.post('/logout', loginUser);




module.exports = router;