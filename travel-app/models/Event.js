const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema({
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
    enum: ['concert', 'festival', 'exhibition', 'sports', 'cultural', 'food'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  venue: {
    type: String,
    required: true
  },
  location: {
    lat: Number,
    lng: Number
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  price: {
    type: Number
  },
  images: [{
    url: String,
    caption: String
  }],
  organizer: {
    name: String,
    contact: String
  },
  website: String,
  tags: [String],
  isFeatured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

EventSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for better query performance
EventSchema.index({ city: 1, startDate: 1 });
EventSchema.index({ type: 1, isFeatured: 1 });

module.exports = mongoose.model('Event', EventSchema);