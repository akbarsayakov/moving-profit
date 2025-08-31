import { CalculatorData } from '@/types/calculator';

const STORAGE_KEY = 'moving-profit-calculator';

interface SerializedCalculatorData extends Omit<CalculatorData, 'jobDate'> {
  jobDate: string;
}

export const getDefaultCalculatorData = (): CalculatorData => ({
  jobDate: new Date(),
  hoursWorked: 0,
  hourlyRate: 0,
  additionalCharges: [],
  movers: [],
  additionalExpenses: [],
});

export const saveCalculatorData = (data: CalculatorData): void => {
  if (typeof window === 'undefined') return;
  
  const serializedData: SerializedCalculatorData = {
    ...data,
    jobDate: data.jobDate.toISOString(),
  };
  
  const storedData = {
    lastSaved: new Date().toISOString(),
    calculatorData: serializedData,
  };
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storedData));
  } catch (error) {
    console.error('Failed to save calculator data:', error);
  }
};

export const loadCalculatorData = (): CalculatorData => {
  if (typeof window === 'undefined') return getDefaultCalculatorData();
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return getDefaultCalculatorData();
    
    const parsedData = JSON.parse(stored);
    const serializedData = parsedData.calculatorData;
    
    if (!serializedData) return getDefaultCalculatorData();
    
    // Convert jobDate from string back to Date object
    const data: CalculatorData = {
      ...serializedData,
      jobDate: new Date(serializedData.jobDate || new Date().toISOString()),
    };
    
    return data;
  } catch (error) {
    console.error('Failed to load calculator data:', error);
    return getDefaultCalculatorData();
  }
};

export const clearCalculatorData = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear calculator data:', error);
  }
};