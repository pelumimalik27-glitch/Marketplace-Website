const mongoose = require('mongoose');

const Schema = mongoose.Schema

const paymentSchema = new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    order:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Order",
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    reference:{
        type:String,
        required:true,
        unique:true
    },
    status:{
        type:String,
        enum:['pending','success','failed'],
        default:'pending'
    },
      provider:
   {
      type: String,
      default: "paystack"
   }

},{timestamps:true});

module.exports = mongoose.model('Payment',paymentSchema)