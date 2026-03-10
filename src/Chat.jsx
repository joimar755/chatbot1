import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000/"; 


const Chat = ({ usuario_id }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Función para hacer scroll al final automáticamente
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    try {
      // Llamada al backend
      const res = await axios.post(`${URL}/chatbot`, {
        content: input,
      });

      // Actualizar mensajes con todo el historial de la conversación
      const historial = res.data.mensajes.map((m) => ({
        sender: m.tipo_rol === 1 ? "user" : "bot",
        text: m.content,
      }));

      setMessages(historial);
    } catch (err) {
      console.error("Error al enviar mensaje:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error de conexión" },
      ]);
    }

    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto" }}>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          height: "400px",
          overflowY: "auto",
          marginBottom: "10px",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              textAlign: msg.sender === "user" ? "right" : "left",
              margin: "5px 0",
            }}
          >
     <span
  style={{
    display: "inline-block",
    padding: "8px 12px",
    borderRadius: "12px",
    backgroundColor: msg.sender === "user" ? "#0b93f6" : "#e5e5ea",
    color: msg.sender === "user" ? "white" : "black",
    whiteSpace: "pre-wrap", // ⚡ respeta saltos de línea
  }}
>
  {msg.text}
</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="Escribe un mensaje..."
        style={{ width: "100%", padding: "10px" }}
      />
    </div>
  );
};

export default Chat;