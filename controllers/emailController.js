const { sendEmailToOwner, sendStatusUpdateEmail, sendCancellationEmail } = require('../services/emailService ');

exports.sendNewAppointmentEmail = async (appointment) => {
    try {
        await sendEmailToOwner(appointment);
        console.log("Email sent to owner for new appointment");

    } catch (error) {
        console.error('Failed to send status update email:', error)
    }
};

exports.sendStatusUpdateEmail = async (appointment) => {
    try {
        console.log('Status update email sent');
    } catch (error) {
        console.error('Failed to send status update email', error);
    }
};

exports.sendCancellationEmail = async (appointmentId) => {
    try {
        await sendCancellationEmail(appointmentId);
        console.log('Cancellation email sent')
    } catch (error) {
        console.error('Failed to send cancellation email:', error);
    }
    
}

