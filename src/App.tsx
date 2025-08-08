import { Playground } from "./components/Playground";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config } from "./config";

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Playground />
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
