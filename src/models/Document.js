import mongoose ,{Schema} from 'mongoose';

const documentSchema= new mongoose.Schema({
    user:{
         type:mongoose.Schema.Types.ObjectId,
         ref:"User"
        },
    filePath:{type:String,required:true},
    analysis:{
        severity:{type: String},
        dosage:{type:String},
        nextSteps:{type:String},
    }
},{timestamps:true})

export const Document=mongoose.model("Document",documentSchema);