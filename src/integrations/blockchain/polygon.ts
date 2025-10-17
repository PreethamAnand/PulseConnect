import { ethers } from "ethers";

export interface DonationRecord {
  donorId: string | null;
  hospitalId: string | null;
  donationType: "blood" | "plasma";
  status: string;
}

// Minimal interface: we will emit a transaction with encoded data to a burn address
// In production, deploy a proper contract and call its method. For demo/testing,
// use a data-only transaction whose hash serves as immutable reference.

export async function recordDonationOnPolygon(
  providerRpcUrl: string,
  privateKey: string,
  record: DonationRecord
): Promise<string> {
  const provider = new ethers.JsonRpcProvider(providerRpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);

  const payload = ethers.toUtf8Bytes(
    JSON.stringify({
      donor_id: record.donorId,
      hospital_id: record.hospitalId,
      donation_type: record.donationType,
      timestamp: new Date().toISOString(),
      status: record.status,
    })
  );

  const tx = await wallet.sendTransaction({
    to: ethers.ZeroAddress, // data-only tx
    value: 0n,
    data: payload as unknown as `0x${string}`,
  });

  const receipt = await tx.wait();
  return receipt?.hash ?? tx.hash;
}


