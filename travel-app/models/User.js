const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  facebookId: {
    type: String,
    unique: true,
    sparse: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  displayName: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  favorites: {
    cities: [{ type: Schema.Types.ObjectId, ref: 'City' }],
    hotels: [{ type: Schema.Types.ObjectId, ref: 'Hotel' }],
    places: [{ type: Schema.Types.ObjectId, ref: 'Place' }],
    events: [{ type: Schema.Types.ObjectId, ref: 'Event' }]
  },
  preferredLanguage: {
    type: String,
    enum: ['en', 'ar', 'fr'],
    default: 'en'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);