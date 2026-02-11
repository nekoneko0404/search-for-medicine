const mockMedications = require('./meds_master.json'); // モックデータを読み込み

const mockFetch = jest.fn((url) => {
  console.log('Mock fetch called with URL:', url); // デバッグログ
  if (url === '/meds_master.json') {
    console.log('Returning mock medications:', mockMedications); // デバッグログ
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockMedications),
    });
  }
  console.log('Mock fetch returning not found for URL:', url); // デバッグログ
  return Promise.reject(new Error('not found'));
});

module.exports = mockFetch;