

const validateToken = (req,res,next) => {
    const authHeaders = req.headers['authorization'];
    const token = authHeaders.split(' ')[1];
    if(!token) {
        logger.warn('Access attempt without valid token!');
        return res.status(401).json({
            message:'Au'
        })
    }
}