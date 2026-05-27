import jwt from "jsonwebtoken"
import "dotenv/config";
import { ENV } from "./env.js";


export const generateToken = (userId, res) => {
  const { JWT_SECRET } = ENV;
  if(!JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }
    const token = jwt.sign({ userId }, JWT_SECRET, {
        expiresIn: "7d"
    });

    const isProd = process.env.NODE_ENV !== "development";
    res.cookie("jwt", token, {
      maxAge: 7 *24 * 60 * 60 * 1000,
      httpOnly: true, //prevent Xss attacks: cross-site scripting
      sameSite: isProd ? "none" : "strict", // "none" lets the cookie cross origins in prod
      secure: isProd,
    });
    return token;
};

