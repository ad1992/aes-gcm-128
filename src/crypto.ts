const CRYPTO_ALGO_NAME = "AES-GCM";

export const encode = (text: string) => {
  return new TextEncoder().encode(text);
};

export const generateCryptoKey = async (extractable: boolean) => {
  const key = await window.crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 128,
    },
    extractable,
    ["encrypt", "decrypt"]
  );
  return key;
};
export const encrypt = async (text: string, cryptoKey: CryptoKey) => {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encryptedBuffer = await window.crypto.subtle.encrypt(
    {
      name: CRYPTO_ALGO_NAME,
      iv,
    },
    cryptoKey,
    encode(text)
  );

  return { encryptedBuffer, cryptoKey, iv };
};

export const deriveEncryptionKeyFromCryptoKey = async (
  cryptoKey: CryptoKey
): Promise<string | undefined> => {
  const exportedkey = await window.crypto.subtle.exportKey("jwk", cryptoKey);
  return exportedkey.k;
};
export const deriveCryptoKeyfromEncryptionKey = async (
  encryptionKey: string
) => {
  const cryptoKey = await window.crypto.subtle.importKey(
    "jwk",
    {
      alg: "A128GCM",
      ext: true,
      k: encryptionKey,
      key_ops: ["encrypt", "decrypt"],
      kty: "oct",
    },
    {
      name: "AES-GCM",
      length: 128,
    },
    false,
    ["decrypt"]
  );
  return cryptoKey;
};

export const dataToBytes = (data: string | Array<string>) => {
  const arr = Array.from(data) as unknown as ArrayBuffer;
  const bytes = new Uint8Array(arr);

  return bytes;
};

export const decrypt = async (
  encryptedData: Uint8Array,
  encryptionKey: string,
  iv: Uint8Array
) => {
  const cryptoKey = await deriveCryptoKeyfromEncryptionKey(encryptionKey);
  const decryptedBuffer = await window.crypto.subtle.decrypt(
    {
      name: CRYPTO_ALGO_NAME,
      iv,
    },
    cryptoKey,
    encryptedData
  );
  const decryptedData = new TextDecoder().decode(decryptedBuffer);
  return decryptedData;
};
