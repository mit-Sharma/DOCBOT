import mongoose ,{Schema} from 'mongoose';

const userSchema=new mongoose.Schema({
   
    email:{
        type:String,
        required:[true,'Please provide a email'],
        
       
    },
    password:{
        type:String,
        required:[true,'Please provide a password'],
        
    }

},{timestamps:true})

export const User=mongoose.model('User',userSchema)