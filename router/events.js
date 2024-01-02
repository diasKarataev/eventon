const express = require('express');
const router = express.Router();
const Event = require('../entity/event');


router.post('/', async (req, res) => {
    try {
        const { title, description } = req.body;
        const newEvent = new Event({ title, description });
        const savedEvent = await newEvent.save();
        res.json(savedEvent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:id', getEvent, (req, res) => {
    res.json(res.event);
});

router.patch('/:id', getEvent, async (req, res) => {
    if (req.body.title != null) {
        res.event.title = req.body.title;
    }
    if (req.body.description != null) {
        res.event.description = req.body.description;
    }
    try {
        const updatedEvent = await res.event.save();
        res.json(updatedEvent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:id', getEvent, async (req, res) => {
    try {
        await res.event.remove();
        res.json({ message: 'Deleted Event' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

async function getEvent(req, res, next) {
    try {
        const event = await Event.findById(req.params.id);
        if (event == null) {
            return res.status(404).json({ message: 'Cannot find event' });
        }
        res.event = event;
        next();
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports = router;