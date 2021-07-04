const jwt = require('jsonwebtoken');
const secret = require('../secret.json')
module.exports = (req,res,next) => {
    try{

        const tokenRaw = req.headers["authorization"];
        const token = tokenRaw.split(" ")[1];

        if(token == undefined || token.length == 0){
            res.status(400);
            res.sendStatus(400);
            return;
        }

        const decoded = jwt.verify(token,secret.jwtPass);

        if(decoded["role"] == 0){
            res.status(401);
            res.send("Voce nao e admin");
            return;
        }
        
        next();

    } catch(err){
        res.status(401);
        res.sendStatus(401);
        console.error(err);
    };
};