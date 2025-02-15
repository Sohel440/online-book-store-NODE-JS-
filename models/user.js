const mongoose = require('mongoose');
const { type } = require('os');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,  
        required: true
    },
     role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    }
});

userSchema.pre('save', async function(next){
    const user = this;
    if(!user.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        const hashePassword = await bcrypt.hash(user.password ,salt);
        user.password = hashePassword;
        next();

    } catch (err) {
        return next(err);

    }
});

userSchema.methods.comparePassword = async function(candidatePassword){
    try{
        // Use bcrypt to compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    }catch(err){
        throw err;
    }
};

const User= mongoose.model('user', userSchema);
module.exports = {User};
