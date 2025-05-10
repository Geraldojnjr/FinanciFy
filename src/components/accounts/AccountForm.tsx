import { useState } from "react";
import { BankAccount, AccountType } from "@/types/finance";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PercentageInput } from "@/components/ui/percentage-input";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useFinance } from "@/contexts/FinanceContext";

interface AccountFormProps {
  account?: BankAccount | null;
  onClose: () => void;
  onSaved: (account: BankAccount) => void;
}

const accountTypes = [
  { value: "checking", label: "Conta Corrente" },
  { value: "savings", label: "Poupança" },
  { value: "wallet", label: "Carteira" },
  { value: "investment", label: "Investimento" },
  { value: "other", label: "Outro" },
];

const accountColors = [
  "#8B5CF6", // Roxo
  "#10B981", // Verde
  "#F59E0B", // Amarelo
  "#EF4444", // Vermelho
  "#3B82F6", // Azul
  "#EC4899", // Rosa
  "#6366F1", // Índigo
  "#14B8A6", // Verde-água
  "#F97316", // Laranja
  "#9333EA", // Roxo escuro
];

export default function AccountForm({
  account,
  onClose,
  onSaved,
}: AccountFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addAccount, updateAccount } = useFinance();

  const form = useForm<Omit<BankAccount, "id">>({
    defaultValues: account
      ? {
          name: account.name,
          balance: account.balance,
          initialBalance: account.initialBalance,
          type: account.type as AccountType,
          bank: account.bank || "",
          color: account.color || accountColors[0],
          isActive: account.isActive !== false,
        }
      : {
          name: "",
          balance: 0,
          initialBalance: 0,
          type: "checking" as AccountType,
          bank: "",
          color: accountColors[0],
          isActive: true,
        },
  });

  const handleSubmit = async (data: Omit<BankAccount, "id">) => {
    try {
      setIsSubmitting(true);

      if (account) {
        const updatedAccount = await updateAccount({
          ...data,
          id: account.id
        });
        onSaved(updatedAccount);
      } else {
        const newAccount = await addAccount(data);
        onSaved(newAccount);
      }
    } catch (error) {
      toast.error("Erro ao salvar a conta. Tente novamente.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {account ? "Editar Conta" : "Nova Conta"}
        </CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Conta</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Conta Nubank" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Conta</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {accountTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bank"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Banco (opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Nubank" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="initialBalance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Saldo Inicial (R$)</FormLabel>
                  <FormControl>
                    <PercentageInput
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value || 0);
                        // Se for uma nova conta, atualiza também o saldo atual
                        if (!account) {
                          form.setValue("balance", value || 0);
                        }
                      }}
                      placeholder="0,00"
                    />
                  </FormControl>
                  <FormDescription>
                    Este é o saldo inicial da conta no momento do cadastro
                  </FormDescription>
                </FormItem>
              )}
            />

            {account && (
              <FormField
                control={form.control}
                name="balance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Saldo Atual (R$)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Ex: 1500"
                        {...field}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          field.onChange(isNaN(value) ? 0 : value);
                        }}
                        value={field.value}
                      />
                    </FormControl>
                    <FormDescription>
                      Este é o saldo atual da conta
                    </FormDescription>
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cor da Conta</FormLabel>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {accountColors.map((color) => (
                      <div
                        key={color}
                        className={`h-8 w-8 rounded-md cursor-pointer border-2 transition-all ${
                          field.value === color
                            ? "border-primary scale-110"
                            : "border-transparent hover:scale-105"
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => field.onChange(color)}
                      />
                    ))}
                  </div>
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {account ? "Atualizar Conta" : "Adicionar Conta"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
