// src/utils/imageUtils.js

/**
 * Convierte un archivo de imagen a una cadena en formato Base64.
 * @param {File} file - El archivo de imagen a convertir.
 * @returns {Promise<string>} - Una promesa que se resuelve con la cadena en formato Base64.
 */
export function encodeImageToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }
  
  /**
   * Convierte una cadena en formato Base64 a un archivo de imagen.
   * @param {string} base64 - La cadena en formato Base64 de la imagen.
   * @param {string} fileName - El nombre del archivo que deseas asignar.
   * @returns {File} - Un objeto File que representa el archivo de imagen.
   */
  export function decodeBase64ToImage(base64, fileName = 'image.png') {
    // Extrae el tipo de archivo de la cadena Base64 (ej., "image/png")
    const mimeType = base64.match(/^data:(.+);base64,/)?.[1];
    const byteString = atob(base64.split(',')[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);
  
    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }
  
    return new File([uint8Array], fileName, { type: mimeType });
  }
  