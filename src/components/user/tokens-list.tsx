import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useDataTokens } from "@/hooks/use-data-tokens";
import { formatPublicKey } from "@/lib/solana";
import { ExternalLink, TrendingUp, Users, Calendar } from "lucide-react";

export const UserTokensList: React.FC = () => {
  const { userTokens, stats } = useDataTokens();

  if (userTokens.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <div className="text-center space-y-2">
            <div className="text-4xl">📊</div>
            <h3 className="text-lg font-semibold">Нет токенов данных</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Создайте первый токен данных, чтобы начать зарабатывать на своей
              информации
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Общая статистика */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">{stats.totalTokens}</div>
              <Badge variant="secondary">токенов</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Создано токенов
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">
                {stats.totalEarnings.toFixed(3)}
              </div>
              <Badge variant="secondary">SOL</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Общий доход</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div className="text-2xl font-bold">{stats.totalUsage}</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Использований</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <div className="text-2xl font-bold">
                {stats.avgPrice.toFixed(3)}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Средняя цена</p>
          </CardContent>
        </Card>
      </div>

      {/* Список токенов */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Ваши токены данных</h3>

        {userTokens.map((token) => {
          const daysLeft = Math.max(
            0,
            token.duration -
              Math.floor(
                (Date.now() - token.created.getTime()) / (1000 * 60 * 60 * 24)
              )
          );
          const progressPercent = Math.max(
            0,
            (daysLeft / token.duration) * 100
          );

          return (
            <Card key={token.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">
                      {token.dataType === "location" && "📍"}
                      {token.dataType === "purchases" && "💳"}
                      {token.dataType === "health" && "💪"}
                      {token.dataType === "social" && "👥"}
                      {token.dataType === "browsing" && "🌐"}
                    </div>
                    <div>
                      <CardTitle className="text-base">{token.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant={
                            token.privacy === "high"
                              ? "destructive"
                              : token.privacy === "medium"
                              ? "default"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {token.privacy === "low" && "🟢 Низкая приватность"}
                          {token.privacy === "medium" &&
                            "🟡 Средняя приватность"}
                          {token.privacy === "high" && "🔴 Высокая приватность"}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {formatPublicKey(token.mint || token.owner)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">
                      {token.price.toFixed(3)} SOL
                    </div>
                    <div className="text-sm text-muted-foreground">
                      за доступ
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Статистика использования */}
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-semibold">
                      {token.totalEarnings.toFixed(3)} SOL
                    </div>
                    <div className="text-muted-foreground">Заработано</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">{token.usageCount}</div>
                    <div className="text-muted-foreground">Использований</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">{daysLeft}</div>
                    <div className="text-muted-foreground">дней осталось</div>
                  </div>
                </div>

                {/* Прогресс времени */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Срок действия
                    </span>
                    <span className="text-muted-foreground">
                      {daysLeft > 0
                        ? `${daysLeft} из ${token.duration} дней`
                        : "Истек"}
                    </span>
                  </div>
                  <Progress value={progressPercent} className="h-2" />
                </div>

                {/* Действия */}
                <div className="flex items-center justify-between pt-2">
                  <div className="text-xs text-muted-foreground">
                    Создан: {token.created.toLocaleDateString()}
                  </div>
                  <div className="flex gap-2">
                    {token.mint && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1 text-slate-50"
                        onClick={() =>
                          window.open(
                            `https://explorer.solana.com/address/${token.mint?.toString()}?cluster=devnet`,
                            "_blank"
                          )
                        }
                      >
                        <ExternalLink className="h-3 w-3" />
                        Explorer
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
