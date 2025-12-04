import React, { useState } from "react";
import {
    Chat,
    ChatHeader,
    ChatItem,
    ChatList,
    DateDivider,
    formatDate,
    Message,
    MessageBar,
    MessageList,
} from "../src/index";

type ChatMessage = {
    text?: string;
    files?: { name: string; url: string; type: string }[];
    sender: "UserA" | "UserB";
    timestamp: Date;
};

function App() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    const sendMessage = (payload: { text?: string; files?: File[] }, sender: "UserA" | "UserB") => {
        const fileObjs = payload.files?.map((file) => ({
            name: file.name,
            type: file.type,
            url: URL.createObjectURL(file),
        }));

        setMessages((prev) => [
            ...prev,
            {
                text: payload.text,
                files: fileObjs,
                sender,
                timestamp: new Date(),
            },
        ]);
    };

    const deleteChat = () => {
        console.log("Chat deleted");
        setMessages([]);
    };

    const clearChat = () => {
        console.log("Chat cleared");
        setMessages([]);
    };

    const chats = [
        { name: "User A", lastMessage: "Last Message" },
        { name: "User B", lastMessage: "Hey, are we still meeting later?" },
        { name: "User C", lastMessage: "Sure, see you at 5!" },
        { name: "User D", lastMessage: "This is a really long message. This is a really long message. This is a really long message." },
    ];

    const openChat = (id: string) => {
        console.log(`Open Chat with id: ${id}`)
    }

    return (
        <div className="flex flex-row gap-4 h-screen">
            {/* Chat list */}
            <ChatList className="flex-1">
                {chats.map((chat, idx) => (
                    <ChatItem
                        key={idx}
                        id={chat.name}
                        name={chat.name}
                        lastMessage={chat.lastMessage}
                        date={new Date()}
                        onClick={openChat}
                        options={[
                            { label: "Clear Chat", onClick: clearChat },
                            { label: "Delete Chat", onClick: deleteChat, destructive: true },
                        ]}
                    />
                ))}
            </ChatList>

            {/* Chat for User A */}
            <Chat className="flex-1">
                <ChatHeader
                    name="User A"
                    onClick={() => console.log('User A clicked')}
                    status="Online"
                    options={[
                        { label: "Clear Chat", onClick: clearChat },
                        { label: "Delete Chat", onClick: deleteChat, destructive: true },
                    ]}
                />
                <MessageList>
                    {messages.map((msg, idx) => {
                        const prevMsg = idx > 0 ? messages[idx - 1] : null;
                        const prevDate = prevMsg ? formatDate(prevMsg.timestamp) : null;
                        const currDate = formatDate(msg.timestamp);

                        return (
                            <React.Fragment key={idx}>
                                {prevDate !== currDate && <DateDivider date={msg.timestamp} />}
                                <Message
                                    text={msg.text}
                                    files={msg.files}
                                    isMe={msg.sender === "UserA"}
                                    timestamp={msg.timestamp}
                                />
                            </React.Fragment>
                        );
                    })}
                </MessageList>
                <MessageBar
                    onSend={(payload) => sendMessage(payload, "UserA")} // User A sends
                    allowedFiles="image/*,.pdf"
                    maxFiles={2}
                    errorMessage={{
                        invalidType: "This file type is not allowed",
                        maxFiles: "Max files reached"
                    }}
                />
            </Chat>

            {/* Chat for User B */}
            <Chat className="flex-1">
                <ChatHeader
                    name="User B"
                    status="Online"
                    options={[
                        { label: "Clear Chat", onClick: clearChat },
                        { label: "Delete Chat", onClick: deleteChat, destructive: true },
                    ]}
                />
                <MessageList>
                    {messages.map((msg, idx) => {
                        const prevMsg = idx > 0 ? messages[idx - 1] : null;
                        const prevDate = prevMsg ? formatDate(prevMsg.timestamp) : null;
                        const currDate = formatDate(msg.timestamp);

                        return (
                            <React.Fragment key={idx}>
                                {prevDate !== currDate && <DateDivider date={msg.timestamp} />}
                                <Message
                                    text={msg.text}
                                    files={msg.files}
                                    isMe={msg.sender === "UserB"}
                                    timestamp={msg.timestamp}
                                />
                            </React.Fragment>
                        );
                    })}
                </MessageList>
                <MessageBar
                    onSend={(payload) => sendMessage(payload, "UserB")} allowFiles={false} // User B sends
                />
            </Chat>
        </div>
    );
}

export default App;