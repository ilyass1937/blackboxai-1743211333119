const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CitySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  country: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  highlights: [{
    title: String,
    description: String
  }],
  images: [{
    url: String,
    caption: String
  }],
  location: {
    lat: Number,
    lng: Number
  },
  languages: [{
    type: String,
    enum: ['en', 'ar', 'fr']
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
CitySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('City', CitySchema);