import { PublicKey } from "@solana/web3.js";

export interface DataTokenMetadata {
  id: string;
  name: string;
  description: string;
  dataType: "location" | "purchases" | "health" | "social" | "browsing";
  price: number; // в SOL
  privacy: "low" | "medium" | "high";
  duration: number; // дни доступа
  owner: PublicKey;
  mint?: PublicKey; // адрес токена после создания
  created: Date;
  totalEarnings: number;
  usageCount: number;
}

export interface CompanyProfile {
  id: string;
  name: string;
  description: string;
  website: string;
  publicKey: PublicKey;
  totalSpent: number;
  dataTypes: string[];
}

export interface DataTransaction {
  id: string;
  signature: string;
  from: PublicKey;
  to: PublicKey;
  amount: number;
  dataTokenId: string;
  timestamp: Date;
  type: "purchase" | "usage" | "refund";
}
