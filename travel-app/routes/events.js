const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const City = require('../models/City');
const { check, validationResult } = require('express-validator');

// @route   GET /api/events
// @desc    Get all events (with optional filters)
router.get('/', async (req, res) => {
  try {
    const { city, type, upcoming } = req.query;
    const query = {};
    
    if (city) query.city = city;
    if (type) query.type = type;
    if (upcoming === 'true') {
      query.startDate = { $gte: new Date() };
    }

    const events = await Event.find(query)
      .populate('city', 'name country')
      .sort({ startDate: 1 });
    
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/events/:id
// @desc    Get single event
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('city', 'name country');
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }
    res.json(event);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Event not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/events
// @desc    Create an event
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('city', 'City is required').not().isEmpty(),
    check('type', 'Type is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('venue', 'Venue is required').not().isEmpty(),
    check('startDate', 'Start date is required').not().isEmpty(),
    check('endDate', 'End date is required').not().isEmpty()
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

      const newEvent = new Event({
        ...req.body
      });

      const event = await newEvent.save();
      res.json(event);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT /api/events/:id
// @desc    Update an event
router.put('/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).populate('city', 'name country');
    
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }
    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/events/:id
// @desc    Delete an event
router.delete('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    await event.remove();
    res.json({ msg: 'Event removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;