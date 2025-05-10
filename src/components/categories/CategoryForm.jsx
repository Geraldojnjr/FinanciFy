import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import { createCategory, updateCategory } from '../../services/CategoryService';

const CategoryForm = ({ category = null, onSuccess }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('expense');
  const [icon, setIcon] = useState('🛒');
  const [color, setColor] = useState('#3B82F6');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const iconOptions = [
    '🏠', '🛒', '🚕', '🍔', '🏥', '📚', '🎮', '👕', '📱', '💼', 
    '💰', '💳', '📈', '💻', '🎓', '🎬', '🏋️', '✈️', '🚗', '⚡',
    '💧', '📞', '🏦', '🎁', '🛠️', '🧾', '🧰', '🎯', '🔔', '🔧'
  ];

  useEffect(() => {
    // If editing, populate form with category data
    if (category) {
      setName(category.name);
      setType(category.type);
      setIcon(category.icon);
      setColor(category.color);
    }
  }, [category]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);

      const categoryData = {
        name,
        type,
        icon,
        color
      };

      if (category) {
        // Update existing category
        await updateCategory(category.id, categoryData);
        toast.success('Categoria atualizada com sucesso!');
      } else {
        // Create new category
        categoryData.id = uuidv4();
        await createCategory(categoryData);
        toast.success('Categoria criada com sucesso!');
      }

      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/categories');
      }
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
      toast.error('Erro ao salvar categoria. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (onSuccess) {
      onSuccess();
    } else {
      navigate('/categories');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">
        {category ? 'Editar Categoria' : 'Nova Categoria'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nome da Categoria
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Ex: Alimentação"
          />
        </div>
        
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Tipo de Categoria
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <button
              type="button"
              onClick={() => setType('income')}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-l-md focus:outline-none ${
                type === 'income'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Receita
            </button>
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`flex-1 py-2 px-4 text-sm font-medium focus:outline-none ${
                type === 'expense'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Despesa
            </button>
            <button
              type="button"
              onClick={() => setType('investment')}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-r-md focus:outline-none ${
                type === 'investment'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Investimento
            </button>
          </div>
        </div>
        
        <div>
          <label htmlFor="icon" className="block text-sm font-medium text-gray-700">
            Ícone
          </label>
          <div className="mt-1 grid grid-cols-5 sm:grid-cols-10 gap-2">
            {iconOptions.map(option => (
              <button
                key={option}
                type="button"
                className={`h-10 w-10 flex items-center justify-center rounded-md border ${
                  icon === option ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                }`}
                onClick={() => setIcon(option)}
              >
                <span className="text-xl">{option}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <label htmlFor="color" className="block text-sm font-medium text-gray-700">
            Cor
          </label>
          <div className="mt-1 flex items-center">
            <input
              type="color"
              id="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-8 w-8 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-500">{color}</span>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-4">
          <button
            type="button"
            onClick={handleCancel}
            className="mt-3 sm:mt-0 w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isLoading ? 'Salvando...' : category ? 'Atualizar' : 'Criar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
