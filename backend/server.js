import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";

dotenv.config();
const app = express();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.use(cors());
app.use(express.json());
app.use("/images", express.static("images")); // Serve images statically

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
    console.error("❌ Missing API Key! Please add GEMINI_API_KEY to .env");
    process.exit(1);
}

// Ensure 'images' folder exists
const imageDir = path.join(process.cwd(), "images");
if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir);
}

// ✅ Image Generation (Gemini 2.0 Flash)
app.post("/generate-image", async (req, res) => {
    const { prompt } = req.body;
    console.log("📨 Received prompt:", prompt);

    const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash-exp-image-generation",
        generationConfig: {
            responseModalities: ['Text', 'Image']
        },
    });

    try {
        const response = await model.generateContent(prompt);
        let imageData = null;
        let description = "";

        for (const part of response.response.candidates[0].content.parts) {
            if (part.text) {
                description = part.text;
            } else if (part.inlineData) {
                imageData = part.inlineData.data;
            }
        }

        if (imageData) {
            const filename = `image_${Date.now()}.png`;
            const filepath = path.join(imageDir, filename);
            fs.writeFileSync(filepath, Buffer.from(imageData, "base64"));
            console.log(`✅ Image saved as ${filename}`);

            res.json({
                imageUrl: `/images/${filename}`,
                description,
            });
        } else {
            res.status(500).json({ error: "No image generated." });
        }
    } catch (error) {
        console.error("❌ Error generating image:", error);
        res.status(500).json({ error: "Failed to generate image" });
    }
});

// ✅ Chat with Gemini AI
app.post("/chat", async (req, res) => {
    const { message } = req.body;
    console.log("📨 User message:", message);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-002" });

    try {
        const aiResponse = await model.generateContent(message);

        // ✅ Correctly Extract AI Response Text
        const reply = aiResponse.response.candidates[0]?.content.parts[0]?.text || "I couldn't understand that.";
        console.log(reply);
        
        res.json({ reply });

    } catch (error) {
        console.error("❌ Error generating response:", error);
        res.status(500).json({ reply: "Hmm, something went wrong. Try again!" });
    }
});

// ✅ Text-to-Speech (TTS)
app.post("/generate-tts", async (req, res) => {
    const { text } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-tts" });

    try {
        const response = await model.generateContent(text);
        const audioContent = response.response.candidates[0]?.content.parts[0]?.inlineData?.data || null;

        if (audioContent) {
            res.json({ audioContent });
        } else {
            res.status(500).json({ error: "Failed to generate speech" });
        }
    } catch (error) {
        console.error("❌ Error generating speech:", error);
        res.status(500).json({ error: "Failed to generate speech" });
    }
});

app.listen(5000, () => console.log("🚀 Server running on port 5000"));
