import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Register from "./components/Register";
import Login from "./components/Login";
import HotelList from "./components/HotelList";

const queryClient = new QueryClient();

const App = () => {
    return (
    <QueryClientProvider client={queryClient}>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Register/>} />
                <Route path="login" element={<Login/>} />
                <Route path="/hotel" element={<HotelList/>} />
            </Routes>
        </BrowserRouter>
    </QueryClientProvider>
    )
}

export default App;
