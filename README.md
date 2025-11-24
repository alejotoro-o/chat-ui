# Chat UI

## Installation

## Usage

```ts
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

<Chat>
    <ChatHeader
        name="User A"
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
        onSend={(payload) => sendMessage(payload, "UserA")}
    />
</Chat>
```