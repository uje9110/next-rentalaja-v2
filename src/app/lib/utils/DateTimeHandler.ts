import moment from "moment-timezone";

export class DateTimeHandler {
  // Helper to format with timezone offset (local time)
  static formatDate = (date: Date) => {
    console.log(moment(date).tz("Asia/Jakarta").format("YYYY-MM-DDTHH:mm:ss"));

    return moment(date).tz("Asia/Jakarta").format("YYYY-MM-DDTHH:mm:ss");
  };
}
