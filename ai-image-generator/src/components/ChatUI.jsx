import { useState } from "react";
import axios from "axios";
import "./ChatUI.css";

function ChatUI() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const sendMessage = async () => {
        if (!input.trim()) return;

        const newMessages = [...messages, { text: input, type: "user" }];
        setMessages(newMessages);

        let response = { text: "I don't understand.", type: "bot" };

        try {
            if (input.toLowerCase().includes("generate")) {
                // 🖼️ Image Generation API Call
                const res = await axios.post("https://gemini-chatbot-image-generator.onrender.com/generate-image", { prompt: input });
                response = { image: `https://gemini-chatbot-image-generator.onrender.com${res.data.imageUrl}`, type: "bot" };
            } else {
                // 💬 **Send normal text message to Gemini AI**
                const res = await axios.post("https://gemini-chatbot-image-generator.onrender.com/chat", { message: input });
                response = { text: res.data.reply, type: "bot" };
            }
        } catch (error) {
            console.error("❌ Chatbot error:", error);
            response = { text: "Hmm, something went wrong. Try again!", type: "bot" };
        }

        setMessages([...newMessages, response]);
        setInput("");
    };

    return (
        <div className="chat-container">
            <div className="chat-box">
                {messages.map((msg, index) => (
                    <div key={index} className={`chat-message ${msg.type}`}>
                        {msg.text && <p>{msg.text}</p>}
                        {msg.image && <img src={msg.image} alt="Generated" />}
                    </div>
                ))}
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
}

export default ChatUI;
