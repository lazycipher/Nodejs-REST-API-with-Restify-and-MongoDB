const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = mongoose.model('User');
exports.authenticate    =  (email, password) => {
    return new Promise(async (resolve, reject) => {
        try{
            //Get User by Email
            const user = await User.findOne({email});

            //Password Check
            bcrypt.compare(password.toString(), user.password, (err, isMatch)=>{
                if(err) throw err;
                if(isMatch){
                    resolve(user);
                }else{
                    //Password Wrong
                    reject("Auth Failed");
                }
            });
        }catch(err){
            //Email Not Found
            reject('Auth Failed');
        }
    });
}