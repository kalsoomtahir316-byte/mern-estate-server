import Listing from "../models/Listing.js";

export async function create(req,res){
  const doc = await Listing.create({ ...req.body, listedBy: req.user.uid });
  res.status(201).json(doc);
}
export async function getOne(req,res){
  const doc = await Listing.findById(req.params.id);
  if(!doc) return res.status(404).json({msg:"Not found"});
  res.json(doc);
}
export async function update(req,res){
  const doc = await Listing.findByIdAndUpdate(req.params.id, req.body, {new:true});
  res.json(doc);
}
export async function remove(_req,res){ res.json({ok:true}); }
export async function search(req,res){
  const { q, city, type, min, max, beds, page=1, limit=12 } = req.query;
  const f = {};
  if(city) f.city = new RegExp(`^${city}$`,'i');
  if(type) f.type = type;
  if(beds) f.bedrooms = { $gte:Number(beds) };
  if(min || max) f.price = { ...(min && {$gte:+min}), ...(max && {$lte:+max}) };
  let query = Listing.find(f);
  if(q) query = query.find({ $text: { $search: q } });
  const items = await query.sort({createdAt:-1}).skip((page-1)*limit).limit(+limit).lean();
  const total = await Listing.countDocuments(f);
  res.json({ items, total });
}