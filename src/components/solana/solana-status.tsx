import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSolana } from "@/hooks/use-solana";
import { formatPublicKey } from "@/lib/solana";
import { Loader2, Wallet, Coins } from "lucide-react";

export const SolanaStatus: React.FC = () => {
  const {
    connected,
    publicKey,
    balance,
    isLoading,
    connectionStatus,
    requestAirdrop,
  } = useSolana();

  const handleAirdrop = async () => {
    const success = await requestAirdrop();
    if (success) {
      alert("🎉 Получено 2 SOL на кошелек!");
    } else {
      alert("❌ Ошибка при получении SOL. Попробуй позже.");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Статус сети */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Сеть Solana</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            {connectionStatus === "connecting" && (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Подключение...</span>
              </>
            )}
            {connectionStatus === "connected" && (
              <>
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <Badge variant="secondary">Devnet</Badge>
              </>
            )}
            {connectionStatus === "failed" && (
              <>
                <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                <span className="text-sm text-red-500">Ошибка</span>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Статус кошелька */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Кошелек</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            {connected && publicKey ? (
              <Badge variant="default">{formatPublicKey(publicKey)}</Badge>
            ) : (
              <span className="text-sm text-muted-foreground">
                Не подключен
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Баланс */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Баланс</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Coins className="h-4 w-4" />
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <span className="font-mono">{balance.toFixed(4)} SOL</span>
              )}
            </div>
            {connected && balance < 1 && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleAirdrop}
                disabled={isLoading}
              >
                Получить SOL
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
