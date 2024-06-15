import type { Request, Response, NextFunction } from "express";
import { verifyKey } from "discord-interactions";

export function verifyDiscordInteractionSigunature(clientPublicKey: string) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const signature = req.get("X-Signature-Ed25519");
    if (!signature) {
      next(new Error("No signature"));
      return;
    }

    const timestamp = req.get("X-Signature-Timestamp");
    if (!timestamp) {
      next(new Error("No timestamp"))
      return;
    }

    const isValidRequest = await verifyKey(req.body, signature, timestamp, clientPublicKey);
    if (!isValidRequest) {
      next(new Error("Invalid request"));
      return;
    }

    next();
  }
}
