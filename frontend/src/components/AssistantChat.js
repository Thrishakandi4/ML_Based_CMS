
import React, { useState, useRef, useEffect } from "react";
import API_URL from "../api";
import styles from "./AssistantChat.module.css";

const AssistantChat = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I’m your CMS assistant. How can I help you today?" }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput("");
    setLoading(true);
    try {
      // Get JWT token from localStorage (assumes it's stored as 'token')
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/assistant`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ message: input })
      });
      const data = await res.json();
      setMessages((msgs) => [...msgs, { role: "assistant", content: data.reply || data.error || "Sorry, I couldn’t reach the assistant." }]);
    } catch (err) {
      setMessages((msgs) => [...msgs, { role: "assistant", content: "Sorry, I couldn’t reach the assistant." }]);
    }
    setLoading(false);
  };

  return (
    <div className={styles.fabContainer}>
      {open && (
        <div className={styles.chatBox}>
          <div className={styles.header}>
            <span>AI Assistant</span>
            <button className={styles.closeBtn} onClick={() => setOpen(false)}>&times;</button>
          </div>
          <div className={styles.messages}>
            {messages.map((msg, i) => (
              <div key={i} className={msg.role === "user" ? styles.userMsg : styles.assistantMsg}>
                {msg.content}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form className={styles.inputRow} onSubmit={sendMessage}>
            <input
              className={styles.input}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask me anything..."
              disabled={loading}
              autoFocus
            />
            <button className={styles.sendBtn} type="submit" disabled={loading || !input.trim()}>
              {loading ? "..." : "Send"}
            </button>
          </form>
        </div>
      )}
      <button className={styles.fab} onClick={() => setOpen(o => !o)}>
        💬
      </button>
    </div>
  );
};

export default AssistantChat;
