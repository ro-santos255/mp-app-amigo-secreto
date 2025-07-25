"use client";

import { useActionState, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader, Mail, Trash2 } from "lucide-react";
import { Separator } from "@radix-ui/react-separator";
import { createGroup, createGroupState } from "@/app/app/grupos/novo/actions";
import { toast } from "sonner";

interface Participant {
  name: string;
  email: string;
}
export default function NewGroupForm({
  loggedUser,
}: {
  loggedUser: { email: string; id: string };
}) {
  const [participants, setparticipants] = useState<Participant[]>([
    { name: "", email: loggedUser.email },
  ]);

  const [groupName, setGroupName] = useState("");

  const [state, formAction, pending] = useActionState<
    createGroupState,
    FormData
  >(createGroup, {
    success: null,
    message: "",
  });

	  useEffect(() => {
		if (state.success === false) {
			toast({
				variant: "destructive",
				description: state.message || "Erro ao criar grupo",
			})
		}
	}, [state]);

  function updateParticipant(
    index: number,
    field: keyof Participant,
    value: string
  ) {
    const updateParticipants = [...participants];
    updateParticipants[index][field] = value;
    setparticipants(updateParticipants);
  }

  function removeParticipant(index: number) {
    setparticipants(participants.filter((_, i) => i !== index));
  }
  function addParticipant(index: number) {
    setparticipants(participants.concat({ name: "", email: "" }));
  }
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Novo grupo</CardTitle>
        <CardDescription>Convide seus amigos para participar</CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="group-name">Nome do grupo</Label>
            <Input
              type="text"
              id="group-name"
              name="group-name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Digite o nome do grupo"
              required
            />
          </div>
          <h2 className="!mt-12">Participantes</h2>
          {participants.map((participant, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row items-end space-y-4 md:space-y-0 md:space-x-4"
            >
              <div className="flex-grow space-y-2 w-full">
                <Label htmlFor={`name-${index}`}>Nome</Label>
                <Input
                  type="text"
                  id={`name-${index}`}
                  name="name"
                  value={participant.name}
                  onChange={(e) => {
                    updateParticipant(index, "name", e.target.value);
                  }}
                  className="w-full p-2 border rounded"
                  placeholder="Digite o nome do participante"
                  required
                />
              </div>

              <div className="flex-grow space-y-2 w-full">
                <Label htmlFor={`email-${index}`}>E-mail</Label>
                <Input
                  id={`email-${index}`}
                  type="email"
                  name="email"
                  value={participant.email}
                  onChange={(e) => {
                    updateParticipant(index, "email", e.target.value);
                  }}
                  className="read-only:text-muted-foreground"
                  placeholder="Digite o e-mail do participante"
                  readOnly={participant.email === loggedUser.email}
                  required
                />
              </div>

              <div className="min-w-9">
                {participants.length > 1 &&
                  participant.email !== loggedUser.email && (
                    <Button
                      variant={"outline"}
                      type="button"
                      size={"icon"}
                      className="text-red-500 hover:text-red-700"
                      onClick={() => removeParticipant(index)}
                    >
                      <Trash2 className="h-4 w-4"/>
                    </Button>
                  )}
              </div>
            </div>
          ))}
        </CardContent>
        <Separator className="my-4" />
        <CardFooter className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <Button
            type="button"
            variant={"outline"}
            onClick={addParticipant}
            className="w-full md:w-auto"
          >
            Adicionar amigo
          </Button>
          <Button
            type="submit"
            className="flex items-center space-x-2 w-full md:w-auto"
          >
            <Mail className="h-3 w-3" />
            {pending && <Loader className="animate-spin" />}
            Criar grupo e enviar convite
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
