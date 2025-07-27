import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
      <main className="container grid mx-auto py-12">
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl text-center">
              Amigo Secreto Digital
            </CardTitle>
            <CardDescription className="text-center text-lg">
              Organize seu amigo secreto de forma simples e divertida
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col items-center gap-6">
            <div className="text-center space-y-0.5">
              <p className="text-lg">
                Crie grupos, adicione participantes e realize o sorteio
                automaticamente
              </p>
              <p className="text-muted-foreground">
                Sem complicações, sem papéis, 100% online
              </p>
            </div>

            <div className="flex gap-4">
              <Link href="/app/grupos/novo">
                <Button size="lg" variant="default" type="button" className="cursor-pointer">
                  Criar Novo Grupo
                </Button>
              </Link>
              <Link href="/app/grupos">
                <Button size="lg" variant="outline" type="button" className="cursor-pointer">
                  Ver Meus Grupos
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
  );
}
