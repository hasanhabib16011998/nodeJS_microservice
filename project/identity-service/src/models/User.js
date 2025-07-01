const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // or: const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 10;

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase:true
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
},{
    timestamps:true,
}
);

userSchema.pre('save', async function(next){
    if(this.isModified('password')){
        try{
            this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
            next();
        }catch(error){
            return next(error)
        }
    } else {
        next();
    }
});

userSchema.methods.comparePassword = async function(candidatePassword){
    try{
        return await bcrypt.compare(candidatePassword, this.password);
    }catch(error){
        throw error
    }
}

userSchema.index({ username: 'text' });

const User = mongoose.model('User', userSchema);
module.exports = User;