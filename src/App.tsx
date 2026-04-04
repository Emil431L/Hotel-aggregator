import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import HotelList from "./components/HotelList";

const queryClient = new QueryClient();

const App = () => {
    return (
    <QueryClientProvider client={queryClient}>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HotelList/>}/>
            </Routes>
        </BrowserRouter>
    </QueryClientProvider>
    )
}

export default App;
