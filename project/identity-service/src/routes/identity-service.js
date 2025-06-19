const express  = require('express');

const {registerUser} = require('../controllers/indentity-controller');
const router = express.Router();

router.post('/register', registerUser);

module.exports = router;