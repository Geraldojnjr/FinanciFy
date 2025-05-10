import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFinance } from "@/contexts/FinanceContext";
import { CreditCard } from "@/types/finance";
import { PercentageInput } from "@/components/ui/percentage-input";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  limit: z.number().min(0, "O limite deve ser maior que zero"),
  closingDay: z.number().int().min(1).max(31),
  dueDay: z.number().int().min(1).max(31),
  color: z.string().optional(),
});

type CreditCardFormValues = z.infer<typeof formSchema>;

interface CreditCardFormProps {
  card?: CreditCard;
  onSubmit: (data: CreditCardFormValues) => void;
  onCancel: () => void;
}

export default function CreditCardForm({
  card,
  onSubmit,
  onCancel,
}: CreditCardFormProps) {
  const { addCreditCard, updateCreditCard } = useFinance();
  
  const defaultValues: Partial<CreditCardFormValues> = {
    name: card?.name || "",
    limit: card?.limit || 0,
    closingDay: card?.closingDay || 10,
    dueDay: card?.dueDay || 15,
    color: card?.color || "#6750A4",
  };

  const form = useForm<CreditCardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleSubmit = async (data: CreditCardFormValues) => {
    // console.log('CreditCardForm - Submitting data:', data); // Para debug
    try {
      if (card) {
        await updateCreditCard(card.id, {
          name: data.name,
          limit: data.limit,
          closingDay: data.closingDay,
          dueDay: data.dueDay,
          color: data.color
        });
      } else {
        // Garantir que todos os campos obrigatórios estão presentes
        const newCard = {
          name: data.name,
          limit: data.limit,
          closingDay: data.closingDay,
          dueDay: data.dueDay,
          color: data.color || "#6750A4"
        };
        
        await addCreditCard(newCard);
      }
      await onSubmit(data);
      // console.log('CreditCardForm - Submit successful'); // Para debug
    } catch (error) {
      console.error('CreditCardForm - Submit error:', error); // Para debug
      toast.error("Erro ao salvar cartão");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Cartão</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Nubank" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="limit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Limite</FormLabel>
              <FormControl>
                <PercentageInput
                  placeholder="0,00"
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value || 0);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="closingDay"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dia de Fechamento</FormLabel>
                <FormControl>
                  <PercentageInput
                    placeholder="15"
                    value={field.value}
                    onChange={(value) => {
                      const day = value ? Math.min(31, Math.max(1, Math.floor(value))) : 1;
                      field.onChange(day);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dueDay"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dia de Vencimento</FormLabel>
                <FormControl>
                  <PercentageInput
                    placeholder="22"
                    value={field.value}
                    onChange={(value) => {
                      const day = value ? Math.min(31, Math.max(1, Math.floor(value))) : 1;
                      field.onChange(day);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cor do Cartão</FormLabel>
              <FormControl>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    className="w-12 h-10 p-1 cursor-pointer"
                    {...field}
                  />
                  <span className="text-sm">{field.value}</span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            {card ? "Atualizar" : "Adicionar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
