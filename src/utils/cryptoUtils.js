// src/utils/cryptoUtils.js
import CryptoJS from 'crypto-js';

// Clave secreta de 256 bits para AES-256
const secretKey = '12345678901234567890123456789012';

// Función para cifrar
export function encryptPassword(password) {
  return CryptoJS.AES.encrypt(password, secretKey).toString();
}

// Función para descifrar
export function decryptPassword(encryptedPassword) {
  const bytes = CryptoJS.AES.decrypt(encryptedPassword, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
}
