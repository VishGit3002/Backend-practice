import User from "../models/auth.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { signupSchema, loginSchema } from "../utils/validation.js";

export async function signup(req, res) {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.errors[0].message });
  }
  const { name, email, password, isAdmin, balance } = parsed.data;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    isAdmin,
    balance,
  });

  const newUser = await User.findById(user._id)
  // console.log(user,newUser)
  
  const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
  // console.log("refreshToken", refreshToken);
  // console.log("accessToken", accessToken);

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 15 * 60 * 1000
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.json({ status: "success", data: newUser });
}


export async function login(req, res) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.errors[0].message });
  }
  const { email, passwords } = parsed.data;

  const existingUser = await User.findOne({ email }).select("+password");
  // console.log(existingUser);
  // console.log(passwords);

  if (!existingUser) {
    return res.status(400).json({ message: "User not found" });
  }
  const { password, ...user} = existingUser.toObject()

  const isPasswordValid = await bcrypt.compare(passwords, password);

  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid password" });
  }

  const refreshToken = jwt.sign(
    { id: existingUser._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );
  const accessToken = jwt.sign(
    { id: existingUser._id },
    process.env.JWT_SECRET,
    { expiresIn: "15m" },
  );
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 15 * 60 * 1000
  });
  res.json({
    status: "success",
    data: user,
    
  });
}


export async function logout(req, res) {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
}

export function getuser(req, res) {
  const user = req.user;
  res.json({ status: "success", data: user });
}


export async function accessToken(req, res) {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decodedToken = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await User.findById(decodedToken.id);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 15 * 60 * 1000
    });
    res.json({ status: "success", accessToken });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}
