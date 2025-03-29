const express = require('express');
const Tournament = require('../models/Tournament');
const router = express.Router();

// Get all tournaments
router.get('/', async (req, res) => {
  try {
    const tournaments = await Tournament.find().populate('hostCities stadiums.city');
    res.json(tournaments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get tournament by type
router.get('/:type', async (req, res) => {
  try {
    const tournaments = await Tournament.find({ 
      type: req.params.type 
    }).populate('hostCities stadiums.city');
    res.json(tournaments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get tournament matches
router.get('/:id/matches', async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id)
      .select('matches')
      .populate('matches.stadium');
    res.json(tournament.matches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;