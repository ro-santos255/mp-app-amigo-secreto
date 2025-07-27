'use server';
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Resend } from "resend";

export type createGroupState = {
  success: null | boolean;
  message?: string;
};
export async function createGroup(
  _previousState: createGroupState,
  formData: FormData
) {
  const supabase = await createClient();

  const { data: authUser, error: authError } = await supabase.auth.getUser();

  if (authError) {
    return {
      success: false,
      message: "Ocorreu um erro ao criar um grupo",
    };
  } 

  const names = formData.getAll('name');
  const email = formData.getAll('email');
  const groupName = formData.get('group-name');

 const { data: newGroup, error } = await supabase.from('groups').insert({
		name: groupName,
		owner_id: authUser?.user.id,
	})
	.select()
	.single();

	if (error) {
		return {
			success: false,
			message: "Ocorreu um erro ao criar um grupo. Por favor tente novamente.",
		}
	}

	const participants = names.map((name, index) => ({
		group_id: newGroup.id,
		name, 
		email: email[index],
	}))

	const { data: createParticipants, error: errorParticipants } = await supabase.from('participants').insert(participants).select();

		if (errorParticipants) {
		return {
			success: false,
			message: "Ocorreu um erro ao adicionar os participantes ao grupo. Por favor tente novamente.",
		}
	}

	const drawnParticipantes = drawGroup(createParticipants);
	const { error: errorDraw } = await supabase.from('participants').upsert(drawnParticipantes);

	if (errorDraw) {
		return {
			success: false,
			message: "Ocorreu um erro ao sortear os participantes do grupo. Por favor tente novamente.",
		}
	}

	const { error: errorResend } = await sendEmailtoParticipants(drawnParticipantes, groupName as string);

	if (errorResend) {
		return {
			success: false,
			message: errorResend,
		}
	}

	redirect(`/app/grupos/${newGroup.id}`);
}

type Participant = {
	id: string;
	group_id: string;
	name: string;
	email: string;
	assigned_to: string | null;
	created_at: string;
}

function drawGroup(participants: Participant[]) {
	// Implement the logic to draw participants here
	// This function should return the drawn participants
	// For now, we will return a placeholder

	const selectedParticipants: string[] = [];

	return participants.map((participant) => {
		const availableParticipants = participants.filter(
			(p) => p.id !== participant.id && !selectedParticipants.includes(p.id)
		);

		const assignedParticipant = availableParticipants[Math.floor(Math.random() * availableParticipants.length)]; 
		selectedParticipants.push(assignedParticipant.id);
		console.log(assignedParticipant.id);
		

		return {
			...participant,
		assigned_to: assignedParticipant.id,
		};
	})
}

async function sendEmailtoParticipants(participants: Participant[], groupName: string) {
	// Implement the logic to send emails to participants here
	// This function should return a promise that resolves when the emails are sent
	// For now, we will return a placeholder

	const resend = new Resend(process.env.RESEND_API_KEY);


	try {
		await Promise.all(participants.map(participant => {
			resend.emails.send({
				from: "send@automatium.tech",
				to: participant.email,
				subject: `Você foi adicionado ao grupo ${groupName}`,
				html: `<p>Você está participando do amigo secreto do grupo ${groupName} <br /> <br />
					O seu amigo secreto é: <strong>${participants.find(p => p.id === participant.assigned_to)?.name}</strong>! <br /></p>
				`
			})
		}))

		return { error: null };
	} catch {
		return { error: "Ocorreu um erro ao enviar os emails para os participantes. Por favor tente novamente." };
	}
}