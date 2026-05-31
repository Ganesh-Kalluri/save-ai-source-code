/**
 * SaveAI - Random Unique Identifier Generator
 * 
 * Re-constructs a cryptographically-secure random string generator
 * utilizing browser window or worker crypto contexts.
 */

const SEED_CHARS = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";

export function generateRandomUid(size = 21) {
  let id = "";
  const bytes = crypto.getRandomValues(new Uint8Array(size |= 0));
  for (let i = 0; i < size; i++) {
    id += SEED_CHARS[bytes[i] & 63];
  }
  return id;
}

export function generateShortUid() {
  return `uid::${generateRandomUid(7)}`;
}
