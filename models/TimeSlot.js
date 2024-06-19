//TimeSlot.js                             

const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema({
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    }, 
    isBooked: {
        type: Boolean,
        required: true,
        default: false
    },
    status: {
        type: String,
        enum: [ 'pending', 'confirmed', "available"],
        default: 'available'
    },
    appointment: { 
        type: String,
        ref: 'Appointment',
        default: null
    }
});

const TimeSlot = mongoose.model('TimeSlot', timeSlotSchema);

module.exports = TimeSlot;