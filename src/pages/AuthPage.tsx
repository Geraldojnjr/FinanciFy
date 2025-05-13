
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useDatabase } from '@/contexts/DatabaseContext';
import { getSupabaseClient } from '@/lib/databaseConfig';
import Logo from '@/components/Logo';
import { useIsMobile } from '@/hooks/use-mobile';

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { config } = useDatabase();
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const client = getSupabaseClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await client.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data?.userId) {
        // Redirect to home page after successful login
        window.location.href = '/';
      } else {
        throw new Error('Erro ao fazer login');
      }
    } catch (err) {
      console.error('Erro ao realizar login:', err);
      setError(err instanceof Error ? err.message : 'Erro ao fazer login');
      toast.error(err instanceof Error ? err.message : 'Email ou senha inválidos');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !name) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }
    
    setIsLoading(true);
    
    try {      
      const { data, error } = await client.auth.signUp({
        email,
        password,
        name
      });
      
      if (error) throw error;
      
      if (data?.userId) {
        toast.success(data.message || "Registro realizado com sucesso!");
        navigate('/');
      } else {
        throw new Error("Falha ao registrar usuário");
      }
    } catch (error: any) {
      console.error("Erro ao registrar usuário:", error);
      toast.error(error.message || "Falha ao registrar. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-secondary/30">
      <div className={`w-full ${isMobile ? 'px-4' : 'max-w-md p-4'} animate-fade-in`}>
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="flex justify-center items-center mb-4">
            <Logo showText={true} className="scale-125" />
          </div>
          <p className="text-muted-foreground mt-2">Gerencie suas finanças de forma simples e eficiente</p>
        </div>
        
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Registro</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card className="border-2 shadow-lg hover:shadow-xl transition-all">
              <CardHeader className={isMobile ? "px-4 py-3" : ""}>
                <CardTitle>Login</CardTitle>
                <CardDescription>
                  Entre com seu email e senha para acessar sua conta<br />
                  Versão demo? email: teste@teste senha: teste
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleLogin}>
                <CardContent className={`space-y-4 ${isMobile ? "px-4 py-3" : ""}`}>
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input 
                      id="login-email" 
                      type="email" 
                      value={email} 
                      onChange={e => setEmail(e.target.value)} 
                      placeholder="seu@email.com" 
                      className="bg-background/50"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Senha</Label>
                    <Input 
                      id="login-password" 
                      type="password" 
                      value={password} 
                      onChange={e => setPassword(e.target.value)} 
                      className="bg-background/50"
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter className={isMobile ? "px-4 py-3" : ""}>
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 transition-colors" 
                    type="submit" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Entrando..." : "Entrar"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          
          <TabsContent value="register">
            <Card className="border-2 shadow-lg hover:shadow-xl transition-all">
              <CardHeader className={isMobile ? "px-4 py-3" : ""}>
                <CardTitle>Criar uma conta</CardTitle>
                <CardDescription>
                  Registre-se para começar a gerenciar suas finanças
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleRegister}>
                <CardContent className={`space-y-4 ${isMobile ? "px-4 py-3" : ""}`}>
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Nome</Label>
                    <Input 
                      id="register-name" 
                      value={name} 
                      onChange={e => setName(e.target.value)} 
                      placeholder="Seu nome" 
                      className="bg-background/50"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input 
                      id="register-email" 
                      type="email" 
                      value={email} 
                      onChange={e => setEmail(e.target.value)} 
                      placeholder="seu@email.com" 
                      className="bg-background/50"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Senha</Label>
                    <Input 
                      id="register-password" 
                      type="password" 
                      value={password} 
                      onChange={e => setPassword(e.target.value)} 
                      className="bg-background/50"
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter className={isMobile ? "px-4 py-3" : ""}>
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 transition-colors" 
                    type="submit" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Registrando..." : "Registrar"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Database type indicator */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          Banco de Dados Atual: <span className="font-semibold">{config.type === 'supabase' ? 'Supabase' : 'MariaDB'}</span>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
