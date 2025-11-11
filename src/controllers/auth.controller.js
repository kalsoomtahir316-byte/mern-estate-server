import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const cookieOpts = {
  httpOnly: true,
  sameSite: "lax",
  secure: false,
  maxAge: 1000 * 60 * 60 * 24 * 7,
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ msg: "Missing fields" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ msg: "Email already in use" });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash: hash });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, cookieOpts).status(201).json({
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (e) {
    next(e);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if(!email || !password){
      return res.status(400).json({ msg: "Missing fields" });
    }

    const user = await User.findOne({ email });
    if(!user){
      return res.status(404).json({ msg: "User not found" });
    }

    // IMPORTANT: compare plain password with saved hash
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    res.cookie("token", token, cookieOpts).status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      }
    });

  } catch (e) {
    next(e);
  }
};
export const me = async (req, res) => {
  const user = await User.findById(req.userId).select("-password");
  res.json({ user });
};

export const logout = async (_req, res) => {
  res.clearCookie("token", { ...cookieOpts, maxAge: 0 });
  res.json({ ok: true });
};