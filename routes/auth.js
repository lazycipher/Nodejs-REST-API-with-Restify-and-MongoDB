const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const User = mongoose.model('user');

exports.authenticate    =  (email, password) => {
    return new Promise(async(resolve, reject) => {
        try{
            //Get User by Email
            const user = await User.findOne({email});
        }catch(err){
            //Email Not Found
            reject('Authentication Failed');
        }
    });
}