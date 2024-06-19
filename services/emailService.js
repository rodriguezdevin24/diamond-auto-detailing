const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USERNAME,
        pass: process.env.GMAIL_PASSWORD
    }
});


//Function to send different types of emails
exports.sendEmail = async (emailType, appointment) => {
    let subject, htmlContent;

    switch (emailType) {
        case 'newAppointment':
            subject = "New Appointment Booked";
            htmlContent = `
            <h1> Appointment Confirmation</h1>
            <p> Your appointment on ${appointment.date} at ${appointment.time} has been successfully booked. </p>
            `;
            break; 
            case 'statusUpdate':
                subject = "Appointment Status Updated";
                htmlContent = `
                <h1> Appointment Status Change</h1>
                <p> Your appointment status has been updated to ${appointment.status}</p>
                `;
                break;
                case 'cancellation':
                    subject = 'Appointment Cancelled';
                    htmlContent = `
                    <h1> Appointment Cancellation</h1>
                    <p> Your appointment on ${appointment.date} has been cancelled. </p>
                    `;
                    break;
                    default: 
                    throw new Error('Invalid email type provided')
    }
    const mailOptions = {
        from: process.env.GMAIL_USERNAME,
        to: appointment.customerEmail,//This might be the wrong variable
        subject: subject,
        html: htmlContent     
    };
    
    try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");
    } catch (error) {
        console.error('Error sending email:', error);
    }
};


// const sendEmailToOwner = async (appointment) => {
    

