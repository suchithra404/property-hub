import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

// COOKIE OPTIONS
const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
};

// =====================
// SIGN UP (Email OR Phone)
// =====================
export const signup = async (req, res, next) => {
  console.log("SIGNUP BODY:", req.body);

  try {

    const {
      username,
      email,
      phone,
      password,
      accountType
    } = req.body;

    // Must have email or phone
    if (!email && !phone) {
      return res
        .status(400)
        .json({ message: 'Email or phone is required' });
    }

    // Check existing user
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }]
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'User already exists' });
    }

    const hashedPassword =
      bcryptjs.hashSync(password, 10);

    const newUser = new User({
      username,
      email,
      phone,
      password: hashedPassword,
      accountType,
      avatar:
        'https://cdn-icons-png.flaticon.com/512/149/149071.png',
      role: 'user',
    });

    await newUser.save();

    // Token
    const token = jwt.sign(
      {
        id: newUser._id,
        role: newUser.role,
      },
      process.env.JWT_SECRET
    );

    const { password: pass, ...rest } =
      newUser._doc;

    res
      .cookie('access_token', token, cookieOptions)
      .status(201)
      .json({
        ...rest,
        role: newUser.role,
      });

  } catch (err) {
    next(err);
  }
};


// =====================
// SIGN IN (Email OR Phone)
// =====================
export const signin = async (req, res, next) => {
  try {

    const {
      email,
      phone,
      password
    } = req.body;

    // Must have email or phone
    if (!email && !phone) {
      return res
        .status(400)
        .json({ message: 'Email or phone is required' });
    }

    // Find by email or phone
    const user = await User.findOne({
      $or: [{ email }, { phone }]
    });

    if (!user) {
      return res
        .status(404)
        .json({ message: 'User not found' });
    }

    const isPasswordValid =
      bcryptjs.compareSync(
        password,
        user.password
      );

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: 'Invalid credentials' });
    }

    // Token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET
    );

    const { password: pass, ...rest } =
      user._doc;

    res
      .cookie('access_token', token, cookieOptions)
      .status(200)
      .json({
        ...rest,
        role: user.role,
      });

  } catch (err) {
    next(err);
  }
};


// =====================
// GOOGLE AUTH (Same)
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

      const { password: pass, ...rest } =
        user._doc;

      res
        .cookie('access_token', token, cookieOptions)
        .status(200)
        .json({
          ...rest,
          role: user.role,
        });

    }
    // NEW USER
    else {

      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);

      const hashedPassword =
        bcryptjs.hashSync(
          generatedPassword,
          10
        );

      const newUser = new User({
        username: name
          .split(' ')
          .join('')
          .toLowerCase(),

        email,

        password: hashedPassword,

        avatar:
          photo ||
          'https://cdn-icons-png.flaticon.com/512/149/149071.png',

        role: 'user',

        accountType:
          req.body.accountType || 'buyer',
      });

      await newUser.save();

      const token = jwt.sign(
        {
          id: newUser._id,
          role: newUser.role,
        },
        process.env.JWT_SECRET
      );

      const { password: pass, ...rest } =
        newUser._doc;

      res
        .cookie('access_token', token, cookieOptions)
        .status(201)
        .json({
          ...rest,
          role: newUser.role,
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
