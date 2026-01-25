import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

// COOKIE OPTIONS
const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
};

// =====================
// SIGN UP
// =====================
export const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      avatar: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
      role: 'user', // default
    });

    await newUser.save();

    // Token with role
    const token = jwt.sign(
      {
        id: newUser._id,
        role: newUser.role,
      },
      process.env.JWT_SECRET
    );

    // Hide password
    const { password: pass, ...rest } = newUser._doc;

    res
      .cookie('access_token', token, cookieOptions)
      .status(201)
      .json({
        ...rest,
        role: newUser.role, // ✅ SEND ROLE
      });

  } catch (err) {
    next(err);
  }
};

// =====================
// SIGN IN
// =====================
export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = bcryptjs.compareSync(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Token with role
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET
    );

    const { password: pass, ...rest } = user._doc;

    res
      .cookie('access_token', token, cookieOptions)
      .status(200)
      .json({
        ...rest,
        role: user.role, // ✅ SEND ROLE
      });

  } catch (err) {
    next(err);
  }
};

// =====================
// GOOGLE AUTH
// =====================
export const google = async (req, res, next) => {
  try {
    const { email, name, photo } = req.body;

    let user = await User.findOne({ email });

    // USER EXISTS
    if (user) {

      const token = jwt.sign(
        {
          id: user._id,
          role: user.role,
        },
        process.env.JWT_SECRET
      );

      const { password: pass, ...rest } = user._doc;

      res
        .cookie('access_token', token, cookieOptions)
        .status(200)
        .json({
          ...rest,
          role: user.role, // ✅ SEND ROLE
        });

    } 
    // NEW USER
    else {

      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);

      const hashedPassword = bcryptjs.hashSync(
        generatedPassword,
        10
      );

      const newUser = new User({
        username: name.split(' ').join('').toLowerCase(),
        email,
        password: hashedPassword,
        avatar:
          photo ||
          'https://cdn-icons-png.flaticon.com/512/149/149071.png',
        role: 'user',
      });

      await newUser.save();

      const token = jwt.sign(
        {
          id: newUser._id,
          role: newUser.role,
        },
        process.env.JWT_SECRET
      );

      const { password: pass, ...rest } = newUser._doc;

      res
        .cookie('access_token', token, cookieOptions)
        .status(201)
        .json({
          ...rest,
          role: newUser.role, // ✅ SEND ROLE
        });
    }

  } catch (err) {
    next(err);
  }
};

// =====================
// SIGN OUT
// =====================
export const signOut = async (req, res, next) => {
  try {
    res.clearCookie('access_token');

    res.status(200).json({
      message: 'User has been logged out',
    });

  } catch (err) {
    next(err);
  }
};
