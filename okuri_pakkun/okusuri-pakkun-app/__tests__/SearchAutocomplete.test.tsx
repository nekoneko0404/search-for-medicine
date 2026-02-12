import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchAutocomplete from '@/components/SearchAutocomplete';
import { Medication } from '@/types';

const mockMedications: Medication[] = [
  {
    yj_code: "123456789012",
    brand_name: "Test Drug A",
    manufacturer: "Test Pharma",
    taste_smell: "Sweet",
    good_compatibility: ["Water"],
    bad_compatibility: ["Juice"],
    special_notes: "None",
    source: "Test Source"
  },
  {
    yj_code: "987654321098",
    brand_name: "Test Drug B",
    manufacturer: "Sample Pharma",
    taste_smell: "Bitter",
    good_compatibility: ["Pudding"],
    bad_compatibility: [],
    special_notes: "Caution",
    source: "Sample Source"
  }
];

describe('SearchAutocomplete', () => {
  const mockOnSelect = jest.fn();
  const mockOnClear = jest.fn();

  beforeEach(() => {
    mockOnSelect.mockClear();
    mockOnClear.mockClear();
  });

  test('renders input field', () => {
    render(
      <SearchAutocomplete 
        medications={mockMedications} 
        onSelect={mockOnSelect} 
        onClear={mockOnClear} 
      />
    );
    expect(screen.getByPlaceholderText(/薬の名前、YJコードで検索/i)).toBeInTheDocument();
  });

  test('shows suggestions when typing', () => {
    render(
      <SearchAutocomplete 
        medications={mockMedications} 
        onSelect={mockOnSelect} 
        onClear={mockOnClear} 
      />
    );
    const input = screen.getByPlaceholderText(/薬の名前、YJコードで検索/i);
    
    fireEvent.change(input, { target: { value: 'Test' } });
    
    // Test Drug A and B should be visible
    expect(screen.getByText('Test Drug A')).toBeInTheDocument();
    expect(screen.getByText('Test Drug B')).toBeInTheDocument();
  });

  test('filters suggestions based on input', () => {
    render(
      <SearchAutocomplete 
        medications={mockMedications} 
        onSelect={mockOnSelect} 
        onClear={mockOnClear} 
      />
    );
    const input = screen.getByPlaceholderText(/薬の名前、YJコードで検索/i);
    
    fireEvent.change(input, { target: { value: 'Pharma' } }); // Matches manufacturer
    expect(screen.getByText('Test Drug A')).toBeInTheDocument();
    expect(screen.getByText('Test Drug B')).toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'Drug A' } });
    expect(screen.getByText('Test Drug A')).toBeInTheDocument();
    expect(screen.queryByText('Test Drug B')).not.toBeInTheDocument();
  });

  test('calls onSelect when a suggestion is clicked', () => {
    render(
      <SearchAutocomplete 
        medications={mockMedications} 
        onSelect={mockOnSelect} 
        onClear={mockOnClear} 
      />
    );
    const input = screen.getByPlaceholderText(/薬の名前、YJコードで検索/i);
    
    fireEvent.change(input, { target: { value: 'Drug A' } });
    fireEvent.click(screen.getByText('Test Drug A'));

    expect(mockOnSelect).toHaveBeenCalledWith(mockMedications[0]);
    expect(input).toHaveValue('Test Drug A');
  });

  test('calls onClear when input changes', () => {
    render(
      <SearchAutocomplete 
        medications={mockMedications} 
        onSelect={mockOnSelect} 
        onClear={mockOnClear} 
      />
    );
    const input = screen.getByPlaceholderText(/薬の名前、YJコードで検索/i);
    
    fireEvent.change(input, { target: { value: 'New' } });
    expect(mockOnClear).toHaveBeenCalled();
  });

  test('shows "no results" message when no match found', () => {
    render(
      <SearchAutocomplete 
        medications={mockMedications} 
        onSelect={mockOnSelect} 
        onClear={mockOnClear} 
      />
    );
    const input = screen.getByPlaceholderText(/薬の名前、YJコードで検索/i);
    
    fireEvent.change(input, { target: { value: 'NonExistent' } });
    expect(screen.getByText(/該当する薬が見つかりません/i)).toBeInTheDocument();
  });
});
