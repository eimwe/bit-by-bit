import { useState, useEffect } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { getAccountBalance, checkConnection } from "@/lib/solana";

export const useSolana = () => {
  const { publicKey, connected, wallet } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "connecting" | "connected" | "failed"
  >("connecting");

  // Проверяем подключение к Solana при загрузке
  useEffect(() => {
    const testConnection = async () => {
      setIsLoading(true);
      const isConnected = await checkConnection();
      setConnectionStatus(isConnected ? "connected" : "failed");
      setIsLoading(false);
    };

    testConnection();
  }, []);

  // Получаем баланс кошелька
  useEffect(() => {
    const fetchBalance = async () => {
      if (connected && publicKey) {
        setIsLoading(true);
        try {
          const walletBalance = await getAccountBalance(publicKey);
          setBalance(walletBalance);
        } catch (error) {
          console.error("Error fetching balance:", error);
          setBalance(0);
        }
        setIsLoading(false);
      } else {
        setBalance(0);
      }
    };

    fetchBalance();

    // Обновляем баланс каждые 10 секунд если кошелек подключен
    let interval: NodeJS.Timeout | null = null;
    if (connected && publicKey) {
      interval = setInterval(fetchBalance, 10000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [connected, publicKey, connection]);

  // Запрос airdrop для тестирования (только devnet)
  const requestAirdrop = async (): Promise<boolean> => {
    if (!publicKey || !connected) {
      console.error("Wallet not connected");
      return false;
    }

    try {
      setIsLoading(true);
      console.log("Requesting airdrop...");

      const signature = await connection.requestAirdrop(
        publicKey,
        2 * LAMPORTS_PER_SOL // 2 SOL
      );

      await connection.confirmTransaction(signature);
      console.log("Airdrop successful:", signature);

      // Обновляем баланс после airdrop
      setTimeout(async () => {
        const newBalance = await getAccountBalance(publicKey);
        setBalance(newBalance);
      }, 2000);

      return true;
    } catch (error) {
      console.error("Airdrop failed:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // Статус подключения
    connected,
    publicKey,
    wallet,
    balance,
    isLoading,
    connectionStatus,

    // Методы
    requestAirdrop,

    // Утилиты
    connection,
  };
};
