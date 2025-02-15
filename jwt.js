const jwt = require('jsonwebtoken');

const jwtMiddleware = (req ,res, next)=>{
    const autho = req .headers.authorization;
    if(!autho) return res.status(401).json({error: "token not found !!"});

    const token = req.headers.authorization.split(' ')[1];
    if(!token) return res.status(401).json({message : "Unothorized!"});

    try { 
        const decode  = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode
        next();
    } catch (err) {
        console.log(err);
        res.status(401).json({error : "invalid token"});
    }
}

const generateToken =(userData)=>{
    return jwt.sign(userData ,process.env.JWT_SECRET);
}

module.exports = {generateToken, jwtMiddleware};
