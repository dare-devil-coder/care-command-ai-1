import CryptoJS from "crypto-js";

const SECRET_KEY = "CARECOMMAND_SECURE_2026";

export function generateSecureQR(patientId: string) {
  const payload = {
    id: patientId,
    timestamp: Date.now(),
  };

  const encrypted = CryptoJS.AES.encrypt(
    JSON.stringify(payload),
    SECRET_KEY
  ).toString();

  return encrypted;
}

export function decryptSecureQR(token: string) {
  try {
    const bytes = CryptoJS.AES.decrypt(token, SECRET_KEY);
    const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;

    if (now - decrypted.timestamp > fiveMinutes) {
      return { expired: true };
    }

    return decrypted;
  } catch {
    return null;
  }
}
