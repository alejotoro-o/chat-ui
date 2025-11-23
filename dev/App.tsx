import React, { useState } from "react";
import {
    Chat,
    ChatHeader,
    Message,
    MessageBar,
    MessageList,
} from "../src/index";

type ChatMessage = {
    text?: string;
    files?: { name: string; url: string; type: string }[];
    isMe: boolean;
    timestamp: Date;
};

function App() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    const sendMessage = (
        payload: { text?: string; files?: File[] },
        isMe: boolean
    ) => {
        const fileObjs = payload.files?.map((file) => ({
            name: file.name,
            type: file.type,
            url: URL.createObjectURL(file), // local preview URL
        }));

        setMessages((prev) => [
            ...prev,
            {
                text: payload.text,
                files: fileObjs,
                isMe,
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

    return (
        <div className="flex flex-row gap-4">
            {/* Chat for User A */}
            <Chat className="max-w-xl flex-1">
                <ChatHeader
                    name="User A"
                    status="Online"
                    options={[
                        { label: "Clear Chat", onClick: clearChat },
                        { label: "Delete Chat", onClick: deleteChat, destructive: true },
                    ]}
                />
                <MessageList>
                    {messages.map((msg, idx) => (
                        <Message
                            key={idx}
                            text={msg.text}
                            files={msg.files}
                            isMe={msg.isMe}
                            timestamp={msg.timestamp}
                        />
                    ))}
                </MessageList>
                <MessageBar
                    onSend={(payload) => sendMessage(payload, true)} // User A sends
                />
            </Chat>

            {/* Chat for User B */}
            <Chat className="max-w-xl flex-1">
                <ChatHeader
                    name="User B"
                    status="Online"
                    options={[
                        { label: "Clear Chat", onClick: clearChat },
                        { label: "Delete Chat", onClick: deleteChat, destructive: true },
                    ]}
                />
                <MessageList>
                    {messages.map((msg, idx) => (
                        <Message
                            key={idx}
                            text={msg.text}
                            files={msg.files}
                            isMe={!msg.isMe} // flip perspective
                            timestamp={msg.timestamp}
                        />
                    ))}
                </MessageList>
                <MessageBar
                    onSend={(payload) => sendMessage(payload, false)} allowFiles={false} // User B sends
                />
            </Chat>
        </div>
    );
}

export default App;