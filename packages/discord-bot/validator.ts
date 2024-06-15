import type { Request } from "express";
import { verifyKey } from "discord-interactions";

export async function verify(req: Request, buf: Buffer): Promise<Boolean> {
  const signature = req.get("X-Signature-Ed25519");
  if (!signature) {
    return false;
  }

  const timestamp = req.get("X-Signature-Timestamp");
  if (!timestamp) {
    return false;
  }

  const isValidRequest = await verifyKey(
    buf,
    signature,
    timestamp,
    "e5bdebe3264718958fdc0fc10f15d124da3e4434b064a0568784db8d617f04ef",
  );
  return isValidRequest;
}
