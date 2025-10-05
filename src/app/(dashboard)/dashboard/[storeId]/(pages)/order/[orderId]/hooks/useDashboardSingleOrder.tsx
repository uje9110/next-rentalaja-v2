import moment from "moment";

export function useDashboardSingleOrder() {}

export function useDashboardSingleOrderUtility() {
  function getPaymentStatusColor(status: string) {
    switch (status) {
      case "partially-paid":
        return "rgb(234 179 8)"; // Yellow
      case "fully-paid":
        return "rgb(34 197 94)"; // Green
      default:
        return "rgb(59 130 246)"; // Blue (for any other status)
    }
  }

  function getOrderStatusColor(status: string) {
    switch (status) {
      case "confirmed":
        return "rgb(34 211 238)"; // Cyan
      case "processing":
        return "rgb(234 179 8)"; // Yellow
      case "completed":
        return "rgb(34 197 94)"; // Green
      case "canceled":
        return "rgb(217 18 18)"; // Red
      default:
        return "rgb(59 130 246)"; // Blue (fallback)
    }
  }

  function getDuration(ms: number): string {
    const duration = moment.duration(ms);

    const days = duration.days();
    const hours = duration.hours();
    const minutes = duration.minutes();

    let result = "";
    if (days > 0) result += `${days} hari `;
    if (hours > 0) result += `${hours} jam `;
    if (minutes > 0) result += `${minutes} menit`;

    return result.trim() || "0 menit"; // fallback if all are 0
  }

  const getPaymentTypeColor = (type: string) => {
    switch (type) {
      case "Uang Muka":
        return "#3167B9";
      case "partially-paid":
        return "#3167B9";
      case "partial-payment":
        return "#3167B9";
      case "Pelunasan":
        return "#4FC34F";
      case "fully-paid":
        return "#4FC34F";
      case "full-payment":
        return "#4FC34F";
      case "Denda":
        return "red";
      case "Refund":
        return "red";
      default:
        break;
    }
  };

  function getStatusColor(status: string): string {
    switch (status) {
      case "PENDING":
        return "#f5c905"; // Dark Yellow
      case "REQUIRES_ACTION":
        return "#C2410C"; // Dark Orange
      case "CANCELED":
        return "#374151"; // Gray-700
      case "SUCCEEDED":
        return "#15803D"; // Dark Green
      case "FAILED":
        return "#B91C1C"; // Dark Red
      case "VOIDED":
        return "#6B21A8"; // Dark Purple
      case "AWAITING_CAPTURE":
        return "#1D4ED8"; // Dark Blue
      case "EXPIRED":
        return "#1E293B"; // Slate-800
      case "UNKNOWN":
      case "UNKNOWN_ENUM_VALUE":
      default:
        return "#334155"; // Neutral/Dark Slate
    }
  }

  return {
    getPaymentStatusColor,
    getOrderStatusColor,
    getDuration,
    getPaymentTypeColor,
    getStatusColor,
  };
}
