import crypto, { createHash } from 'node:crypto';

//TODO: ENCAPSULATE THIS LOGIC IN A FACTORY 

export const uuidToCodeMap = Object.create({
  "308b": "ef799dbf-05ea-411f-94aa-e5a922eff9aa"
});

// generate 4 digits code 
function hashUUID(uuid: string) {
  const hash = createHash('sha256').update(uuid).digest('hex');
  return hash.substring(0, 4);
}

// genreate the mapping between tje uuid and the 4 digits 
export function generateMapping(uuid: string) {
  const code = hashUUID(uuid);

  uuidToCodeMap[code] = uuid as string;
  return { uuid, code };
}


export function getUUIDFromCode(code: string) {

  for (const key in uuidToCodeMap) {
    if (key === code) {
      return uuidToCodeMap[key];
    }
  }
  return null; // Code not found
}


// OTHER METHOD
/**
 * import * as crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { Random } from 'crypto-js';

interface Mapping {
  [key: string]: string;
}

function generateUuidCodeMapping(length: number = 4): Mapping {
  // Generate a UUID
  const uuidObj = uuidv4();
  
  // Convert UUID to string and extract last 4 characters
  const uuidStr = uuidObj.toString();
  const uuidSub = uuidStr.slice(-length);
  
  // Generate a code of specified length
  const code = generateRandomAlphanumericCode(length);
  
  return {
    [code]: uuidSub,
    [uuidSub]: code
  };
}

function generateRandomAlphanumericCode(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Random.array(length).map(() => characters[Math.floor(Math.random() * characters.length)]).join('');
}

function lookupUuidByCode(mapping: Mapping, code: string): string | undefined {
  return mapping[code];
}

function lookupCodeByUuid(mapping: Mapping, uuidSub: string): string | undefined {
  return mapping[uuidSub];
}

// Example usage
const mapping = generateUuidCodeMapping(6); // Now generates 6-digit codes

console.log(`UUID for code '${mapping['code']}' is: ${lookupUuidByCode(mapping, mapping['code'])}`);

// Lookup by UUID
const uuidSub = "123456abcd";
const foundCode = lookupCodeByUuid(mapping, uuidSub);
console.log(`Code corresponding to UUID '${uuidSub}' is: ${foundCode}`);

 */