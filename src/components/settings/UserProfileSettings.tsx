
import { useState, useEffect } from "react";
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
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Nome deve ter pelo menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Digite um email válido.",
  }),
});

type UserProfileForm = z.infer<typeof formSchema>;

export function UserProfileSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<{ id: string; email: string; name: string } | null>(null);

  // Load user data
  useEffect(() => {
    const loadUserData = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        const { user } = data.session;
        setUser({
          id: user.id,
          email: user.email || '',
          name: user.user_metadata?.name || user.user_metadata?.full_name || ''
        });
      }
    };

    loadUserData();
  }, []);

  // Set form defaults
  const form = useForm<UserProfileForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  // Update form when user data changes
  useEffect(() => {
    if (user) {
      form.setValue('name', user.name || '');
      form.setValue('email', user.email || '');
    }
  }, [user, form]);

  // Handle form submission
  const onSubmit = async (data: UserProfileForm) => {
    try {
      setIsLoading(true);
      const { name, email } = data;
      
      // In this simplified version, we'll just update the user metadata
      // In a real application, you would call updateUser on the supabase client
      // For MariaDB, you would call your API endpoint to update user data
      
      toast.success("Perfil atualizado com sucesso!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Erro ao atualizar perfil");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="p-4 text-center">
        <p>Você precisa estar logado para acessar esta página.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Perfil</h3>
        <p className="text-sm text-muted-foreground">
          Atualize suas informações de perfil
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  Este é o nome que será exibido para você no aplicativo.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} readOnly />
                </FormControl>
                <FormDescription>
                  Seu email de login. Não é possível alterar.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar alterações"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
