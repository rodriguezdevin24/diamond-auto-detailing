// timeSlotController.js

const TimeSlot = require('../models/TimeSlot');
const generateTimeSlotsForWeek = require('../services/timeSlotGenerator');


// Create slots for a week 
exports.createWeeklyTimeSlots = async (req, res) => {
    try {
        const { startDate } = req.body;
        const timeSlots = generateTimeSlotsForWeek(new Date(startDate));
       
        await TimeSlot.insertMany(timeSlots);
        res.status(201).json({ message: 'Weekly Time Slots created succesfully' });


    } catch (error) {
        res.status(500).json({ message: "Error creating slot}", error: error.message });
    }
};

// Get all timeslots 
exports.listTimeSlots = async (req, res) => { 
    try {
        const timeSlots = await TimeSlot.find({});
        res.status(200).json(timeSlots);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching time slots', error: error.message});
    }
}

// List booked time slots 
exports.listBookedSlots = async (req, res) => {
    try {
        const bookedSlots = await TimeSlot.find({ isBooked: true });

        res.status(200).json(bookedSlots);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching booked time slots', error: error.message})
    }
}

// List available time slots 
exports.listAvailableSlots = async (req, res) => {
    try {
        const availableSlots = await TimeSlot.find({ isBooked: false});
        res.status(200).json(availableSlots);
        
    } catch (error) {

        res.status(500).json({ message: 'Error fetch available time slots', error: error.message })
    }
}

// Get Time Slot by ID 

exports.getTimeSlotById = async (req, res) => {
    try {
        const timeSlot = await TimeSlot.findById(id);
        if (!timeSlot) {
            return res.status(404).json({ message: 'Time Slot not found' });
        }
        res.status(200).json(timeSlot);
    } catch (error) {
        return res.status(500).json ({ message: "Error fetching time slot", error: error.message });
    }
}

// Update a time slot by ID

exports.updateTimeSlot = async (req, res) => {
    try { 
        const { id } = req.params;
        const updatedTimeSlot = await TimeSlot.findByIdAndUpdate(id, req.body, { new: true});
        if (!updatedTimeSlot){
            return res.status(404).json({ message: 'Time slot not found', error: error.message });
        }
        res.status(200).json(updatedTimeSlot);
    } catch (error) {
        res.status(400).json({ message: "Error updating time slot", error: error.message})
    }
}

// Delete a time slot 

exports.deleteTimeSlot = async (req, res) => {
    try { 
        const deletedTimeSlot = await TimeSlot.findByIdAndDelete(id);
        if (!deletedTimeSlot) {
            return res.status(404).json({ message: "Time slot not found", error: error.message});
        }
        res.status(200).json({ message: 'Time slot successfully deleted!'})
    } catch (error) {
        res.status(500).json({ message: 'Error deleting time slot', error: error.message})
    }
}

// Logic for booking a time slot!!!!

exports.bookTimeSlot = async (req, res) => {
    const { startTime, duration, userId, packageId } = req.body;

    try {
        const prospectiveEndTime = new Date(startTime);

        prospectiveEndTime.setHours(prospectiveEndTime.getHours() + duration);
        const overlappingSlot = await TimeSlot.findOne({ 
            $or: [
                { startTime: { $lt: prospectveEndTime }, endTime: { $gt: startTime} },
                { startTime: { $eq: startTime } }
            ], 
            isBooked: true
        });
        if (overlappingSlot) {
            return res.status(400).json({ message: "Requested time slot overlaps with an existing booked slot." });
        }

        const newTimeSlot = new TimeSlot({
            startTime,
            endTime: prospectiveEndTime, 
            isBooked: true,
            status: 'confirmed'
        });
        await newTimeSlot.save();

        // Create an associated appointment 
        const newAppointment = new Appointment({
            user: userId, 
            package: packageId,
            timeSlot: newTimeSlot._id
        });
        await newAppointment.save();

        res.status(201).json({ message: 'Time slot booked and confirmed'});
    } catch (error) {
        res.status(500).json({ message: 'Error booking time slot', error: error.message })
    }
};