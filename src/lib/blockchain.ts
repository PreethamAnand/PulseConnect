import { recordDonationOnPolygon, DonationRecord } from "@/integrations/blockchain/polygon";
import { supabase } from "@/integrations/supabase/client";

export async function verifyDonationOnChain(
  record: DonationRecord,
  {
    rpcUrl,
    privateKey,
  }: { rpcUrl: string; privateKey: string }
): Promise<string> {
  const txHash = await recordDonationOnPolygon(rpcUrl, privateKey, record);
  await supabase.from("blockchain_ledger").insert({
    donor_id: record.donorId,
    hospital_id: record.hospitalId,
    donation_type: record.donationType,
    tx_hash: txHash,
    network: "polygon",
    status: record.status || "recorded",
  });
  return txHash;
}


