import QRCode from "qrcode";

export class QrCodeHandler {
  static async creatQrCode(qrValue: string) {
    const data = await QRCode.toDataURL(qrValue, {
      errorCorrectionLevel: "H",
    });
  }
}
