import React from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPublicKey } from "@/lib/solana";

export const WalletConnection: React.FC = () => {
  const { connected, publicKey } = useWallet();

  if (connected && publicKey) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-green-600">✅ Кошелек подключен</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Адрес:</span>
            <Badge variant="secondary">{formatPublicKey(publicKey)}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Сеть:</span>
            <Badge variant="outline">Devnet</Badge>
          </div>
          <WalletMultiButton className="w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Подключи кошелек</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Для работы с платформой нужен Solana кошелек
        </p>
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">
            📱 Установи Phantom Wallet расширение
          </p>
          <p className="text-xs text-muted-foreground">
            💰 Переключись на Devnet в настройках
          </p>
          <p className="text-xs text-muted-foreground">
            🎁 Получи бесплатные SOL на faucet.solana.com
          </p>
        </div>
        <WalletMultiButton className="w-full" />
      </CardContent>
    </Card>
  );
};
