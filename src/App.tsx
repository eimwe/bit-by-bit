import { ThemeProvider } from "@/components/theme/theme-provider";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { SolanaWalletProvider } from "@/components/solana/wallet-provider";
import { UserDashboard } from "@/pages/user-dashboard";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SolanaWalletProvider>
        <div className="min-h-screen bg-background">
          {/* Header */}
          <header className="border-b">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
              <h1 className="text-2xl font-bold">⚡DataVolt</h1>
              <div className="flex items-center gap-4">
                <ModeToggle />
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="container mx-auto px-4 py-8">
            <UserDashboard />
          </main>
        </div>
      </SolanaWalletProvider>
    </ThemeProvider>
  );
}

export default App;
