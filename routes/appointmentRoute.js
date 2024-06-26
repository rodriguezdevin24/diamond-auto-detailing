const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');


//Create an appointment
router.post('/', appointmentController.createAppointment);

//Get all appointments
router.get('/', appointmentController.getAllAppointments);

//Get appointment by ID
router.get('/:id', appointmentController.getAppointment);

//Hard delete ALL time slots 
router.delete('/delete-all', appointmentController.deleteAllAppointments);

//Update an appointment
router.put('/:id', appointmentController.updateAppointment);

//Delete appointment
router.delete('/:id', appointmentController.deleteAppointment);


module.exports = router; 