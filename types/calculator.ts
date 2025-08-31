export interface AdditionalCharge {
  id: string;
  description: string;
  amount: number;
}

export interface Mover {
  id: string;
  name: string;
  hourlyRate: number;
}

export interface AdditionalExpense {
  id: string;
  description: string;
  amount: number;
  isPercentage: boolean; // true for percentage of total revenue, false for fixed amount
}

export interface CalculatorData {
  // Revenue Section
  jobDate: Date;
  hoursWorked: number;
  hourlyRate: number;
  additionalCharges: AdditionalCharge[];
  
  // Expenses Section
  movers: Mover[];
  additionalExpenses: AdditionalExpense[];
}

export interface ProfitSummary {
  totalRevenue: number;
  totalExpenses: number;
  profit: number;
  revenueBreakdown: {
    baseRevenue: number; // hoursWorked × hourlyRate
    additionalCharges: number;
  };
  expenseBreakdown: {
    moversTotal: number;
    additionalExpensesTotal: number;
  };
}

export interface StoredData {
  lastSaved: string;
  calculatorData: CalculatorData;
}