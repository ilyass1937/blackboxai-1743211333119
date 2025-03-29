const express = require('express');
const router = express.Router();
const Hotel = require('../models/Hotel');
const City = require('../models/City');
const { check, validationResult } = require('express-validator');

// @route   GET /api/hotels
// @desc    Get all hotels (with optional city filter)
router.get('/', async (req, res) => {
  try {
    const { city } = req.query;
    const query = {};
    
    if (city) {
      query.city = city;
    }

    const hotels = await Hotel.find(query)
      .populate('city', 'name country')
      .sort({ rating: -1, name: 1 });
    
    res.json(hotels);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/hotels/:id
// @desc    Get single hotel
router.get('/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id).populate('city', 'name country');
    if (!hotel) {
      return res.status(404).json({ msg: 'Hotel not found' });
    }
    res.json(hotel);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Hotel not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/hotels
// @desc    Create a hotel
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('city', 'City is required').not().isEmpty(),
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

      const newHotel = new Hotel({
        ...req.body
      });

      const hotel = await newHotel.save();
      res.json(hotel);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT /api/hotels/:id
// @desc    Update a hotel
router.put('/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).populate('city', 'name country');
    
    if (!hotel) {
      return res.status(404).json({ msg: 'Hotel not found' });
    }
    res.json(hotel);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/hotels/:id
// @desc    Delete a hotel
router.delete('/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({ msg: 'Hotel not found' });
    }

    await hotel.remove();
    res.json({ msg: 'Hotel removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;