import { useState } from "react";
import "./App.css";
import ChatUI from "./components/ChatUI";

function App() {
    return (
        <div className="app-container">
            <h1>AI Chat Assistant</h1>
            <ChatUI />
        </div>
    );
}

export default App;
