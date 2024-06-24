//timeSlotRoutes.js

const express = require('express');
const router = express.Router();
const timeSlotController = require('../controllers/timeSlotController');


//Route for creating time slots for the week 
router.post('/create-slot', timeSlotController.createWeeklyTimeSlots);

//Route for getting all time slots
router.get('/', timeSlotController.listTimeSlots);//

//Route for getting booked time slots
router.get('/booked', timeSlotController.listBookedSlots);//

//Route for getting available time slots
router.get('/available', timeSlotController.listAvailableSlots);

//Route for getting a time slot by ID
router.get('/:id', timeSlotController.getTimeSlotById);

//Route for updating a time slot by ID
router.put('/:id', timeSlotController.updateTimeSlot);

//Route for deleting a time slot by ID
router.delete('/:id', timeSlotController.deleteTimeSlot)

//Route for booking a time slot 
router.post('/new', timeSlotController.bookTimeSlot);
module.exports = router;
