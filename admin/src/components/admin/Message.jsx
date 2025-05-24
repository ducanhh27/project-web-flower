import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { ChatBubbleLeftIcon } from "@heroicons/react/24/solid";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export default function ChatAdmin() {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [unreadCounts, setUnreadCounts] = useState({});

  const socketRef = useRef(null);
  const initialUsersRef = useRef([]);
  const token = localStorage.getItem("access_token");

  let userId = null;
  let userName = "Admin";

  if (token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded?.userId || null;
      userName = decoded?.userName || "Admin";
    } catch (error) {
      console.error("Token không hợp lệ:", error);
    }
  }

  useEffect(() => {
    const socket = io("http://localhost:3002", {
      query: { userId, userName, role: "admin" },
    });

    socketRef.current = socket;

    socket.on("userList", (userList) => {
      if (userList.length > 0) {
        const existingIds = new Set(initialUsersRef.current.map((u) => u.id));
        const merged = [...initialUsersRef.current];

        userList.forEach((u) => {
          if (!existingIds.has(u.id)) {
            merged.push(u);
          }
        });

        setUsers(merged);
      }
    });

    socket.on("message", (msg) => {
      console.log("📩 Tin nhắn nhận được:", msg);

      const isAdminSender = msg.senderRole === "admin";
      const chatKey = isAdminSender ? msg.to : msg.senderId;
      const senderLabel = isAdminSender ? "admin" : msg.senderId;

      setMessages((prev) => ({
        ...prev,
        [chatKey]: [...(prev[chatKey] || []), { sender: senderLabel, text: msg.text }],
      }));

      if (!isAdminSender) {
        setUnreadCounts((prev) => ({
          ...prev,
          [msg.senderId]: selectedUser === msg.senderId ? 0 : (prev[msg.senderId] || 0) + 1,
        }));

        setUsers((prev) => {
          if (!prev.some((u) => u.id === msg.senderId)) {
            const updated = [...prev, { id: msg.senderId, userName: msg.senderName }];
            initialUsersRef.current = updated; // cập nhật cache
            return updated;
          }
          return prev;
        });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:3000/messages/users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUsers((prev) => {
          const existingIds = new Set(prev.map((u) => u.id));
          const merged = [...prev];
          res.data.forEach((u) => {
            if (!existingIds.has(u.id)) {
              merged.push(u);
            }
          });
          initialUsersRef.current = merged; // lưu vào cache sau khi merge
          return merged;
        });
      } catch (error) {
        console.error("Lỗi khi lấy danh sách người dùng:", error);
      }
    };

    if (token) fetchUsers();
  }, [token]);

  useEffect(() => {
    if (!selectedUser) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/messages/${selectedUser}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("🔁 Tin nhắn từ DB:", res.data);

        setMessages((prev) => ({
          ...prev,
          [selectedUser]: (res.data || []).map((msg) => ({
            sender:
              msg.senderId === userId || msg.senderRole === "admin"
                ? "admin"
                : msg.senderId,
            text: msg.text,
          })),
        }));
      } catch (error) {
        console.error("Lỗi khi tải tin nhắn:", error);
      }
    };

    fetchMessages();
  }, [selectedUser, token]);

  const handleUserClick = (userId) => {
    setSelectedUser(userId);
    setUnreadCounts((prev) => ({ ...prev, [userId]: 0 }));
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedUser) return;

    socketRef.current?.emit("adminMessage", {
      to: selectedUser,
      text: newMessage,
    });

    setMessages((prev) => ({
      ...prev,
      [selectedUser]: [
        ...(prev[selectedUser] || []),
        { sender: "admin", text: newMessage },
      ],
    }));

    setNewMessage("");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/4 bg-white border-r p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Hộp tin nhắn</h2>
        {users.map((user) => (
          <div
            key={user.id}
            onClick={() => handleUserClick(user.id)}
            className={`p-3 cursor-pointer rounded-lg flex items-center gap-2 hover:bg-gray-200 ${
              selectedUser === user.id ? "bg-blue-100" : ""
            }`}
          >
            <ChatBubbleLeftIcon className="h-5 w-5 text-blue-500" />
            <div className="flex-1">
              <p className="font-semibold">{user.userName}</p>
              <p className="text-sm text-gray-500">Tin nhắn gần nhất</p>
            </div>
            {unreadCounts[user.id] > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {unreadCounts[user.id]}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Chat window */}
      <div className="flex-1 flex flex-col">
        <div className="bg-blue-500 text-white p-4 text-lg font-bold">
          {selectedUser
            ? `Chat với: ${
                users.find((u) => u.id === selectedUser)?.userName || selectedUser
              }`
            : "Chọn khách hàng để nhắn"}
        </div>

        <div className="flex-1 p-4 overflow-y-auto bg-gray-50 max-h-[100vh]">
          {(messages[selectedUser] || []).map((msg, index) => (
            <div
              key={index}
              className={`mb-2 p-2 rounded-lg max-w-xs ${
                msg.sender === "admin"
                  ? "bg-blue-500 text-white ml-auto"
                  : "bg-white border"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        <div className="p-4 border-t bg-white flex items-center min-h-[100px]">
          <input
            type="text"
            className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
            placeholder="Nhập tin nhắn..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button
            onClick={handleSendMessage}
            className="ml-2 bg-blue-500 text-white px-4 py-3 rounded-lg"
            disabled={!selectedUser}
          >
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
}
