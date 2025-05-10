import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { investmentSchema } from '../schemas/investmentSchema';
import { z } from 'zod';

const InvestmentForm: React.FC = () => {
  const [investment, setInvestment] = useState<Investment | null>(null);

  const defaultValues = {
    name: '',
    description: '',
    amount: 0,
    initialDate: new Date().toISOString().split('T')[0],
    dueDate: new Date().toISOString().split('T')[0],
    expectedReturn: 0,
    category_id: '',
    goal_id: '',
  };

  const form = useForm<z.infer<typeof investmentSchema>>({
    resolver: zodResolver(investmentSchema),
    defaultValues: investment ? {
      name: investment.name,
      description: investment.description || '',
      amount: investment.amount,
      initialDate: investment.initial_date ? new Date(investment.initial_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      dueDate: investment.due_date ? new Date(investment.due_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      expectedReturn: investment.expected_return,
      category_id: investment.category_id?.toString() || '',
      goal_id: investment.goal_id?.toString() || '',
    } : defaultValues,
  });

  return (
    <div>
      {/* Renderização do formulário */}
    </div>
  );
};

export default InvestmentForm; 