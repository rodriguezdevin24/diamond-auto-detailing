//Appointment.js

const mongoose = require('mongoose');
const TimeSlot = require('./TimeSlot');

const appointmentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    package: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Package',
        required: true,
    },
    timeSlot: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TimeSlot',
        required: true,
    },
    status: {
        type: String, 
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'pending'
    },
    specialRequests: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }

});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;