import CryptoJS from 'crypto-js';

export async function recognizeAliyunOcr(
  accessKeyId: string,
  accessKeySecret: string,
  imageFile: File
): Promise<any> {
  const endpoint = 'ocr-api.cn-hangzhou.aliyuncs.com';
  const url = `https://${endpoint}/`;
  const action = 'RecognizeAdvanced';
  const version = '2021-07-07';
  
  // Read file as ArrayBuffer
  const arrayBuffer = await imageFile.arrayBuffer();
  // Convert ArrayBuffer to WordArray for CryptoJS
  const words: number[] = [];
  const u8 = new Uint8Array(arrayBuffer);
  for (let i = 0; i < u8.length; i += 4) {
    words.push(
      (u8[i] << 24) |
      ((u8[i + 1] || 0) << 16) |
      ((u8[i + 2] || 0) << 8) |
      (u8[i + 3] || 0)
    );
  }
  const payloadWordArray = CryptoJS.lib.WordArray.create(words, u8.length);
  
  // 1. Hash the payload
  const payloadHash = CryptoJS.SHA256(payloadWordArray).toString(CryptoJS.enc.Hex).toLowerCase();
  
  // 2. Prepare headers
  const date = new Date().toISOString().replace(/\.\d{3}/, ''); // YYYY-MM-DDThh:mm:ssZ
  const nonce = Math.random().toString(36).substring(2) + Date.now().toString(36);
  
  const headers: Record<string, string> = {
    'host': endpoint,
    'x-acs-action': action,
    'x-acs-version': version,
    'x-acs-date': date,
    'x-acs-signature-nonce': nonce,
    'x-acs-content-sha256': payloadHash,
    'content-type': 'application/octet-stream',
  };

  // 3. CanonicalHeaders and SignedHeaders
  const signedHeadersList = Object.keys(headers).map(k => k.toLowerCase()).sort();
  const signedHeaders = signedHeadersList.join(';');
  const canonicalHeaders = signedHeadersList.map(k => `${k}:${headers[k]}\n`).join('');

  // 4. CanonicalRequest
  const httpMethod = 'POST';
  const canonicalUri = '/';
  const canonicalQueryString = '';
  
  const canonicalRequest = [
    httpMethod,
    canonicalUri,
    canonicalQueryString,
    canonicalHeaders,
    signedHeaders,
    payloadHash
  ].join('\n');

  // 5. StringToSign
  const algorithm = 'ACS3-HMAC-SHA256';
  const canonicalRequestHash = CryptoJS.SHA256(canonicalRequest).toString(CryptoJS.enc.Hex).toLowerCase();
  const stringToSign = [
    algorithm,
    canonicalRequestHash
  ].join('\n');

  // 6. Signature
  const signature = CryptoJS.HmacSHA256(stringToSign, accessKeySecret).toString(CryptoJS.enc.Hex).toLowerCase();

  // 7. Authorization header
  const authorization = `${algorithm} Credential=${accessKeyId},SignedHeaders=${signedHeaders},Signature=${signature}`;
  
  // 8. Make request
  const fetchHeaders: Record<string, string> = {
    'x-acs-action': action,
    'x-acs-version': version,
    'x-acs-date': date,
    'x-acs-signature-nonce': nonce,
    'x-acs-content-sha256': payloadHash,
    'content-type': 'application/octet-stream',
    'Authorization': authorization,
  };
  
  // Note: We use a CORS proxy because Aliyun API does not support browser CORS directly
  const proxyUrl = `https://corsproxy.io/?url=${encodeURIComponent(url)}`;
  
  const response = await fetch(proxyUrl, {
    method: 'POST',
    headers: fetchHeaders,
    body: arrayBuffer,
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Aliyun API Error: ${response.status} ${errText}`);
  }

  return await response.json();
}
