export default class DateHelper {
    static formatDateYearAndMonth(date: Date): string {
        console.log("date: ", date);
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const month = monthNames[date.getMonth()]; // getMonth() returns a zero-based value (0 for January, 1 for February, etc.)
        const year = date.getFullYear();
      
        return `${month} ${year}`;
      }
}