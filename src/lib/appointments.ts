import { supabase } from "@/integrations/supabase/client";
import { addDays } from "date-fns";

export async function createAppointment(params: {
  donorId: string;
  hospitalId: string;
  requestId?: string;
  donationType: 'blood' | 'plasma';
  appointmentDate?: string;
}) {
  const { error } = await supabase.from('appointments').insert({
    donor_id: params.donorId,
    hospital_id: params.hospitalId,
    request_id: params.requestId ?? null,
    donation_type: params.donationType,
    appointment_date: params.appointmentDate ?? new Date().toISOString(),
    status: 'pending',
  });
  if (error) throw error;
}

export async function acceptAppointment(params: { appointmentId: string; donorId: string; donationType: 'blood' | 'plasma' }) {
  // mark appointment accepted
  const { error } = await supabase.from('appointments').update({ status: 'accepted' }).eq('id', params.appointmentId);
  if (error) throw error;

  // apply 3-month cooldown
  const nextEligible = addDays(new Date(), 90);
  const { error: profErr } = await supabase.from('profiles').update({
    next_eligible_date: nextEligible.toISOString(),
    donation_type: params.donationType,
    last_donation_date: new Date().toISOString(),
  }).eq('id', params.donorId);
  if (profErr) throw profErr;
}

export async function listHospitalAppointments(hospitalId: string) {
  const { data, error } = await supabase.from('appointments').select('*').eq('hospital_id', hospitalId).order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

