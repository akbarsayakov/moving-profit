'use client';

import { useState, useEffect } from 'react';
import { RevenueSection } from '@/components/revenue-section';
import { ExpensesSection } from '@/components/expenses-section';
import { ProfitSummaryComponent } from '@/components/profit-summary';
import { CalculatorData } from '@/types/calculator';
import { calculateProfitSummary } from '@/lib/calculations';
import { saveCalculatorData, loadCalculatorData, getDefaultCalculatorData } from '@/lib/storage';
import html2canvas from 'html2canvas';

export default function Home() {
  const [data, setData] = useState<CalculatorData>(getDefaultCalculatorData());
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadedData = loadCalculatorData();
    setData(loadedData);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveCalculatorData(data);
    }
  }, [data, isLoaded]);

  const summary = calculateProfitSummary(data);

  const handleDownload = async () => {
    const element = document.getElementById('profit-summary-card');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        backgroundColor: 'white',
        scale: 2,
        useCORS: true,
        allowTaint: false,
        logging: false,
        onclone: (clonedDoc) => {
          // Force all elements to use RGB colors instead of lab functions
          const style = clonedDoc.createElement('style');
          style.innerHTML = `
            * { 
              color: rgb(0, 0, 0) !important; 
              background-color: rgb(255, 255, 255) !important;
            }
            .text-green-600 { color: rgb(22, 163, 74) !important; }
            .text-red-600 { color: rgb(220, 38, 38) !important; }
            .text-muted-foreground { color: rgb(115, 115, 115) !important; }
            .border { border-color: rgb(229, 229, 229) !important; }
          `;
          clonedDoc.head.appendChild(style);
        }
      });
      
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `moving-profit-summary-${timestamp}.png`;
      
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
      }, 'image/png', 1.0);
    } catch (error) {
      console.error('Error generating PNG:', error);
    }
  };

  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Moving Company Profit Calculator
          </h1>
          <p className="text-muted-foreground">
            Calculate your profit after all expenses with detailed breakdown
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <RevenueSection
              jobDate={data.jobDate}
              hoursWorked={data.hoursWorked}
              hourlyRate={data.hourlyRate}
              additionalCharges={data.additionalCharges}
              onJobDateChange={(date) => setData(prev => ({ ...prev, jobDate: date }))}
              onHoursWorkedChange={(hours) => setData(prev => ({ ...prev, hoursWorked: hours }))}
              onHourlyRateChange={(rate) => setData(prev => ({ ...prev, hourlyRate: rate }))}
              onAdditionalChargesChange={(charges) => setData(prev => ({ ...prev, additionalCharges: charges }))}
            />
            
            <ExpensesSection
              movers={data.movers}
              additionalExpenses={data.additionalExpenses}
              onMoversChange={(movers) => setData(prev => ({ ...prev, movers }))}
              onAdditionalExpensesChange={(expenses) => setData(prev => ({ ...prev, additionalExpenses: expenses }))}
            />
          </div>
          
          <div>
            <ProfitSummaryComponent
              summary={summary}
              data={data}
              onDownload={handleDownload}
            />
          </div>
        </div>
      </div>
    </div>
  );
}