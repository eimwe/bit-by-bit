import {
  Connection,
  PublicKey,
  Keypair,
  Transaction,
  SystemProgram,
} from "@solana/web3.js";
import {
  getOrCreateAssociatedTokenAccount,
  createMintToInstruction,
  TOKEN_PROGRAM_ID,
  MINT_SIZE,
  createInitializeMintInstruction,
} from "@solana/spl-token";
import type { DataTokenMetadata } from "@/components/solana/types";

// Шаблоны типов данных
export const DATA_TYPES = [
  {
    id: "location",
    name: "📍 Геолокация",
    description: "Ваши перемещения и посещенные места за период",
    basePrice: 0.1,
    privacy: "medium" as const,
    icon: "🗺️",
    examples: [
      "Маршруты поездок",
      "Часто посещаемые места",
      "Время в локациях",
    ],
  },
  {
    id: "purchases",
    name: "💳 История покупок",
    description: "Транзакции и покупательские предпочтения",
    basePrice: 0.05,
    privacy: "high" as const,
    icon: "🛒",
    examples: ["Категории товаров", "Средний чек", "Частота покупок"],
  },
  {
    id: "health",
    name: "💪 Фитнес данные",
    description: "Активность, пульс, сон, тренировки",
    basePrice: 0.08,
    privacy: "medium" as const,
    icon: "⌚",
    examples: ["Шаги в день", "Качество сна", "Тип активности"],
  },
  {
    id: "social",
    name: "👥 Социальная активность",
    description: "Интересы, предпочтения в соцсетях",
    basePrice: 0.03,
    privacy: "low" as const,
    icon: "📱",
    examples: ["Тематики интересов", "Время активности", "Реакции на контент"],
  },
  {
    id: "browsing",
    name: "🌐 Веб-активность",
    description: "Посещенные сайты и поисковые запросы",
    basePrice: 0.02,
    privacy: "medium" as const,
    icon: "🔍",
    examples: ["Категории сайтов", "Время просмотра", "Поисковые тренды"],
  },
];

// Создание токена данных
export const createDataToken = async (
  connection: Connection,
  payer: PublicKey,
  signTransaction: (transaction: Transaction) => Promise<Transaction>,
  metadata: Omit<
    DataTokenMetadata,
    "id" | "mint" | "created" | "totalEarnings" | "usageCount"
  >
): Promise<{ mint: PublicKey; signature: string }> => {
  try {
    console.log("Creating data token for:", metadata.name);

    // Создаем новый mint аккаунт
    const mintKeypair = Keypair.generate();
    const mint = mintKeypair.publicKey;

    // Вычисляем минимальный баланс для создания mint аккаунта
    const mintRent = await connection.getMinimumBalanceForRentExemption(
      MINT_SIZE
    );

    // Создаем транзакцию
    const transaction = new Transaction().add(
      // Создаем аккаунт для mint
      SystemProgram.createAccount({
        fromPubkey: payer,
        newAccountPubkey: mint,
        space: MINT_SIZE,
        lamports: mintRent,
        programId: TOKEN_PROGRAM_ID,
      }),
      // Инициализируем mint
      createInitializeMintInstruction(
        mint,
        0, // decimals (0 для NFT-подобных токенов)
        payer, // mint authority
        payer, // freeze authority
        TOKEN_PROGRAM_ID
      )
    );

    // Получаем последний blockhash
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = payer;

    // Подписываем транзакцию
    transaction.partialSign(mintKeypair);
    const signedTransaction = await signTransaction(transaction);

    // Отправляем транзакцию
    const signature = await connection.sendRawTransaction(
      signedTransaction.serialize()
    );
    await connection.confirmTransaction(signature);

    console.log("Data token created successfully:", {
      mint: mint.toString(),
      signature,
    });

    return { mint, signature };
  } catch (error) {
    console.error("Error creating data token:", error);
    throw error;
  }
};

// Создание токенов в ассоциированном аккаунте
export const mintDataTokens = async (
  connection: Connection,
  payer: PublicKey,
  signTransaction: (transaction: Transaction) => Promise<Transaction>,
  mint: PublicKey,
  amount: number = 1000000 // создаем много токенов для продажи
): Promise<string> => {
  try {
    // Получаем или создаем ассоциированный токен аккаунт
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      // Создаем временный keypair для функции (не используется для подписи)
      Keypair.generate(),
      mint,
      payer,
      false,
      "confirmed"
    );

    // Создаем инструкцию для минта токенов
    const mintToInstruction = createMintToInstruction(
      mint,
      tokenAccount.address,
      payer,
      amount,
      [],
      TOKEN_PROGRAM_ID
    );

    // Создаем транзакцию
    const transaction = new Transaction().add(mintToInstruction);

    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = payer;

    const signedTransaction = await signTransaction(transaction);
    const signature = await connection.sendRawTransaction(
      signedTransaction.serialize()
    );

    await connection.confirmTransaction(signature);

    return signature;
  } catch (error) {
    console.error("Error minting data tokens:", error);
    throw error;
  }
};

// Вычисление цены на основе спроса и приватности
export const calculateTokenPrice = (
  basePrice: number,
  privacy: string,
  demand: number = 1
): number => {
  const privacyMultiplier = {
    low: 1,
    medium: 1.5,
    high: 2.5,
  };

  const privacyFactor =
    privacyMultiplier[privacy as keyof typeof privacyMultiplier] || 1;
  const demandFactor = Math.max(0.5, Math.min(3, 1 + (demand - 1) * 0.1));

  return basePrice * privacyFactor * demandFactor;
};

// Генерация mock данных для демонстрации
export const generateMockDataSample = (dataType: string) => {
  const samples = {
    location: {
      totalLocations: 47,
      topAreas: ["Центр города", "Торговые центры", "Парки"],
      avgDistance: "12.3 км/день",
      peakHours: "18:00-20:00",
    },
    purchases: {
      categories: ["Продукты", "Одежда", "Электроника"],
      avgCheck: 2847,
      frequency: "3-4 раза в неделю",
      preferredTime: "Выходные",
    },
    health: {
      avgSteps: 8542,
      sleepQuality: "7.2/10",
      activeHours: "2.5 ч/день",
      heartRate: "72 уд/мин",
    },
    social: {
      interests: ["Технологии", "Спорт", "Путешествия"],
      engagement: "Высокая",
      activeTime: "Вечером",
      platform: "Instagram, YouTube",
    },
    browsing: {
      topSites: ["YouTube", "GitHub", "Medium"],
      categories: ["IT", "Образование", "Новости"],
      avgSession: "15 мин",
      devices: "Desktop (70%), Mobile (30%)",
    },
  };

  return samples[dataType as keyof typeof samples] || {};
};
