const errors    =   require('restify-errors');
const bcrypt    =   require('bcryptjs')

const User      =   require('../models/User');

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
}