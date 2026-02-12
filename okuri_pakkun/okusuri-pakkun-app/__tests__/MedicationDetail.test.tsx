import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MedicationDetail from '@/components/MedicationDetail';
import { Medication } from '@/types';

const mockMedication: Medication = {
  yj_code: "123456789012",
  brand_name: "Test Drug A",
  manufacturer: "Test Pharma",
  taste_smell: "Sweet",
  good_compatibility: ["Water", "Milk"],
  bad_compatibility: ["Juice"],
  special_notes: "None",
  source: "Test Source"
};

describe('MedicationDetail', () => {
  beforeEach(() => {
    // Reset fetch mock before each test
    (global.fetch as jest.Mock).mockClear();
  });

  test('renders basic medication info', () => {
    render(<MedicationDetail medication={mockMedication} />);
    
    expect(screen.getByRole('heading', { name: /Test Drug A/i })).toBeInTheDocument();
    expect(screen.getByText('Test Pharma')).toBeInTheDocument();
    expect(screen.getByText('Sweet')).toBeInTheDocument();
    expect(screen.getByText('Water')).toBeInTheDocument();
    expect(screen.getByText('Juice')).toBeInTheDocument();
  });

  test('fetches and displays PMDA info', async () => {
    const mockPmdaXml = `
      <drug_product>
        <description>White powder</description>
        <precautions>
          <important_warning>Do not overdose</important_warning>
          <interaction>Avoid alcohol</interaction>
        </precautions>
      </drug_product>
    `;

    // Override fetch mock for this test
    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url.includes('/pmda_mocks/')) {
        return Promise.resolve({
          ok: true,
          text: () => Promise.resolve(mockPmdaXml),
        });
      }
      return Promise.resolve({ ok: false });
    });

    render(<MedicationDetail medication={mockMedication} />);

    // Check for loading state or wait for data
    await waitFor(() => {
      expect(screen.getByText('PMDA 最新添付文書情報')).toBeInTheDocument();
      expect(screen.getByText('White powder')).toBeInTheDocument();
      expect(screen.getByText('Do not overdose')).toBeInTheDocument();
      expect(screen.getByText('Avoid alcohol')).toBeInTheDocument();
    });
  });

  test('handles PMDA fetch failure gracefully', async () => {
    // Override fetch mock to fail
    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url.includes('/pmda_mocks/')) {
        return Promise.reject(new Error("Network error"));
      }
      return Promise.resolve({ ok: false });
    });

    render(<MedicationDetail medication={mockMedication} />);

    // Should still render basic info
    expect(screen.getByRole('heading', { name: /Test Drug A/i })).toBeInTheDocument();
    
    // Should NOT show PMDA section (since it's null)
    await waitFor(() => {
      expect(screen.queryByText('PMDA 最新添付文書情報')).not.toBeInTheDocument();
    });
  });
});
