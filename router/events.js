const express = require('express');
const router = express.Router();
const eventController = require('../controller/event-controller')

router.get('/', eventController.getEvents)
router.post('/', eventController.createEvent)
router.get('/:id', eventController.getEvent)
router.patch('/:id', eventController.updateEvent)
router.delete('/:id', eventController.deleteEvent)

module.exports = router;