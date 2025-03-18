import { useState } from "react";
import axios from "axios";

const PromptForm = ({ setImage, setAudio }) => {
    const [prompt, setPrompt] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await axios.post("https://gemini-chatbot-image-generator.onrender.com/generate-image", { prompt });
        setImage(response.data.imageUrl);

        const ttsResponse = await axios.post("https://gemini-chatbot-image-generator.onrender.com/generate-tts", { text: prompt });
        setAudio(ttsResponse.data.audioUrl);
    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <input type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Enter prompt..." />
            <button type="submit">Generate</button>
        </form>
    );
};

export default PromptForm;
