import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateTokenDialog } from "@/components/user/create-token-dialog";
import { UserTokensList } from "@/components/user/tokens-list";
import { SolanaStatus } from "@/components/solana/solana-status";
import { WalletConnection } from "@/components/solana/wallet-button";
import { useWallet } from "@solana/wallet-adapter-react";
import { useSolana } from "@/hooks/use-solana";
import { useDataTokens } from "@/hooks/use-data-tokens";

export const UserDashboard: React.FC = () => {
  const { connected } = useWallet();
  const { balance } = useSolana();
  const { creationStatus } = useDataTokens();

  if (!connected) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Панель пользователя</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Создавайте токены из своих данных и получайте доходы от их
            использования
          </p>
        </div>

        <SolanaStatus />

        <div className="flex justify-center">
          <WalletConnection />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Панель пользователя</h1>
          <p className="text-muted-foreground">
            Управляйте своими токенами данных и отслеживайте доходы
          </p>
        </div>
        <CreateTokenDialog />
      </div>

      {/* Статус подключения */}
      <SolanaStatus />

      {/* Уведомления */}
      {creationStatus && (
        <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-700 dark:text-green-300">
                {creationStatus}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Баланс и быстрые действия */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>💰 Ваш баланс</CardTitle>
            <CardDescription>Текущий баланс кошелька</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono">
              {balance.toFixed(4)} SOL
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {balance < 0.1
                ? "⚠️ Низкий баланс. Получите SOL на faucet.solana.com"
                : "✅ Достаточно для создания токенов"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🎯 Быстрый старт</CardTitle>
            <CardDescription>Создайте первый токен</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span>Кошелек подключен</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`h-2 w-2 rounded-full ${
                    balance > 0.01 ? "bg-green-500" : "bg-yellow-500"
                  }`}
                ></div>
                <span>SOL для комиссий</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-gray-300 rounded-full"></div>
                <span>Создать токен данных</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Список токенов */}
      <UserTokensList />
    </div>
  );
};
