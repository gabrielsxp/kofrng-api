const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const User = require('../Model/User');

const admin = async(req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const privateKey = fs.readFileSync(path.join(__dirname, '..', 'Model', 'private.key'));
        const decoded = jwt.verify(token, privateKey);
        console.log("DECODED:" + decoded._id);
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token});

        if(!user){
            throw new Error('There is no user matching any received data');
        }
        if(user.role !== 1){
            return res.status(401).send({error: 'You do not have permission to access this route'});
        }
        req.user = user;
        req.token = token;
        next();
    } catch(error){
        console.log(error);
        res.status(401).send({error: 'Please Authenticate !'});
    }
}

module.exports = admin;