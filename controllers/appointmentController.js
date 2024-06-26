//appointmentController.js

const Appointment = require("../models/Appointment");
const TimeSlot = require("../models/TimeSlot");
const emailService = require("../services/emailService")


//Create a new appointment

exports.createAppointment = async (req, res) => {
    const { timeSlotId, ...appointmentDetails } = req.body;
  try {
    const timeSlot = await TimeSlot.findById(timeSlotId);
    if (!timeSlot || timeSlot.isBooked) {
        return res.status(400).json({ message: "Time slot not available"});
    }

    timeSlot.isBooked = true;
    await timeSlot.save();


    const appointment = new Appointment({...appointmentDetails, timeSlot: timeSlotId});
    
    //Send an email notifcation
    await emailService.sendEmail('newAppointment', appointment)
    await appointment.save();

    res.status(201).json(appointment);

  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating appointment", error: error.message });
  }
};


//Get all appointments

exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({});
    res.status(200).json(appointments);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching appointments", error: error.message });
  }
};


// Get appointment by ID

exports.getAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      res.status(401).json({ message: "Appointment not found" });
    }
    res.json(appointment);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error finding appointment", error: error.message });
  }
};


//Update an appointment 

exports.updateAppointment = async (req, res) => {
    try {
        const appointmentId = req.params.id;
        const updatedInfo = req.body;
        const updatedAppointment = await Appointment.findByIdAndUpdate (appointmentId, updatedInfo, {new: true});

        //Send an email notification for status update 
        await emailService.sendEmail('statusUpdate', updatedAppointment)

        res.status(200).json(updatedAppointment);
    } catch (error) {
        res.status(400).json({ message: "Error updating appointment"});
    }
};


//Delete an appointment

exports.deleteAppointment = async (req, res ) => {
    try { 
        const appointmentId = req.params.id
        const deletedAppointment = await Appointment.findByIdAndDelete(appointmentId);

        if (deletedAppointment) {
          await emailService.sendEmail('cancellation', deletedAppointment)
          res.status(200).json({ message: "Appointment successfully deleted"})
        } else {
          res.status(404).json({ message: "Appointment not found"});
        }
       
    } catch (error) {
        res.status(500).json({ message: "Error deleting appointment", error: error.message})
    }
};


//Delete ALL appointments from DB

exports.deleteAllAppointments = async (req, res) => {
  try {
    await Appointment.deleteMany({});
    res.status(200).json({ message: "All appointments deleted succesfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting all appointments", error: error.message });
  }
};


