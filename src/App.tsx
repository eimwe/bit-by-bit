import { ThemeProvider } from "@/components/theme/theme-provider";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { SolanaWalletProvider } from "@/components/solana/wallet-provider";
import { WalletConnection } from "@/components/solana/wallet-button";
import { SolanaStatus } from "@/components/solana/solana-status";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SolanaWalletProvider>
        <div className="min-h-screen bg-background">
          {/* Header */}
          <header className="border-b">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
              <h1 className="text-2xl font-bold">DataVault</h1>
              <div className="flex items-center gap-4">
                <ModeToggle />
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold">
                  Токенизация персональных данных
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Превратите свои данные в токены на блокчейне Solana и
                  получайте автоматические выплаты за их использование
                </p>
              </div>

              {/* Solana Connection Status */}
              <SolanaStatus />

              {/* Wallet Connection */}
              <div className="flex justify-center">
                <WalletConnection />
              </div>
            </div>
          </main>
        </div>
      </SolanaWalletProvider>
    </ThemeProvider>
  );
}

export default App;
