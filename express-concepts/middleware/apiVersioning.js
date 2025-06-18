const urlVersioning = (version) => (req,res,next) => {
    if(req.path.startsWith(`/api/${version}`)) {
        next();
    }
    else {
        res.status(404).json({
            success:false,
            error: "API version is not supported",
        });
    }
}

//use this if you send version along with header
const headerVersioning = (version) => (req,res,next) => {
    if(req.get('Accept-Version') === version) {
        next()
    }
    else {
        res.status(404).json({
            success:false,
            error: "API version is not supported",
        });
    }
}

module.exports = { urlVersioning, headerVersioning };