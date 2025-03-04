import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import { Messenger } from "./components/Messenger";

function App() {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path="/messenger/login" element={<Login />} />
                    <Route path="/messenger/register" element={<Register />} />
                    <Route path="/" element={<Messenger />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
