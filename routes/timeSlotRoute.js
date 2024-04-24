//timeSlotRoutes.js

const express = require('express');
const router = express.Router();
const timeSlotController = require('../controllers/timeSlotController');


//Route for creating a new time slot
router.post('/', timeSlotController.createTimeSlot);

//Route for getting all time slots
router.get('/', timeSlotController.listTimeSlots);

//Route for getting booked time slots
router.get('/booked', timeSlotController.listBookedSlots);

//Route for getting available time slots
router.get('/available', timeSlotController.listAvailableSlots);

//Route for getting a time slot by ID
router.get('/:id', timeSlotController.getBookedSlot);

//Route for updating a time slot by ID
router.put('/:id', timeSlotController.updateTimeSlot);

//Route for deleting a time slot by ID
router.delete('/:id', timeSlotController.deleteTimeSlot)


module.exports = router;
