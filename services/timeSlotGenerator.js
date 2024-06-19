// timeSlotGenerator.js 

const generateTimeSlotsForWeek = (startDate) => {
    const timeSlots = [];
    const startHour = 9;
    const endHour = 17;
    const millisecondsInAnHour = 60 * 60 * 1000;

    for (let day = 0; day < 5; day++) {
        for (let hour = startHour; hour < endHour; hour++) {
            const startTime = new Date(startDate);
            startTime.setDate(startTime.getDate() + day);
            startTime.setHours(hour, 0, 0, 0);

            const endTime = new Date(startTime.getTime() + millisecondsInAnHour);

            timeSlots.push ({
                startTime, 
                endTime,
                isBooked: false,
                status: 'available'
            });
        }
    }
    return timeSlots;
}
module.exports =  generateTimeSlotsForWeek;

