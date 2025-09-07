import QRCode from "qrcode";

export class QrCodeHandler {
  static async createQrCode(qrValue: string) {
    const data = await QRCode.toDataURL(qrValue, {
      errorCorrectionLevel: "H",
    });
    return data;
  }
}
