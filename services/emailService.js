const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USERNAME,
        pass: process.env.GMAIL_PASSWORD
    }
});


const sendEmailToOwner = async (appointment) => {
    const mailOptions = {
        from: process.env.GMAIL_USERNAME,
        to: 'owner@example.com',
        subject: "New Appointment Booking",
        html: `<h1>New Appointment Details</h1>
        <p><strong>User:</strong>${appointment.user.name}</p>
        <p><strong>Package:</strong>${appointment.package.name}</p>
        <p><strong>Date:</strong> ${appointment.timeSlot.startTime.toDateString()}</p>
        <p><strong>Time:</strong> ${appointment.timeSlot.startTime.toLocaleTimeString()} - ${appointment.timeSlot.endTime.toLocaleTimeString()} </p> 
        <p><strong>Status:</strong> ${appointment.status}</p>  
        <a href="http://localhost:3200/appointments/${appontment._id}/confirm">Confirm Appointment</a>        
        <a href="http://localhost:3200/appointments/${appontment._id}/cancel">Cancel Appointment</a> `        
    };
    const info = await transporter.sendMail(mailOptions);
    console.log('message sent: %s', info.messageId);
};


module.exports = {
    sendEmailToOwner
};