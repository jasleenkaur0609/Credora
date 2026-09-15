import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
} from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;
const KEY_LENGTH = 32;

function getEncryptionKey(): Buffer {
  const keyHex = process.env.MFA_ENCRYPTION_KEY;

  if (!keyHex) {
    throw new Error(
      "MFA_ENCRYPTION_KEY is not configured.",
    );
  }

  if (!/^[0-9a-fA-F]{64}$/.test(keyHex)) {
    throw new Error(
      "MFA_ENCRYPTION_KEY must be exactly 64 hexadecimal characters.",
    );
  }

  const key = Buffer.from(keyHex, "hex");

  if (key.length !== KEY_LENGTH) {
    throw new Error(
      "MFA_ENCRYPTION_KEY must represent exactly 32 bytes.",
    );
  }

  return key;
}

/**
 * Encrypt sensitive application data using AES-256-GCM.
 *
 * Format:
 * iv:authTag:ciphertext
 *
 * All values are encoded as hexadecimal.
 */
export function encryptSecret(plaintext: string): string {
  if (!plaintext) {
    throw new Error("Cannot encrypt an empty value.");
  }

  const key = getEncryptionKey();
  const iv = randomBytes(IV_LENGTH);

  const cipher = createCipheriv(ALGORITHM, key, iv);

  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  if (authTag.length !== AUTH_TAG_LENGTH) {
    throw new Error(
      "Unexpected AES-GCM authentication tag length.",
    );
  }

  return [
    iv.toString("hex"),
    authTag.toString("hex"),
    encrypted.toString("hex"),
  ].join(":");
}

/**
 * Decrypt data encrypted by encryptSecret().
 */
export function decryptSecret(payload: string): string {
  if (!payload) {
    throw new Error("Cannot decrypt an empty value.");
  }

  const parts = payload.split(":");

  if (parts.length !== 3) {
    throw new Error("Invalid encrypted secret format.");
  }

  const [ivHex, authTagHex, ciphertextHex] = parts;

  if (
    !ivHex ||
    !authTagHex ||
    !ciphertextHex ||
    ivHex.length !== IV_LENGTH * 2 ||
    authTagHex.length !== AUTH_TAG_LENGTH * 2
  ) {
    throw new Error("Invalid encrypted secret format.");
  }

  const key = getEncryptionKey();

  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");
  const ciphertext = Buffer.from(ciphertextHex, "hex");

  const decipher = createDecipheriv(
    ALGORITHM,
    key,
    iv,
  );

  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}
