'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Plus, Trash2, Calendar as CalendarIcon } from 'lucide-react'
import { AdditionalCharge } from '@/types/calculator'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

interface RevenueSectionProps {
  jobDate: Date
  hoursWorked: number
  hourlyRate: number
  additionalCharges: AdditionalCharge[]
  onJobDateChange: (date: Date) => void
  onHoursWorkedChange: (hours: number) => void
  onHourlyRateChange: (rate: number) => void
  onAdditionalChargesChange: (charges: AdditionalCharge[]) => void
}

export function RevenueSection({
  jobDate,
  hoursWorked,
  hourlyRate,
  additionalCharges,
  onJobDateChange,
  onHoursWorkedChange,
  onHourlyRateChange,
  onAdditionalChargesChange,
}: RevenueSectionProps) {
  const addAdditionalCharge = () => {
    const newCharge: AdditionalCharge = {
      id: Date.now().toString(),
      description: '',
      amount: 0,
    }
    onAdditionalChargesChange([...additionalCharges, newCharge])
  }

  const removeAdditionalCharge = (id: string) => {
    onAdditionalChargesChange(
      additionalCharges.filter((charge) => charge.id !== id)
    )
  }

  const updateAdditionalCharge = (
    id: string,
    field: keyof AdditionalCharge,
    value: string | number
  ) => {
    onAdditionalChargesChange(
      additionalCharges.map((charge) =>
        charge.id === id ? { ...charge, [field]: value } : charge
      )
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue</CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
        <div>
          <Label className='mb-2'>Job Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !jobDate && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className='mr-2 h-4 w-4' />
                {jobDate ? format(jobDate, 'PPP') : 'Select job date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0'>
              <Calendar
                mode='single'
                selected={jobDate}
                onSelect={(date) => date && onJobDateChange(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <Label className='mb-2' htmlFor='hoursWorked'>
              Hours Worked
            </Label>
            <Input
              id='hoursWorked'
              type='number'
              min='0'
              step='0.25'
              value={hoursWorked || ''}
              onChange={(e) =>
                onHoursWorkedChange(parseFloat(e.target.value) || 0)
              }
              placeholder='0'
            />
          </div>
          <div>
            <Label className='mb-2' htmlFor='hourlyRate'>
              Hourly Rate
            </Label>
            <Input
              id='hourlyRate'
              type='number'
              min='0'
              value={hourlyRate || ''}
              onChange={(e) =>
                onHourlyRateChange(parseFloat(e.target.value) || 0)
              }
              placeholder='0.00'
            />
          </div>
        </div>

        <div>
          <div className='flex items-center justify-between mb-3'>
            <Label>Additional Charges</Label>
            <Button
              type='button'
              variant='outline'
              size='sm'
              onClick={addAdditionalCharge}
            >
              <Plus className='h-4 w-4 mr-1' />
              Add Charge
            </Button>
          </div>

          <div className='space-y-3'>
            {additionalCharges.map((charge) => (
              <div key={charge.id} className='flex gap-2'>
                <Input
                  placeholder='Description'
                  value={charge.description}
                  onChange={(e) =>
                    updateAdditionalCharge(
                      charge.id,
                      'description',
                      e.target.value
                    )
                  }
                  className='flex-1'
                />
                <Input
                  type='number'
                  min='0'
                  step='1'
                  placeholder='0'
                  value={charge.amount || ''}
                  onChange={(e) =>
                    updateAdditionalCharge(
                      charge.id,
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
                  onClick={() => removeAdditionalCharge(charge.id)}
                >
                  <Trash2 className='h-4 w-4' />
                </Button>
              </div>
            ))}
            {additionalCharges.length === 0 && (
              <p className='text-sm text-muted-foreground'>
                No additional charges added
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
