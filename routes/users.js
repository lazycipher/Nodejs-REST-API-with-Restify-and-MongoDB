const errors    =   require('restify-errors');
const bcrypt    =   require('bcryptjs');
const User      =   require('../models/User');
const auth      =   require('../auth');
const jwt       =   require('jsonwebtoken');
const config     =   require('../config');

module.exports  =   server =>   {
    //Register User
    server.post('/register', (req, res, next)=>{
        const {name, email, password} = req.body;

        const user= new User({
            name,
            email,
            password
        });
        bcrypt.genSalt(10, (err, salt)=>{
            bcrypt.hash(user.password, salt, async (err, hash)=>{
                //HASH Password
                user.password   =  hash;
                //Save User
                try{
                    const newUser = await user.save();
                    res.send(201);
                    next();
                }catch{
                    return next(new errors.InternalError(err.message));
                }
            });
        });
    });
    
    //Auth User

    server.post('/auth', async (req, res, next) =>{
        const {email, password} = req.body;
        try{
             //Auth User
            const user = await auth.authenticate(email, password);
            const token = jwt.sign(user.toJSON(), config.JWT_SECRET, {
                expiresIn: '30m'
            });

            const {iat, exp} = jwt.decode(token);
            //Response wih Token
            res.send({iat, exp, token});

            next();
        }catch(err){
            //User !Auth
            return next(new errors.UnauthorizedError(err));
        }
    });
};