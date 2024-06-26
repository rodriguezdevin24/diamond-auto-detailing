// timeSlotController.js

const TimeSlot = require("../models/TimeSlot");
// const generateTimeSlotsForWeek = require('../services/timeSlotGenerator');
const Appointment = require("../models/Appointment");

//Book a time slot
exports.bookTimeSlot = async (req, res) => {
  const {
    startTime,
    phoneNumber,
    addressLine1,
    addressLine2,
    zipCode,
    duration,
    userId,
    packageId,
  } = req.body;

  try {
    const startTimeDate = new Date(startTime);
    const endTimeDate = new Date(
      startTimeDate.getTime() + duration * 60 * 60 * 1000
    );

    //Business hours constraints
    const businessStartHour = 9;
    const businessEndHour = 17;

    const startHourUTC = startTimeDate.getUTCHours();
    const endHourUTC = endTimeDate.getUTCHours();
    const dayOfWeek = startTimeDate.getUTCDay();

    if (startHourUTC < businessStartHour || endHourUTC > businessEndHour) {
      return res
        .status(400)
        .json({ message: "Booking must be within business hours (9am to 5pm" });
    }

    if (!dayOfWeek === 0 || dayOfWeek === 6) {
      return res
        .status(400)
        .json({ message: "Bookings can only be made Monday through Friday" });
    }

    //Logic to prevent overlapping appointments
    const overlappingSlots = await TimeSlot.find({
      startTime: { $lt: endTimeDate },
      endTime: { $gt: startTimeDate },
      isBooked: true,
    });

    if (overlappingSlots.length > 0) {
      return res.status(400).json({
        message: "Requested time slot overlaps with an existing booked slot",
      });
    }
    //Generates the new time slot
    const newTimeSlot = new TimeSlot({
      startTime: startTimeDate,
      endTime: endTimeDate,
      isBooked: true,
      status: "confirmed",
    });
    await newTimeSlot.save();
    // Creates the associated appointment
    const newAppointment = new Appointment({
      user: userId,
      phoneNumber: phoneNumber,
      addressLine1: addressLine1,
      addressLine2: addressLine2,
      zipCode: zipCode,
      package: packageId,
      timeSlot: newTimeSlot._id,
      status: "confirmed",
    });

    await newAppointment.save();

    //Saves appointment Id to timeslots model
    newTimeSlot.appointment = newAppointment._id;
    await newTimeSlot.save();

    res.status(201).json({
      message: "Time slot booked and confirmed",
      appointment: newAppointment,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error booking time slot", error: error.message });
  }
};

// Get all timeslots
exports.listTimeSlots = async (req, res) => {
  try {
    const timeSlots = await TimeSlot.find({ status: { $ne: "cancelled" } });
    res.status(200).json(timeSlots);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error fetching time slots", error: error.message });
  }
};

// List booked time slots
exports.listBookedSlots = async (req, res) => {
  try {
    const bookedSlots = await TimeSlot.find({
      isBooked: true,
      status: { $ne: "cancelled" },
    });

    res.status(200).json(bookedSlots);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching booked time slots",
      error: error.message,
    });
  }
};


// List available time slots dynamically
exports.listAvailableSlots = async (req, res) => {
    try {
        const { date } = req.query;
        const startHour = 9;
        const endHour = 17;

        const startOfDay = new Date(date);
        startOfDay.setUTCHours(startHour, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setUTCHours(endHour, 0, 0, 0);

        const bookedSlots = await TimeSlot.find({
            startTime: { $gte: startOfDay, $lt: endOfDay },
            isBooked: true
        });

        const availableSlots = [];

        for (let hour = startHour; hour < endHour; hour++) {
            const slotStartTime = new Date(startOfDay);
            slotStartTime.setUTCHours(hour, 0, 0, 0);
            const slotEndTime = new Date(slotStartTime);
            slotEndTime.setUTCHours(hour + 1, 0, 0, 0);

            const isSlotBooked = bookedSlots.some(slot => 
                slot.startTime < slotEndTime && slot.endTime > slotStartTime
            );

            if (!isSlotBooked) {
                availableSlots.push({
                    startTime: slotStartTime,
                    endTime: slotEndTime,
                    isBooked: false,
                    status: 'available'
                });
            }
        }

        res.status(200).json(availableSlots);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching available time slots', error: error.message });
    }
};

// Get Time Slot by ID

exports.getTimeSlotById = async (req, res) => {
  try {
    const timeSlot = await TimeSlot.findById(id);
    if (!timeSlot) {
      return res.status(404).json({ message: "Time Slot not found" });
    }
    res.status(200).json(timeSlot);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching time slot", error: error.message });
  }
};

// Update a time slot by ID

exports.updateTimeSlot = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTimeSlot = await TimeSlot.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedTimeSlot) {
      return res
        .status(404)
        .json({ message: "Time slot not found", error: error.message });
    }
    res.status(200).json(updatedTimeSlot);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating time slot", error: error.message });
  }
};

// Cancel an appointment
exports.cancelTimeSlot = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTimeSlot = await TimeSlot.findByIdAndUpdate(
      id,
      {
        status: "cancelled",
        isBooked: false,
      },
      { new: true }
    );
    if (!updatedTimeSlot) {
      return res.status(404).send({ message: "Time slot not found " });
    }

// Cancel the associated appointment
    const updatedAppointment = await Appointment.findOneAndUpdate(
      { timeSlot: id },
      { status: "cancelled " },
      { new: true }
    );
    res.status(200).json({
      message: "Time slot successfully cancelled",
      timeSlot: updatedTimeSlot,
      appointment: updatedAppointment,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error cancelling time slot", error: error.message });
  }
};

// Hard delete a time slot

exports.deleteTimeSlot = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTimeSlot = await TimeSlot.findByIdAndDelete(id);
    if (!deletedTimeSlot) {
      return res
        .status(404)
        .json({ message: "Time slot not found", error: error.message });
    }
    res.status(200).json({ message: "Time slot successfully deleted!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting time slot", error: error.message });
  }
};

//Delete ALL time slots from DB
exports.deleteAllSlots = async (req, res) => {
  try {
    await TimeSlot.deleteMany({});
    res.status(200).json({ message: "All time slots deleted succesfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting all time slots", error: error.message });
  }
};
