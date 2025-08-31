import { CalculatorData, ProfitSummary, AdditionalExpense } from '@/types/calculator';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export const calculatePercentageExpense = (percentage: number, totalRevenue: number): number => {
  return (percentage / 100) * totalRevenue;
};

export const calculateBaseRevenue = (hoursWorked: number, hourlyRate: number): number => {
  return hoursWorked * hourlyRate;
};

export const calculateAdditionalChargesTotal = (additionalCharges: { amount: number }[]): number => {
  return additionalCharges.reduce((sum, charge) => sum + charge.amount, 0);
};

export const calculateMoversTotal = (movers: { hourlyRate: number }[], hoursWorked: number): number => {
  return movers.reduce((sum, mover) => sum + (mover.hourlyRate * hoursWorked), 0);
};

export const calculateAdditionalExpensesTotal = (
  additionalExpenses: AdditionalExpense[], 
  totalRevenue: number
): number => {
  return additionalExpenses.reduce((sum, expense) => {
    if (expense.isPercentage) {
      return sum + calculatePercentageExpense(expense.amount, totalRevenue);
    }
    return sum + expense.amount;
  }, 0);
};

export const calculateProfitSummary = (data: CalculatorData): ProfitSummary => {
  const baseRevenue = calculateBaseRevenue(data.hoursWorked, data.hourlyRate);
  const additionalChargesTotal = calculateAdditionalChargesTotal(data.additionalCharges);
  const totalRevenue = baseRevenue + additionalChargesTotal;
  
  const moversTotal = calculateMoversTotal(data.movers, data.hoursWorked);
  const additionalExpensesTotal = calculateAdditionalExpensesTotal(data.additionalExpenses, totalRevenue);
  const totalExpenses = moversTotal + additionalExpensesTotal;
  
  const profit = totalRevenue - totalExpenses;
  
  return {
    totalRevenue,
    totalExpenses,
    profit,
    revenueBreakdown: {
      baseRevenue,
      additionalCharges: additionalChargesTotal,
    },
    expenseBreakdown: {
      moversTotal,
      additionalExpensesTotal,
    },
  };
};