'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Download } from 'lucide-react';
import { ProfitSummary, CalculatorData } from '@/types/calculator';
import { formatCurrency } from '@/lib/calculations';
import { format } from 'date-fns';

interface ProfitSummaryProps {
  summary: ProfitSummary;
  data: CalculatorData;
  onDownload: () => void;
}

export function ProfitSummaryComponent({ summary, data, onDownload }: ProfitSummaryProps) {
  const isPositiveProfit = summary.profit >= 0;

  return (
    <Card id="profit-summary-card" className="sticky top-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Profit Summary</CardTitle>
          <Button onClick={onDownload} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          Job Date: {format(data.jobDate, 'PPP')}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="text-lg font-semibold">REVENUE</div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Base Revenue:</span>
              <span>{formatCurrency(summary.revenueBreakdown.baseRevenue)}</span>
            </div>
            <div className="text-xs text-muted-foreground ml-4">
              ({data.hoursWorked} hours × {formatCurrency(data.hourlyRate)}/hr)
            </div>
            
            {data.additionalCharges.map((charge) => (
              <div key={charge.id} className="flex justify-between">
                <span>{charge.description}:</span>
                <span>{formatCurrency(charge.amount)}</span>
              </div>
            ))}
            
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>TOTAL REVENUE:</span>
              <span>{formatCurrency(summary.totalRevenue)}</span>
            </div>
          </div>
        </div>

        <Separator />
        <Separator />

        <div className="space-y-3">
          <div className="text-lg font-semibold">EXPENSES</div>
          <div className="space-y-2 text-sm">
            {data.movers.length > 0 && (
              <>
                <div className="font-medium">Movers:</div>
                {data.movers.map((mover) => (
                  <div key={mover.id} className="flex justify-between ml-4">
                    <span>{mover.name}:</span>
                    <span>{formatCurrency(mover.hourlyRate * data.hoursWorked)}</span>
                  </div>
                ))}
                <div className="text-xs text-muted-foreground ml-4">
                  ({data.hoursWorked} hours each)
                </div>
                <div className="flex justify-between font-medium text-blue-600 ml-4 mt-2">
                  <span>Total Salary:</span>
                  <span>{formatCurrency(summary.expenseBreakdown.moversTotal)}</span>
                </div>
              </>
            )}
            
            {data.additionalExpenses.length > 0 && (
              <>
                <div className="font-medium">Additional Expenses:</div>
                {data.additionalExpenses.map((expense) => {
                  const amount = expense.isPercentage 
                    ? (expense.amount / 100) * summary.totalRevenue
                    : expense.amount;
                  return (
                    <div key={expense.id} className="flex justify-between ml-4">
                      <span>{expense.description}:</span>
                      <span>{formatCurrency(amount)}</span>
                    </div>
                  );
                })}
              </>
            )}
            
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>TOTAL EXPENSES:</span>
              <span>{formatCurrency(summary.totalExpenses)}</span>
            </div>
          </div>
        </div>

        <Separator />
        <Separator />

        <div className="text-center">
          <div className="text-lg font-semibold mb-2">NET PROFIT</div>
          <div className={`text-3xl font-bold ${isPositiveProfit ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(summary.profit)}
          </div>
          {!isPositiveProfit && (
            <div className="text-sm text-red-600 mt-1">Loss</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}