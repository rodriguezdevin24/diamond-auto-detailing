//appointmentController.js

const Appointment = require("../models/Appointment");
const TimeSlot = require("../models/TimeSlot");


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
        if (!deletedAppointment) {
            res.status(404).json({ message: "Appointment not found"});
        }
        res.status(200).json({ message: "Appointment successfully deleted"})
    } catch (error) {
        res.status(500).json({ message: "Error deleting appointment", error: error.message})
    }
};
