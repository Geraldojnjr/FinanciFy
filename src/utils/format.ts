import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

/**
 * Formata uma data para o formato brasileiro (dd/MM/yyyy)
 */
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, "dd/MM/yyyy", { locale: ptBR });
};

/**
 * Formata uma data para o formato brasileiro com hora (dd/MM/yyyy HH:mm)
 */
export const formatDateTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, "dd/MM/yyyy HH:mm", { locale: ptBR });
};

/**
 * Formata um valor monetário para o formato brasileiro (R$ 0,00)
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

/**
 * Formata um valor percentual para o formato brasileiro (0,00%)
 */
export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value / 100);
};

/**
 * Converte uma string de data no formato ISO para Date
 */
export const parseISODate = (dateString: string): Date => {
  return new Date(dateString);
};

/**
 * Converte um valor monetário formatado para número
 */
export const parseCurrency = (value: string): number => {
  return Number(value.replace(/[^\d,-]/g, '').replace(',', '.'));
};

/**
 * Converte um valor percentual formatado para número
 */
export const parsePercentage = (value: string): number => {
  return Number(value.replace(/[^\d,-]/g, '').replace(',', '.'));
};
