import User from "../models/UserModel.js";
import { hash, compare } from "bcryptjs";
import { encrypt } from "../utils/jwt.js";

// Signup function
const signup = async (req, res) => {
  try {
    const body = req.body;
    // Check if user already exists
    const existingUser = await User.findOne({ email: body.email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "کابر وجود دارد" });
    }
    // Hash the password
    const hashedPassword = await hash(body.password, 10);
    // Create and save new user
    const newUser = await User.create({
      ...body,
      password: hashedPassword,
      admin: false,
    });
    const token = await encrypt({ _id: newUser._id.toString() });
    // Success response
    // توی login و signup بعد از ساخت توکن اینو بزن:

    res.cookie("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict", // یا 'Lax'
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    });

    res.status(200).json({ success: true, message: "Logged in" }); // توکنو نفرست به فرانت
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
// Login function
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "ایمیل نادرست" });
    }
    // Compare password with hashed version
    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "ایمیل یا پسورد نادرست" });
    }
    // Generate JWT token
    const token = await encrypt({ _id: user._id.toString() });
    // Send token in response
    // توی login و signup بعد از ساخت توکن اینو بزن:

    res.cookie("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict", // یا 'Lax'
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    });

    res.status(200).json({ success: true, message: "Logged in" }); // توکنو نفرست به فرانت
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
// Export functions
export default { signup, login };
