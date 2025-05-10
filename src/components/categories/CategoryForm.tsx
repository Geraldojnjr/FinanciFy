import React, { useState, useEffect } from 'react';
import { Category, CategoryType } from '@/types/finance';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { toast } from 'sonner';
import { IconPicker } from '@/components/ui/icon-picker';
import { ColorPicker } from '@/components/ui/color-picker';

interface CategoryFormData {
  name: string;
  type: CategoryType;
  icon: string;
  color: string;
}

interface CategoryFormProps {
  category?: Category;
  onClose: () => void;
  onSave: (category: Partial<Category>) => Promise<void>;
}

function CategoryForm({ category, onClose, onSave }: CategoryFormProps) {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    type: 'expense',
    icon: 'cart',
    color: '#000000',
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        type: category.type,
        icon: category.icon,
        color: category.color,
      });
    }
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
      toast.error('Não foi possível salvar a categoria');
    }
  };

  const handleFieldChange = (field: keyof CategoryFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleFieldChange('name', e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Tipo</Label>
        <Select
          value={formData.type}
          onValueChange={(value) => handleFieldChange('type', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="income">Receita</SelectItem>
            <SelectItem value="expense">Despesa</SelectItem>
            <SelectItem value="investment">Investimento</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="icon">Ícone</Label>
        <IconPicker
          value={formData.icon}
          onChange={(value) => handleFieldChange('icon', value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="color">Cor</Label>
        <ColorPicker
          value={formData.color}
          onChange={(value) => handleFieldChange('color', value)}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit">
          Salvar
        </Button>
      </div>
    </form>
  );
}

export default CategoryForm; 