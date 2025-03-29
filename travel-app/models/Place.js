const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlaceSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  city: {
    type: Schema.Types.ObjectId,
    ref: 'City',
    required: true
  },
  type: {
    type: String,
    enum: ['attraction', 'restaurant', 'historical', 'park', 'museum', 'shopping'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  location: {
    lat: Number,
    lng: Number
  },
  openingHours: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    hours: String
  }],
  priceRange: {
    type: String,
    enum: ['$', '$$', '$$$', '$$$$']
  },
  images: [{
    url: String,
    caption: String
  }],
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  features: [String],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

PlaceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Place', PlaceSchema);