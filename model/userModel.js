const connection=require('./connection');
const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')


const UserSchema=new mongoose.Schema({
    userName:{
        type:String,
        unique:[true,'user name must be unique'],
        required:[true,'username required'],
    
    },
    name:{
        type:String,
        required:[true,'name required'],
        
    },
    email:{
        type:String,
        required:[true,'email required'],
        unique:[true,'email already exist'],
       validate:[validator.isEmail,'invalid email']
    },
    password:{
        type:String,
        required:[true,'password required'],
        minlength:8
    },
    verified:{
        type:Boolean,
        default:false
    }
});
UserSchema.methods.comparePassword=async function(candidatePassword,password){
    return await bcrypt.compare(candidatePassword,password);
}
UserSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next();
    this.password=await bcrypt.hash(this.password,12);
    next();
})
const User=mongoose.model('user',UserSchema);

module.exports=User;