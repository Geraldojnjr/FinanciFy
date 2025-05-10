import * as React from "react"
import { Input } from "./input"
import { formatPercentage, parsePercentage } from "@/utils/format"

export interface PercentageInputProps {
  value?: number
  onChange?: (value: number | undefined) => void
  placeholder?: string
  className?: string
}

const PercentageInput = React.forwardRef<HTMLInputElement, PercentageInputProps>(
  ({ value, onChange, ...props }, ref) => {
    const [localValue, setLocalValue] = React.useState('')

    React.useEffect(() => {
      if (value === undefined || value === null || value === 0) {
        setLocalValue('')
      } else {
        setLocalValue(value.toString().replace('.', ','))
      }
    }, [value])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value
      setLocalValue(inputValue)

      if (inputValue === '') {
        onChange?.(undefined)
        return
      }

      // Converte vírgula para ponto antes de validar
      const normalizedValue = inputValue.replace(',', '.')
      const numericValue = parsePercentage(normalizedValue)
      
      if (!isNaN(numericValue)) {
        onChange?.(numericValue)
      } else {
        onChange?.(undefined)
      }
    }

    return (
      <Input
        type="text"
        inputMode="decimal"
        value={localValue}
        onChange={handleChange}
        ref={ref}
        {...props}
      />
    )
  }
)

PercentageInput.displayName = "PercentageInput"

export { PercentageInput } 