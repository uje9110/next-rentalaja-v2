import moment from "moment";

export class DateTimeHandler {
  // Helper to format with timezone offset (local time)
  static formatDate = (date: Date) => {
    console.log(moment(date).format("YYYY-MM-DDTHH:mm:ss"));

    return moment(date).format("YYYY-MM-DDTHH:mm:ss");
  };
}
