const express = require('express');
const passport = require('passport');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @route   GET /auth/google
// @desc    Authenticate with Google
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

// @route   GET /auth/google/callback
// @desc    Google auth callback
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, create JWT
    const token = jwt.sign(
      { userId: req.user.id },
      process.env.SESSION_SECRET,
      { expiresIn: '7d' }
    );
    res.redirect(`/?token=${token}`);
  }
);

// @route   GET /auth/facebook
// @desc    Authenticate with Facebook
router.get(
  '/facebook',
  passport.authenticate('facebook', {
    scope: ['public_profile', 'email']
  })
);

// @route   GET /auth/facebook/callback
// @desc    Facebook auth callback
router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, create JWT
    const token = jwt.sign(
      { userId: req.user.id },
      process.env.SESSION_SECRET,
      { expiresIn: '7d' }
    );
    res.redirect(`/?token=${token}`);
  }
);

// @route   POST /auth/local
// @desc    Authenticate with email/password
router.post('/local', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // TODO: Implement password comparison
    const isMatch = true; // Replace with actual password check

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.SESSION_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;