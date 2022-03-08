const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt=require('bcryptjs');

const userSchema = new mongoose.Schema({
  username:{
    type:String,
    required:[true,'The username is required']
  },
  email:{
    type:String,
    required:[true,'The name is required'],
    lowercase:true,
    unique:[true,'The entered value is dublicated (it should be unique)'],
    validate:[validator.isEmail,'Please provide a valid email']
  },
  role:{
    type: String,
    enum:['user', 'admin'],
    default:'user'
  },
  password:{
    type:String,
    required:[true,'The password is required'],
    minlength:8,
    select:false
  },
  confirmPassword:{
    type:String,
    required:[true,'The password confirm is required'],
    validate: {
      validator: function(el){
        return el=== this.password;
      },
      message:'the passwords are not identicals'
    }
  },
  updatedAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
  },
});

userSchema.pre('save', async function(next) {
  if(!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password,12);
  this.confirmPassword = undefined;
  next();
});

userSchema.methods.correctPassword = async function(candidatPassword,userPassword) {
  return bcrypt.compare(candidatPassword,userPassword);
}

module.exports = mongoose.model('User',userSchema);
