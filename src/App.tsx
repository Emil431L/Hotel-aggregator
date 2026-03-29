import { BrowserRouter, Routes, Route } from "react-router-dom";
import HotelList from "./components/HotelList";

const App = () => {
    return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<HotelList/>}/>
    </Routes>
    </BrowserRouter>
    )
}

export default App