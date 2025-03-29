require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const i18next = require('i18next');
const cors = require('cors');
const path = require('path');

const app = express();

// Database connection handling
const connectDB = async () => {
  if (process.env.NODE_ENV === 'production') {
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI is required in production');
      process.exit(1);
    }
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
      console.error('Production MongoDB connection failed:', err.message);
      process.exit(1);
    }
  } else {
    console.log('Development mode - Using in-memory data');
    // Add any mock data initialization here if needed
  }
};

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

// Passport config
require('./config/passport')(passport);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/cities', require('./routes/cities'));
app.use('/api/hotels', require('./routes/hotels'));
app.use('/api/places', require('./routes/places'));
app.use('/api/events', require('./routes/events'));
app.use('/api/tournaments', require('./routes/tournaments'));

// i18n initialization
const resources = {
  en: { translation: require('./public/locales/en.json') }
};

['ar', 'fr'].forEach(lang => {
  try {
    resources[lang] = { translation: require(`./public/locales/${lang}.json`) };
  } catch (err) {
    console.log(`${lang} translations not found, using English fallback`);
  }
});

i18next.init({
  fallbackLng: 'en',
  resources
});

// Start server
const startServer = async () => {
  await connectDB();
  
  const PORT = process.env.PORT || 5000;
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Trying alternative port...`);
      const altServer = app.listen(0, () => {
        console.log(`Server running on port ${altServer.address().port}`);
      });
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });
};

startServer();