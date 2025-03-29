const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['WorldCup', 'AfricaCup'], required: true },
  year: { type: Number, required: true },
  hostCities: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'City' 
  }],
  stadiums: [{
    name: String,
    city: { type: mongoose.Schema.Types.ObjectId, ref: 'City' },
    capacity: Number,
    image: String
  }],
  matches: [{
    date: Date,
    teams: [String],
    stadium: { type: mongoose.Schema.Types.ObjectId, ref: 'Stadium' },
    stage: String
  }]
});

module.exports = mongoose.model('Tournament', tournamentSchema);