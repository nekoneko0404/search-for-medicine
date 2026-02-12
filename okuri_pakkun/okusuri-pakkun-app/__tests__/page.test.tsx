import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '@/app/page';

describe('Home Page Integration', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
    
    // Default mock implementation for this suite
    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url === '/meds_master.json') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([
            {
              yj_code: "11111",
              brand_name: "Integration Drug",
              manufacturer: "Int Pharma",
              taste_smell: "Int Taste",
              good_compatibility: [],
              bad_compatibility: [],
              special_notes: "Note",
              source: "Src"
            }
          ]),
        });
      }
      if (url.includes('/pmda_mocks/')) {
        return Promise.resolve({
            ok: true,
            text: () => Promise.resolve(`
              <drug_product>
                <description>PMDA Desc</description>
              </drug_product>
            `)
        });
      }
      return Promise.resolve({ ok: false });
    });
  });

  test('full flow: search -> select -> detail', async () => {
    render(<Home />);

    // Wait for data to load and input to appear
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/薬の名前、YJコードで検索/i)).toBeInTheDocument();
    });
    
    // Search
    const input = screen.getByPlaceholderText(/薬の名前、YJコードで検索/i);
    fireEvent.change(input, { target: { value: 'Integration' } });

    // Suggestion appears
    await waitFor(() => {
      expect(screen.getByText('Integration Drug')).toBeInTheDocument();
    });

    // Select
    fireEvent.click(screen.getByText('Integration Drug'));

    // Detail appears
    await waitFor(() => {
        expect(screen.getByRole('heading', { name: /Integration Drug/i })).toBeInTheDocument();
        expect(screen.getByText('Int Pharma')).toBeInTheDocument();
    });

    // PMDA info appears (async)
    await waitFor(() => {
        expect(screen.getByText('PMDA Desc')).toBeInTheDocument();
    });
  });
});
