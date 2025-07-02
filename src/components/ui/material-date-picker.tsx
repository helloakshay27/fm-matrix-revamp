
import * as React from "react"
import { format, parse } from "date-fns"
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface MaterialDatePickerProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function MaterialDatePicker({ 
  value, 
  onChange, 
  placeholder = "Select date", 
  className,
  disabled = false 
}: MaterialDatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(
    value ? parse(value, 'yyyy-MM-dd', new Date()) : null
  )
  const [currentMonth, setCurrentMonth] = React.useState(
    selectedDate || new Date()
  )

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const handleDateSelect = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    setSelectedDate(newDate)
  }

  const handleCancel = () => {
    setIsOpen(false)
  }

  const handleOk = () => {
    if (selectedDate && onChange) {
      onChange(format(selectedDate, 'yyyy-MM-dd'))
    }
    setIsOpen(false)
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev)
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1)
      } else {
        newMonth.setMonth(prev.getMonth() + 1)
      }
      return newMonth
    })
  }

  const displayValue = selectedDate ? format(selectedDate, 'dd/MM/yyyy') : ''

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal bg-white border-gray-300",
            !selectedDate && "text-muted-foreground",
            className
          )}
          disabled={disabled}
          onClick={() => setIsOpen(true)}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {displayValue || placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-white shadow-lg" align="start">
        <div className="p-4 bg-white rounded-lg">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth('prev')}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </span>
              <ChevronRight className="h-3 w-3 text-gray-400" />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth('next')}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Days of week */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
              <div key={index} className="h-8 flex items-center justify-center text-xs text-gray-500 font-medium">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {/* Empty cells for days before month starts */}
            {Array.from({ length: firstDayOfMonth }, (_, i) => (
              <div key={`empty-${i}`} className="h-8" />
            ))}
            
            {/* Days of the month */}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1
              const isSelected = selectedDate && 
                selectedDate.getDate() === day &&
                selectedDate.getMonth() === currentMonth.getMonth() &&
                selectedDate.getFullYear() === currentMonth.getFullYear()

              return (
                <button
                  key={day}
                  onClick={() => handleDateSelect(day)}
                  className={cn(
                    "h-8 w-8 text-sm flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors",
                    isSelected && "bg-[#C72030] text-white hover:bg-[#C72030]"
                  )}
                >
                  {day}
                </button>
              )
            })}
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-2 pt-2 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="text-[#C72030] hover:bg-gray-100"
            >
              CANCEL
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleOk}
              className="text-[#C72030] hover:bg-gray-100"
            >
              OK
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
