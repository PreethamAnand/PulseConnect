import { supabase } from "@/integrations/supabase/client";

export async function logHospitalActivity(hospitalId: string | null, activityType: string, details: Record<string, any>) {
  await supabase.from('hospital_activities').insert({
    hospital_id: hospitalId,
    activity_type: activityType,
    details,
  });
}

export async function acknowledgeDonationReceived(donorUserId: string, donationType: 'blood' | 'plasma', hospitalId: string | null) {
  // Update cooldown via RPC
  await supabase.rpc('set_donor_cooldown', { p_user_id: donorUserId, p_type: donationType });
  // Log activity for audit
  await logHospitalActivity(hospitalId, 'donation_received', { donorUserId, donationType });
}


