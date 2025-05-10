import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const defaultColors = [
  '#F44336', // Vermelho
  '#E91E63', // Rosa
  '#9C27B0', // Roxo
  '#673AB7', // Roxo Escuro
  '#3F51B5', // Índigo
  '#2196F3', // Azul
  '#03A9F4', // Azul Claro
  '#00BCD4', // Ciano
  '#009688', // Verde Azulado
  '#4CAF50', // Verde
  '#8BC34A', // Verde Claro
  '#CDDC39', // Lima
  '#FFEB3B', // Amarelo
  '#FFC107', // Âmbar
  '#FF9800', // Laranja
  '#FF5722', // Laranja Escuro
  '#795548', // Marrom
  '#607D8B', // Azul Cinza
  '#9E9E9E', // Cinza
  '#000000', // Preto
];

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-5 gap-2">
        {defaultColors.map((color) => (
          <button
            key={color}
            type="button"
            className={`h-8 w-8 rounded-full border-2 transition-all ${
              value === color ? 'border-primary scale-110' : 'border-transparent'
            }`}
            style={{ backgroundColor: color }}
            onClick={() => onChange(color)}
          />
        ))}
      </div>
      <div className="flex items-center gap-2">
        <Label htmlFor="custom-color">Cor personalizada:</Label>
        <Input
          id="custom-color"
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-8 p-1"
        />
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-24"
          placeholder="#000000"
        />
      </div>
    </div>
  );
} 