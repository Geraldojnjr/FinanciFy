import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import { createCreditCard, updateCreditCard } from '../../services/CreditCardService';

const CreditCardForm = ({ creditCard = null, onSuccess }) => {
  const [name, setName] = useState('');
  const [limitAmount, setLimitAmount] = useState('');
  const [closingDay, setClosingDay] = useState('');
  const [dueDay, setDueDay] = useState('');
  const [color, setColor] = useState('#E53E3E'); // Default to red
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    // If editing, populate form with credit card data
    if (creditCard) {
      setName(creditCard.name);
      setLimitAmount(creditCard.limit_amount.toString());
      setClosingDay(creditCard.closing_day.toString());
      setDueDay(creditCard.due_day.toString());
      setColor(creditCard.color);
    }
  }, [creditCard]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);

      // Validate closing day and due day
      const closingDayNum = parseInt(closingDay);
      const dueDayNum = parseInt(dueDay);
      
      if (closingDayNum < 1 || closingDayNum > 31) {
        toast.error('O dia de fechamento deve estar entre 1 e 31');
        return;
      }
      
      if (dueDayNum < 1 || dueDayNum > 31) {
        toast.error('O dia de vencimento deve estar entre 1 e 31');
        return;
      }

      const cardData = {
        name,
        limit_amount: parseFloat(limitAmount),
        closing_day: closingDayNum,
        due_day: dueDayNum,
        color
      };

      if (creditCard) {
        // Update existing credit card
        await updateCreditCard(creditCard.id, cardData);
        toast.success('Cartão atualizado com sucesso!');
      } else {
        // Create new credit card
        cardData.id = uuidv4();
        await createCreditCard(cardData);
        toast.success('Cartão criado com sucesso!');
      }

      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/credit-cards');
      }
    } catch (error) {
      console.error('Erro ao salvar cartão:', error);
      toast.error('Erro ao salvar cartão. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (onSuccess) {
      onSuccess();
    } else {
      navigate('/credit-cards');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">
        {creditCard ? 'Editar Cartão de Crédito' : 'Novo Cartão de Crédito'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nome do Cartão
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Ex: Nubank"
          />
        </div>
        
        <div>
          <label htmlFor="limitAmount" className="block text-sm font-medium text-gray-700">
            Limite (R$)
          </label>
          <input
            type="number"
            id="limitAmount"
            value={limitAmount}
            onChange={(e) => setLimitAmount(e.target.value)}
            required
            step="0.01"
            min="0"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="0.00"
          />
        </div>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="closingDay" className="block text-sm font-medium text-gray-700">
              Dia de Fechamento
            </label>
            <input
              type="number"
              id="closingDay"
              value={closingDay}
              onChange={(e) => setClosingDay(e.target.value)}
              required
              min="1"
              max="31"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Ex: 20"
            />
          </div>
          
          <div>
            <label htmlFor="dueDay" className="block text-sm font-medium text-gray-700">
              Dia de Vencimento
            </label>
            <input
              type="number"
              id="dueDay"
              value={dueDay}
              onChange={(e) => setDueDay(e.target.value)}
              required
              min="1"
              max="31"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Ex: 5"
            />
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
            {isLoading ? 'Salvando...' : creditCard ? 'Atualizar' : 'Criar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreditCardForm;
