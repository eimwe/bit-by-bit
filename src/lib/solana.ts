import {
  Connection,
  clusterApiUrl,
  PublicKey,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

// Подключение к devnet (тестовая сеть)
export const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

export const NETWORK = "devnet";
export const SOLANA_EXPLORER_BASE = `https://explorer.solana.com`;

// Утилиты для работы с SOL
export const lamportsToSol = (lamports: number): number => {
  return lamports / LAMPORTS_PER_SOL;
};

export const solToLamports = (sol: number): number => {
  return sol * LAMPORTS_PER_SOL;
};

// Проверка подключения к сети
export const checkConnection = async (): Promise<boolean> => {
  try {
    const version = await connection.getVersion();
    console.log("Solana cluster version:", version);
    return true;
  } catch (error) {
    console.error("Failed to connect to Solana:", error);
    return false;
  }
};

// Получение баланса аккаунта
export const getAccountBalance = async (
  publicKey: PublicKey
): Promise<number> => {
  try {
    const balance = await connection.getBalance(publicKey);
    return lamportsToSol(balance);
  } catch (error) {
    console.error("Error getting balance:", error);
    return 0;
  }
};

// Форматирование публичного ключа для отображения
export const formatPublicKey = (
  publicKey: PublicKey | null,
  chars: number = 4
): string => {
  if (!publicKey) return "";
  const key = publicKey.toString();
  return `${key.slice(0, chars)}...${key.slice(-chars)}`;
};
