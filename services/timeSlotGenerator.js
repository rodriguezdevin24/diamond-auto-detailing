// timeSlotGenerator.js

const generateTimeSlotsForWeek = (startDate) => {
  const timeSlots = [];
  const startHour = 9;
  const endHour = 17;
  const millisecondsInAnHour = 60 * 60 * 1000;

  //Resets time to midnight to avoid any time zone issues 
  startDate.setUTCHours(0, 0, 0, 0);

  for (let day = 0; day < 5; day++) {
    for (let hour = startHour; hour < endHour; hour ++) {

      const startTime = new Date(startDate);
      startTime.setUTCDate(startTime.getUTCDate() + day);

      startTime.setUTCHours(hour, 0, 0, 0);
      const endTime = new Date(startTime.getTime() + millisecondsInAnHour);
      if (endTime.getUTCHours() <= endHour) {
        timeSlots.push({ 
            startTime,
            endTime,
            isBooked: false,
            status: 'available'
        });
      }
    }
}
// console.log("Generated time slots", timeSlots);
return timeSlots;
};
      
module.exports = generateTimeSlotsForWeek;