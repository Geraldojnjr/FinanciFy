import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { fetchAccounts } from '../services/AccountService';
import { fetchTransactions } from '../services/TransactionService';
import { fetchCategories } from '../services/CategoryService';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import DashboardSummary from '../components/dashboard/DashboardSummary';

const DashboardPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [totalBalance, setTotalBalance] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);
  
  const [pieData, setPieData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [accountsData, transactionsData, categoriesData] = await Promise.all([
          fetchAccounts(),
          fetchTransactions(),
          fetchCategories()
        ]);
        
        setAccounts(accountsData);
        setTransactions(transactionsData);
        setCategories(categoriesData);
        
        // Calculate totals
        const total = accountsData.reduce((sum, account) => sum + account.balance, 0);
        setTotalBalance(total);
        
        // Get current month and year
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        
        // Filter transactions for current month
        const currentMonthTransactions = transactionsData.filter(transaction => {
          const transactionDate = new Date(transaction.date);
          return transactionDate.getMonth() === currentMonth && 
                 transactionDate.getFullYear() === currentYear;
        });
        
        // Calculate income and expenses for current month
        const income = currentMonthTransactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);
        
        const expenses = Math.abs(currentMonthTransactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0));
        
        setMonthlyIncome(income);
        setMonthlyExpenses(expenses);
        
        // Prepare data for pie chart (expenses by category)
        const expensesByCategory = {};
        currentMonthTransactions
          .filter(t => t.type === 'expense')
          .forEach(transaction => {
            const category = categoriesData.find(cat => cat.id === transaction.category_id);
            if (category) {
              const categoryName = category.name;
              if (!expensesByCategory[categoryName]) {
                expensesByCategory[categoryName] = {
                  name: categoryName, 
                  value: 0, 
                  color: category.color
                };
              }
              expensesByCategory[categoryName].value += Math.abs(transaction.amount);
            }
          });
        
        const pieChartData = Object.values(expensesByCategory).sort((a, b) => b.value - a.value);
        setPieData(pieChartData);
        
        // Prepare data for bar chart (income vs expenses by month)
        const last6Months = [];
        for (let i = 5; i >= 0; i--) {
          const month = new Date(currentYear, currentMonth - i, 1);
          const monthName = month.toLocaleString('default', { month: 'short' });
          last6Months.push({
            month: monthName,
            income: 0,
            expenses: 0
          });
        }
        
        transactionsData.forEach(transaction => {
          const transactionDate = new Date(transaction.date);
          const monthsDiff = (currentMonth + 12 - transactionDate.getMonth()) % 12;
          
          if (transactionDate.getFullYear() === currentYear && monthsDiff <= 5) {
            const index = 5 - monthsDiff;
            
            if (transaction.type === 'income') {
              last6Months[index].income += transaction.amount;
            } else if (transaction.type === 'expense') {
              last6Months[index].expenses += Math.abs(transaction.amount);
            }
          }
        });
        
        setBarData(last6Months);
        
        // Get recent transactions
        const recent = [...transactionsData]
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5);
        
        setRecentTransactions(recent);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Categoria Desconhecida';
  };

  const getAccountName = (accountId) => {
    if (!accountId) return 'N/A';
    const account = accounts.find(acc => acc.id === accountId);
    return account ? account.name : 'Conta Desconhecida';
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="spinner h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-3 text-gray-600">Carregando dados do dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      
      <DashboardSummary 
        balance={totalBalance} 
        income={monthlyIncome} 
        expenses={monthlyExpenses} 
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Expenses by Category */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Despesas por Categoria</h2>
          {pieData.length > 0 ? (
            <div className="h-64 md:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 md:h-72 flex items-center justify-center">
              <p className="text-gray-500">Nenhuma despesa registrada neste mês</p>
            </div>
          )}
        </div>
        
        {/* Income vs Expenses */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Receitas vs Despesas</h2>
          <div className="h-64 md:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} />
                <Legend />
                <Bar dataKey="income" name="Receitas" fill="#4ADE80" />
                <Bar dataKey="expenses" name="Despesas" fill="#F87171" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Recent Transactions */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Transações Recentes</h2>
        <div className="overflow-x-auto">
          {recentTransactions.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descrição
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Conta
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentTransactions.map(transaction => (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(transaction.date).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {transaction.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getCategoryName(transaction.category_id)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getAccountName(transaction.account_id)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className={`flex items-center ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.amount >= 0 ? (
                          <ArrowUpRight className="h-4 w-4 mr-1" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 mr-1" />
                        )}
                        {Math.abs(Number(transaction.amount || 0)).toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        })}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 py-4 text-center">Nenhuma transação registrada</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
