import { useState, useEffect } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import type { DataTokenMetadata } from "@/components/solana/types";
import {
  createDataToken,
  DATA_TYPES,
  calculateTokenPrice,
} from "@/lib/data-tokens";
import { PublicKey } from "@solana/web3.js";

export const useDataTokens = () => {
  const { publicKey, signTransaction, connected } = useWallet();
  const { connection } = useConnection();

  const [userTokens, setUserTokens] = useState<DataTokenMetadata[]>([]);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [creationStatus, setCreationStatus] = useState<string>("");

  // Загружаем токены пользователя из localStorage (для демо)
  useEffect(() => {
    if (publicKey) {
      const savedTokens = localStorage.getItem(
        `user_tokens_${publicKey.toString()}`
      );
      if (savedTokens) {
        try {
          const tokens = JSON.parse(savedTokens);
          // Преобразуем строки дат и публичных ключей обратно в объекты
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const tokensWithDates = tokens.map((token: any) => ({
            ...token,
            created: new Date(token.created),
            owner: new PublicKey(token.owner),
            mint: token.mint ? new PublicKey(token.mint) : undefined,
          }));
          setUserTokens(tokensWithDates);
        } catch (error) {
          console.error("Error loading saved tokens:", error);
          // Если данные повреждены, очищаем localStorage
          localStorage.removeItem(`user_tokens_${publicKey.toString()}`);
          setUserTokens([]);
        }
      }
    }
  }, [publicKey]);

  // Сохраняем токены в localStorage
  const saveTokensToStorage = (tokens: DataTokenMetadata[]) => {
    if (publicKey) {
      localStorage.setItem(
        `user_tokens_${publicKey.toString()}`,
        JSON.stringify(tokens)
      );
    }
  };

  // Создание нового токена данных
  const createNewDataToken = async (
    dataType: string,
    customPrice?: number,
    duration: number = 30
  ): Promise<DataTokenMetadata | null> => {
    if (!publicKey || !signTransaction) {
      throw new Error("Wallet not connected");
    }

    const dataTypeInfo = DATA_TYPES.find((dt) => dt.id === dataType);
    if (!dataTypeInfo) {
      throw new Error("Invalid data type");
    }

    setIsCreating(true);
    setCreationStatus("Создаем токен данных...");

    try {
      // Создаем токен на блокчейне
      const { mint, signature } = await createDataToken(
        connection,
        publicKey,
        signTransaction,
        {
          name: dataTypeInfo.name,
          description: dataTypeInfo.description,
          dataType: dataTypeInfo.id as never,
          price:
            customPrice ||
            calculateTokenPrice(dataTypeInfo.basePrice, dataTypeInfo.privacy),
          privacy: dataTypeInfo.privacy,
          duration,
          owner: publicKey,
        }
      );

      setCreationStatus("Токен создан успешно!");

      // Создаем метаданные токена
      const newToken: DataTokenMetadata = {
        id: mint.toString(),
        name: dataTypeInfo.name,
        description: dataTypeInfo.description,
        dataType: dataTypeInfo.id as never,
        price:
          customPrice ||
          calculateTokenPrice(dataTypeInfo.basePrice, dataTypeInfo.privacy),
        privacy: dataTypeInfo.privacy,
        duration,
        owner: publicKey,
        mint,
        created: new Date(),
        totalEarnings: 0,
        usageCount: 0,
      };

      // Обновляем локальное состояние
      const updatedTokens = [...userTokens, newToken];
      setUserTokens(updatedTokens);
      saveTokensToStorage(updatedTokens);

      console.log("Data token created:", {
        mint: mint.toString(),
        signature,
        metadata: newToken,
      });

      return newToken;
    } catch (error) {
      console.error("Error creating data token:", error);
      setCreationStatus("Ошибка при создании токена");
      throw error;
    } finally {
      setIsCreating(false);
      setTimeout(() => setCreationStatus(""), 3000);
    }
  };

  // Обновление статистики токена (для демо)
  const updateTokenStats = (
    tokenId: string,
    earnings: number,
    usageIncrement: number = 1
  ) => {
    const updatedTokens = userTokens.map((token) => {
      if (token.id === tokenId) {
        return {
          ...token,
          totalEarnings: token.totalEarnings + earnings,
          usageCount: token.usageCount + usageIncrement,
        };
      }
      return token;
    });

    setUserTokens(updatedTokens);
    saveTokensToStorage(updatedTokens);
  };

  // Удаление токена (для демо)
  const deleteToken = (tokenId: string) => {
    const updatedTokens = userTokens.filter((token) => token.id !== tokenId);
    setUserTokens(updatedTokens);
    saveTokensToStorage(updatedTokens);
  };

  // Получение общей статистики
  const getStats = () => {
    const totalEarnings = userTokens.reduce(
      (sum, token) => sum + token.totalEarnings,
      0
    );
    const totalUsage = userTokens.reduce(
      (sum, token) => sum + token.usageCount,
      0
    );
    const avgPrice =
      userTokens.length > 0
        ? userTokens.reduce((sum, token) => sum + token.price, 0) /
          userTokens.length
        : 0;

    return {
      totalTokens: userTokens.length,
      totalEarnings,
      totalUsage,
      avgPrice,
    };
  };

  return {
    // Данные
    userTokens,
    dataTypes: DATA_TYPES,
    stats: getStats(),

    // Состояние
    isCreating,
    creationStatus,
    connected,

    // Методы
    createNewDataToken,
    updateTokenStats,
    deleteToken,

    // Утилиты
    calculateTokenPrice,
  };
};
