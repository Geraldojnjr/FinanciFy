import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { useFinance } from "@/contexts/FinanceContext";
import { Investment, InvestmentType, InvestmentFormProps } from "@/types/finance";
import { CurrencyInput } from "@/components/ui/currency-input";
import { PercentageInput } from "@/components/ui/percentage-input";
import { toast } from "react-hot-toast";
import { investmentTypes } from "@/utils/investment";
import { v4 as uuidv4 } from 'uuid';
import { formatDate, formatCurrency, formatPercentage } from "@/utils/format";

// Função para gerar IDs únicos
const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const formSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  type: z.string().min(1, "Tipo é obrigatório"),
  amount: z.number().min(0.01, "Valor deve ser maior que zero"),
  initialDate: z.date(),
  dueDate: z.date().optional(),
  expectedReturn: z.number().optional(),
  currentReturn: z.number().optional(),
  categoryId: z.string().optional(),
  goalId: z.string().optional(),
  notes: z.string().optional(),
});

type InvestmentFormValues = z.infer<typeof formSchema>;

export type { InvestmentFormValues };

export function InvestmentForm({ investment, onSubmit, onCancel }: InvestmentFormProps) {
  const { addInvestment, updateInvestment, categories, goals } = useFinance();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set default values based on existing investment or defaults
  const defaultValues: InvestmentFormValues = {
    name: investment?.name || "",
    type: investment?.type || "cdb",
    amount: investment?.amount || 0,
    initialDate: investment?.initialDate ? new Date(investment.initialDate) : new Date(),
    dueDate: investment?.dueDate ? new Date(investment.dueDate) : undefined,
    expectedReturn: investment?.expectedReturn || 0,
    currentReturn: investment?.currentReturn || 0,
    categoryId: investment?.categoryId || categories.find(c => c.type === 'investment')?.id || "",
    goalId: investment?.goalId || undefined,
    notes: investment?.notes || "",
  };

  const form = useForm<InvestmentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleFormSubmit = async (values: InvestmentFormValues) => {
    if (isSubmitting) {
      // console.log('Formulário já está sendo submetido, ignorando...');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const investmentData = {
        id: investment?.id || uuidv4(),
        name: values.name,
        type: values.type as InvestmentType,
        amount: values.amount,
        initialDate: values.initialDate ? values.initialDate.toISOString().split('T')[0] : null,
        dueDate: values.dueDate ? values.dueDate.toISOString().split('T')[0] : null,
        expectedReturn: values.expectedReturn || 0,
        currentReturn: values.currentReturn || 0,
        categoryId: values.categoryId,
        goalId: values.goalId === 'none' ? null : values.goalId,
        notes: values.notes || "",
        active: true,
        created_at: investment?.created_at || new Date().toISOString().split('T')[0],
        updated_at: new Date().toISOString().split('T')[0],
      };

      // console.log('Dados do investimento:', investmentData);

      if (!investmentData.initialDate) {
        throw new Error("Data inicial é obrigatória");
      }

      if (investment?.id) {
        await updateInvestment(investmentData as any);
        toast.success('Investimento atualizado com sucesso');
      } else {
        await addInvestment(investmentData as any);
        toast.success('Investimento criado com sucesso');
      }

      onSubmit(values);
    } catch (error) {
      console.error('Erro ao salvar investimento:', error);
      toast.error('Não foi possível salvar o investimento');
    } finally {
      setIsSubmitting(false);
    }
  };

  const investmentCategories = categories.filter(cat => cat.type === 'investment');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Tesouro IPCA+ 2026" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {investmentTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor Investido</FormLabel>
                <FormControl>
                  <PercentageInput
                    placeholder="R$ 0,00"
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="initialDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data Inicial</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          formatDate(field.value)
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Vencimento (Opcional)</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          formatDate(field.value)
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => 
                        date < (form.getValues("initialDate") || new Date())
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Data de vencimento do investimento (se aplicável)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="expectedReturn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Retorno Esperado (%)</FormLabel>
                <FormControl>
                  <PercentageInput
                    placeholder="10.5"
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormDescription>
                  Taxa esperada de retorno anual
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="currentReturn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Retorno Atual (%)</FormLabel>
                <FormControl>
                  <PercentageInput
                    placeholder="8.2"
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormDescription>
                  Rentabilidade atual do investimento
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {investmentCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="goalId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meta (Opcional)</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Associar a uma meta" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">Nenhuma</SelectItem>
                    {goals.map((goal) => (
                      <SelectItem key={goal.id} value={goal.id}>
                        {goal.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Meta financeira associada a este investimento
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Detalhes adicionais sobre o investimento..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : (investment ? "Atualizar Investimento" : "Adicionar Investimento")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
