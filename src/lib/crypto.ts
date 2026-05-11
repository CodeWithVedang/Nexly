// Advanced Web Crypto API wrapper for ECDH + AES-GCM
export class CryptoService {
  static async generateKeyPair() {
    return await window.crypto.subtle.generateKey(
      { name: 'ECDH', namedCurve: 'P-256' },
      true,
      ['deriveKey']
    );
  }

  static async exportPublicKey(key: CryptoKey) {
    const exported = await window.crypto.subtle.exportKey('raw', key);
    return btoa(String.fromCharCode(...new Uint8Array(exported)));
  }

  static async importPublicKey(base64Key: string) {
    const binary = atob(base64Key);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return await window.crypto.subtle.importKey(
      'raw',
      bytes,
      { name: 'ECDH', namedCurve: 'P-256' },
      true,
      []
    );
  }

  static async deriveSharedKey(privateKey: CryptoKey, publicKey: CryptoKey) {
    return await window.crypto.subtle.deriveKey(
      { name: 'ECDH', public: publicKey },
      privateKey,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  static async encrypt(sharedKey: CryptoKey, text: string) {
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(text);
    const encrypted = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      sharedKey,
      encoded
    );
    
    // Combine IV and Ciphertext
    const result = new Uint8Array(iv.length + encrypted.byteLength);
    result.set(iv, 0);
    result.set(new Uint8Array(encrypted), iv.length);
    
    return btoa(String.fromCharCode(...result));
  }

  static async decrypt(sharedKey: CryptoKey, encryptedBase64: string) {
    const binary = atob(encryptedBase64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    
    const iv = bytes.slice(0, 12);
    const ciphertext = bytes.slice(12);
    
    const decrypted = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      sharedKey,
      ciphertext
    );
    
    return new TextDecoder().decode(decrypted);
  }
}