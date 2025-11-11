import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  title:{type:String,required:true,index:'text'},
  description:String,
  price:Number,
  type:{type:String,enum:['rent','sale'],index:true},
  bedrooms:Number,
  bathrooms:Number,
  areaSqft:Number,
  city:{type:String,index:true},
  address:String,
  images:[String],
  listedBy:{ type: mongoose.Schema.Types.ObjectId, ref:'User' },
  isActive:{ type:Boolean, default:true }
},{timestamps:true});
schema.index({ title:'text', description:'text', city:1, price:1, createdAt:-1 });
export default mongoose.model('Listing', schema);