const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const User = require('../Model/User');

const auth = async(req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const privateKey = fs.readFileSync(path.join(__dirname, '..', 'Model', 'private.key'));
        const decoded = jwt.verify(token, privateKey);
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token});

        if(!user){
            throw new Error('There is no user matching any received data');
        }

        req.user = user;
        req.token = token;
        next();
    } catch(error){
        res.status(401).send({error: 'Please Authenticate !'});
    }
}

module.exports = auth;