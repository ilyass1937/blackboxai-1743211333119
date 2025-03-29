const express = require('express');
const router = express.Router();
const Place = require('../models/Place');
const City = require('../models/City');
const { check, validationResult } = require('express-validator');

// @route   GET /api/places
// @desc    Get all places (with optional filters)
router.get('/', async (req, res) => {
  try {
    const { city, type } = req.query;
    const query = {};
    
    if (city) query.city = city;
    if (type) query.type = type;

    const places = await Place.find(query)
      .populate('city', 'name country')
      .sort({ rating: -1, name: 1 });
    
    res.json(places);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/places/:id
// @desc    Get single place
router.get('/:id', async (req, res) => {
  try {
    const place = await Place.findById(req.params.id).populate('city', 'name country');
    if (!place) {
      return res.status(404).json({ msg: 'Place not found' });
    }
    res.json(place);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Place not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/places
// @desc    Create a place
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('city', 'City is required').not().isEmpty(),
    check('type', 'Type is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('address', 'Address is required').not().isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Verify city exists
      const city = await City.findById(req.body.city);
      if (!city) {
        return res.status(400).json({ msg: 'City does not exist' });
      }

      const newPlace = new Place({
        ...req.body
      });

      const place = await newPlace.save();
      res.json(place);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT /api/places/:id
// @desc    Update a place
router.put('/:id', async (req, res) => {
  try {
    const place = await Place.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).populate('city', 'name country');
    
    if (!place) {
      return res.status(404).json({ msg: 'Place not found' });
    }
    res.json(place);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/places/:id
// @desc    Delete a place
router.delete('/:id', async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) {
      return res.status(404).json({ msg: 'Place not found' });
    }

    await place.remove();
    res.json({ msg: 'Place removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;