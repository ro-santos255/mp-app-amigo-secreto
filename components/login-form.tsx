"use client";

import { useActionState } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { login } from "@/app/(auth)/login/actions";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Loader, MessageCircle } from "lucide-react";

export default function LoginForm() {
  const [state, formAction, pending] = useActionState<any, FormData>(login, {
    success: null,
    message: "",
  });

  return (
    <Card className="mx-auto w-full max-w-sm p-4">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Digite seu e-mail para receber o link de login
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="joao@email.com"
                required
              ></Input>
            </div>
            {state.success === true && (
              <Alert className="text-muted-foreground">
                <MessageCircle className="h-4 w-4 !text-green-600" />
                <AlertTitle className="text-gray-50">
                  E-mail enviado!
                </AlertTitle>
                <AlertDescription>
                  Confira sua caixa de e-mail para acessar o link de login.
                </AlertDescription>
              </Alert>
            )}

            {state.success === false && (
              <Alert className="text-muted-foreground">
                <MessageCircle className="h-4 w-4 !text-red-600" />
                <AlertTitle className="text-gray-50">
                  Erro!
                </AlertTitle>
                <AlertDescription>
                 Ocorreu um erro ao enviar um link de login, por favor, entre em contato com o suporte!
                </AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full">
              {pending && <Loader className="animate-spin" />}  
              Login
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
