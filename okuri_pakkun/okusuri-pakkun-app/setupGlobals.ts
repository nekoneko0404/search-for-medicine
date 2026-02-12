import { TextEncoder, TextDecoder } from 'util';

if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}

if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder as any;
}

// global.fetchが未定義の場合にjest.fn()でモックする
if (typeof global.fetch === 'undefined') {
  global.fetch = jest.fn((url) => {
    if (url === '/meds_master.json') {
      const mockMedications = require('./__mocks__/meds_master.json');
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockMedications),
      });
    }
    return Promise.reject(new Error('not found'));
  }) as any;
}