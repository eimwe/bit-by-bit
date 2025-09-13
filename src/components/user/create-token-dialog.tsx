import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useDataTokens } from "@/hooks/use-data-tokens";
import { generateMockDataSample } from "@/lib/data-tokens";
import { Loader2, Plus, Eye, Clock } from "lucide-react";

export const CreateTokenDialog: React.FC = () => {
  const { dataTypes, createNewDataToken, isCreating, calculateTokenPrice } =
    useDataTokens();
  const [open, setOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("");
  const [customPrice, setCustomPrice] = useState<number>(0);
  const [duration, setDuration] = useState<number[]>([30]);
  const [showPreview, setShowPreview] = useState(false);

  const selectedDataType = dataTypes.find((dt) => dt.id === selectedType);
  const basePrice = selectedDataType
    ? calculateTokenPrice(selectedDataType.basePrice, selectedDataType.privacy)
    : 0;
  const finalPrice = customPrice > 0 ? customPrice : basePrice;

  const handleCreate = async () => {
    if (!selectedType) return;

    try {
      await createNewDataToken(
        selectedType,
        customPrice > 0 ? customPrice : undefined,
        duration[0]
      );
      setOpen(false);
      setSelectedType("");
      setCustomPrice(0);
      setDuration([30]);
      setShowPreview(false);
    } catch (error) {
      console.error("Failed to create token:", error);
    }
  };

  const mockData = selectedType ? generateMockDataSample(selectedType) : {};

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 dark:text-slate-50">
          <Plus className="h-4 w-4" />
          Создать токен данных
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Создание токена данных</DialogTitle>
          <DialogDescription>
            Выберите тип данных для токенизации и установите условия доступа
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Выбор типа данных */}
          <div>
            <Label className="text-base font-medium">Тип данных</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
              {dataTypes.map((dataType) => (
                <Card
                  key={dataType.id}
                  className={`cursor-pointer transition-colors ${
                    selectedType === dataType.id
                      ? "border-primary bg-primary/5"
                      : "hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedType(dataType.id)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <span className="text-lg">{dataType.icon}</span>
                      {dataType.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <CardDescription className="text-xs">
                      {dataType.description}
                    </CardDescription>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {dataType.privacy === "low" && "🟢 Низкая приватность"}
                        {dataType.privacy === "medium" &&
                          "🟡 Средняя приватность"}
                        {dataType.privacy === "high" &&
                          "🔴 Высокая приватность"}
                      </Badge>
                      <span className="text-sm font-mono">
                        {calculateTokenPrice(
                          dataType.basePrice,
                          dataType.privacy
                        ).toFixed(3)}{" "}
                        SOL
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {selectedDataType && (
            <>
              {/* Предпросмотр данных */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPreview(!showPreview)}
                    className="gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    {showPreview ? "Скрыть превью" : "Показать превью данных"}
                  </Button>
                </div>

                {showPreview && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">
                        Превью данных: {selectedDataType.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        {Object.entries(mockData).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-muted-foreground capitalize">
                              {key.replace(/([A-Z])/g, " $1").toLowerCase()}:
                            </span>
                            <span className="font-mono">
                              {value as React.ReactNode}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Настройки */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Цена */}
                <div className="space-y-3">
                  <Label>Цена за доступ</Label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        step="0.001"
                        min="0"
                        placeholder={basePrice.toFixed(3)}
                        value={customPrice || ""}
                        onChange={(e) =>
                          setCustomPrice(parseFloat(e.target.value) || 0)
                        }
                        className="font-mono"
                      />
                      <span className="text-sm text-muted-foreground">SOL</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Рекомендуемая цена: {basePrice.toFixed(3)} SOL
                      {customPrice > 0 && (
                        <span className="block text-primary">
                          Установлено: {customPrice.toFixed(3)} SOL
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Длительность */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Срок доступа: {duration[0]} дней
                  </Label>
                  <Slider
                    value={duration}
                    onValueChange={setDuration}
                    max={365}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1 день</span>
                    <span>365 дней</span>
                  </div>
                </div>
              </div>

              {/* Примеры использования */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">
                    Что получат компании
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1">
                    {selectedDataType.examples.map((example, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {example}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isCreating}
          >
            Отмена
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!selectedType || isCreating}
            className="gap-2 dark:text-slate-50"
          >
            {isCreating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Создаем токен...
              </>
            ) : (
              <>Создать за {finalPrice.toFixed(3)} SOL</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
