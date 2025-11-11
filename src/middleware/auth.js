import jwt from "jsonwebtoken";
export function requireAuth(req,res,next){
  const h = req.headers.authorization || "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : null;
  if(!token) return res.status(401).json({msg:"No token"});
  try{ req.user = jwt.verify(token, process.env.JWT_ACCESS_SECRET); next(); }
  catch{ res.status(401).json({msg:"Invalid token"}); }
}