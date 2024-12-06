import "./App.css";
import NavBar from "./Components/NavBar/NavBar.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NavBar />
    </QueryClientProvider>
  );
}

export default App;
