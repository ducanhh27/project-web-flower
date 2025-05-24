import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { IoCloseSharp } from "react-icons/io5";
import { jwtDecode } from "jwt-decode";

export default function ChatMessage() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [shouldConnect, setShouldConnect] = useState(!!localStorage.getItem("access_token"));
  const chatBoxRef = useRef(null);
  const socketRef = useRef(null);

  // ✅ Lắng nghe khi đăng nhập / đăng xuất
  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        setShouldConnect(true); // đăng nhập xong → kết nối
      } else {
        // logout → reset lại
        setMessages([]);
        setIsOpen(false);
        setShouldConnect(false);
        socketRef.current?.disconnect();
        socketRef.current = null;
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // ✅ Lấy lịch sử tin nhắn khi cần
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!shouldConnect || !token) return;

    const fetchMessageHistory = async () => {
      try {
        const decoded = jwtDecode(token);
        const userId = decoded?.userId;

        const res = await fetch(`http://localhost:3000/messages/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        const formatted = data.map((msg) => ({
          from: msg.senderId === "admin" ? "admin" : "me",
          text: msg.text,
        }));

        setMessages(formatted);
      } catch (err) {
        console.error("Lỗi khi tải lịch sử tin nhắn:", err);
      }
    };

    fetchMessageHistory();
  }, [shouldConnect]);

  // ✅ Khởi tạo socket
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const name = localStorage.getItem("name");

    if (!shouldConnect || !token || !name) return;

    let userId = null;
    try {
      const decoded = jwtDecode(token);
      userId = decoded?.userId;
    } catch (error) {
      console.error("Token không hợp lệ:", error);
    }

    if (userId) {
      const socket = io("http://localhost:3002", {
        query: { userId, userName: name, role: "client" },
      });

      socketRef.current = socket;

      socket.on("message", (msg) => {
        setMessages((prev) => [
          ...prev,
          { from: msg.senderId === "admin" ? "admin" : "me", text: msg.text },
        ]);
      });

      return () => {
        socket.disconnect();
        socketRef.current = null;
      };
    }
  }, [shouldConnect]);

  // ✅ Tự động scroll
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  // ✅ Gửi tin nhắn
  const sendMessage = () => {
    if (!message.trim()) return;

    socketRef.current?.emit("privateMessage", { to: "admin", text: message });
    setMessages((prev) => [...prev, { from: "me", text: message }]);
    setMessage("");
  };

  return (
    <div className="chat-message-container">
      {!isOpen && shouldConnect && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg"
        >
          💬 Chat
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-5 right-5 w-80 bg-white rounded-lg shadow-lg border">
          <div className="bg-green-500 text-white p-3 flex justify-between items-center rounded-t-lg">
            <span>Chat với Admin</span>
            <button onClick={() => setIsOpen(false)} className="text-xl">
              <IoCloseSharp />
            </button>
          </div>

          <div ref={chatBoxRef} className="h-60 overflow-y-auto p-3 bg-gray-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`mb-2 p-2 rounded-lg max-w-xs ${
                    msg.from === "me"
                      ? "bg-blue-500 text-white self-end"
                      : "bg-white border self-start"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 flex items-center border-t">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 p-2 border rounded-lg"
              placeholder="Nhập tin nhắn..."
            />
            <button
              onClick={sendMessage}
              className="ml-2 bg-green-500 text-white px-4 py-2 rounded-lg"
            >
              Gửi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
