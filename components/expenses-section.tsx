'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Trash2 } from 'lucide-react'
import { Mover, AdditionalExpense } from '@/types/calculator'

interface ExpensesSectionProps {
  movers: Mover[]
  additionalExpenses: AdditionalExpense[]
  onMoversChange: (movers: Mover[]) => void
  onAdditionalExpensesChange: (expenses: AdditionalExpense[]) => void
}

export function ExpensesSection({
  movers,
  additionalExpenses,
  onMoversChange,
  onAdditionalExpensesChange,
}: ExpensesSectionProps) {
  const addMover = () => {
    const newMover: Mover = {
      id: Date.now().toString(),
      name: '',
      hourlyRate: 0,
    }
    onMoversChange([...movers, newMover])
  }

  const removeMover = (id: string) => {
    onMoversChange(movers.filter((mover) => mover.id !== id))
  }

  const updateMover = (
    id: string,
    field: keyof Mover,
    value: string | number
  ) => {
    onMoversChange(
      movers.map((mover) =>
        mover.id === id ? { ...mover, [field]: value } : mover
      )
    )
  }

  const addAdditionalExpense = () => {
    const newExpense: AdditionalExpense = {
      id: Date.now().toString(),
      description: '',
      amount: 0,
      isPercentage: false,
    }
    onAdditionalExpensesChange([...additionalExpenses, newExpense])
  }

  const removeAdditionalExpense = (id: string) => {
    onAdditionalExpensesChange(
      additionalExpenses.filter((expense) => expense.id !== id)
    )
  }

  const updateAdditionalExpense = (
    id: string,
    field: keyof AdditionalExpense,
    value: string | number | boolean
  ) => {
    onAdditionalExpensesChange(
      additionalExpenses.map((expense) =>
        expense.id === id ? { ...expense, [field]: value } : expense
      )
    )
  }

  const toggleExpenseType = (id: string) => {
    updateAdditionalExpense(
      id,
      'isPercentage',
      !additionalExpenses.find((e) => e.id === id)?.isPercentage
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expenses</CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
        <div>
          <div className='flex items-center justify-between mb-3'>
            <Label>Movers</Label>
            <Button
              type='button'
              variant='outline'
              size='sm'
              onClick={addMover}
            >
              <Plus className='h-4 w-4 mr-1' />
              Add Mover
            </Button>
          </div>

          <div className='space-y-3'>
            {movers.map((mover) => (
              <div key={mover.id} className='flex gap-2'>
                <Input
                  placeholder='Mover name'
                  value={mover.name}
                  onChange={(e) =>
                    updateMover(mover.id, 'name', e.target.value)
                  }
                  className='flex-1'
                />
                <Input
                  type='number'
                  min='0'
                  step='1'
                  placeholder='Hourly rate'
                  value={mover.hourlyRate || ''}
                  onChange={(e) =>
                    updateMover(
                      mover.id,
                      'hourlyRate',
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className='w-32'
                />
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => removeMover(mover.id)}
                >
                  <Trash2 className='h-4 w-4' />
                </Button>
              </div>
            ))}
            {movers.length === 0 && (
              <p className='text-sm text-muted-foreground'>No movers added</p>
            )}
          </div>
        </div>

        <div>
          <div className='flex items-center justify-between mb-3'>
            <Label>Additional Expenses</Label>
            <Button
              type='button'
              variant='outline'
              size='sm'
              onClick={addAdditionalExpense}
            >
              <Plus className='h-4 w-4 mr-1' />
              Add Expense
            </Button>
          </div>

          <div className='space-y-3'>
            {additionalExpenses.map((expense) => (
              <div key={expense.id} className='flex gap-2 items-center'>
                <Input
                  placeholder='Description'
                  value={expense.description}
                  onChange={(e) =>
                    updateAdditionalExpense(
                      expense.id,
                      'description',
                      e.target.value
                    )
                  }
                  className='flex-1'
                />
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => toggleExpenseType(expense.id)}
                  className='w-16'
                >
                  <Badge
                    variant={expense.isPercentage ? 'default' : 'secondary'}
                  >
                    {expense.isPercentage ? '%' : '$'}
                  </Badge>
                </Button>
                <Input
                  type='number'
                  min='0'
                  step={expense.isPercentage ? '0.1' : '0.01'}
                  placeholder={expense.isPercentage ? '%' : 'Amount'}
                  value={expense.amount || ''}
                  onChange={(e) =>
                    updateAdditionalExpense(
                      expense.id,
                      'amount',
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className='w-24'
                />
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => removeAdditionalExpense(expense.id)}
                >
                  <Trash2 className='h-4 w-4' />
                </Button>
              </div>
            ))}
            {additionalExpenses.length === 0 && (
              <p className='text-sm text-muted-foreground'>
                No additional expenses added
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
