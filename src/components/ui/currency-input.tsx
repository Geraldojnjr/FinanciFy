import * as React from "react";
import { Input } from "./input";
import { formatCurrency, parseCurrency } from "@/utils/format";

export interface CurrencyInputProps {
  value?: number;
  onChange?: (value: number) => void;
  placeholder?: string;
  className?: string;
}

export function CurrencyInput({
  value,
  onChange,
  placeholder = "0,00",
  className,
  ...props
}: CurrencyInputProps & React.InputHTMLAttributes<HTMLInputElement>) {
  const [displayValue, setDisplayValue] = React.useState(() => {
    return value ? formatCurrency(value) : "";
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    
    // Permite digitação livre com vírgula
    if (rawValue === "") {
      setDisplayValue("");
      onChange?.(0);
      return;
    }

    // Verifica se o valor é válido
    const isValid = /^[\d,.]*$/.test(rawValue);
    if (!isValid) return;

    // Atualiza o valor exibido
    setDisplayValue(rawValue);
    
    // Converte para número e atualiza o valor
    const numericValue = parseCurrency(rawValue);
    onChange?.(numericValue);
  };

  // Atualiza o valor exibido quando o valor prop muda
  React.useEffect(() => {
    if (value !== undefined && value !== null) {
      setDisplayValue(formatCurrency(value));
    }
  }, [value]);

  return (
    <Input
      type="text"
      inputMode="decimal"
      value={displayValue}
      onChange={handleChange}
      placeholder={placeholder}
      className={className}
      {...props}
    />
  );
}
