const substitutionMap = {
    A: 'Z', B: 'Y', C: 'X', D: 'W', E: 'V',
    F: 'U', G: 'T', H: 'S', I: 'R', J: 'Q',
    K: 'P', L: 'O', M: 'N', N: 'M', O: 'L',
    P: 'K', Q: 'J', R: 'I', S: 'H', T: 'G',
    U: 'F', V: 'E', W: 'D', X: 'C', Y: 'B',
    Z: 'A',
    a: 'z', b: 'y', c: 'x', d: 'w', e: 'v',
    f: 'u', g: 't', h: 's', i: 'r', j: 'q',
    k: 'p', l: 'o', m: 'n', n: 'm', o: 'l',
    p: 'k', q: 'j', r: 'i', s: 'h', t: 'g',
    u: 'f', v: 'e', w: 'd', x: 'c', y: 'b',
    z: 'a',
    1: '9', 2: '8', 3: '7', 4: '6', 5: '5',
    6: '4', 7: '3', 8: '2', 9: '1', 0: '0'
};

export function DataEncrypt(string) {
    const receprocalData = string.split('').map(char => substitutionMap[char] || char).join('');
    const encryptData = Buffer.from(receprocalData).toString('base64');
    return encryptData;
}

export function DataDecrypt(data) {
    const buffer = Buffer.from(data, 'base64').toString('utf-8');
    const reverseSubstitutionMap = {};
    Object.entries(substitutionMap).forEach(([key, value]) => {
        reverseSubstitutionMap[value] = key;
    });

    const decryptedKey = buffer.split('').map(char => reverseSubstitutionMap[char] || char).join('');
    const decryptString = decryptedKey.replace(/'/g, '"');
    const decryptedObject = JSON.parse(decryptString);

    return decryptedObject;
}