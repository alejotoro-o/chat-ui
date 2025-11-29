# Chat UI

This package provides a set of **frontend components** designed to help you quickly build modern, responsive chat interfaces. It focuses on flexibility, developer experience, and seamless integration with any backend.

### Key Features

- **Backend‑agnostic:** Plug in any backend service via simple callbacks. The components don’t enforce a specific data source, making them compatible with REST APIs, WebSockets, GraphQL, Firebase, or custom infrastructures.

- **Tailwind CSS support:** Built with Tailwind for clean, utility‑first defaults. Every component is fully customizable — override styles using Tailwind classes or apply your own custom CSS for complete control over the look and feel.

- **File handling:** Out‑of‑the‑box support for sending and receiving files. Users can drag‑and‑drop, paste, or select files, and the UI provides previews for images and other file types.

- **Accessible & responsive:** Components are designed with accessibility and responsiveness in mind, ensuring a smooth experience across devices and screen sizes.

- **Composable architecture:** Each piece (Chat, ChatHeader, MessageList, MessageBar, etc.) is modular. You can use them together for a full chat app or individually to fit into existing layouts.

## Installation

Install the package via npm:

```sh
npm install @alejotoro-o/chat-ui
```

### Requirements

- **React 19+** and **React DOM 19+** are required as peer dependencies. Make sure your project is using compatible versions:

```sh
npm install react@^19.1.0 react-dom@^19.1.0
```

- **Tailwind CSS** must be configured in your project. The components rely on Tailwind utilities for styling.

### Tailwind Configuration

Update your `tailwind.config.js` to include the package so styles are applied correctly:

```js
const config = {
  content: [
    // Your app sources
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',

    // Include chat-ui components
    './node_modules/@alejotoro-o/chat-ui/*.{ts,tsx}',
  ],
  // Rest of your Tailwind config...
};

export default config;
```

### Notes

- The package ships with **ESM exports** (`type: "module"`) and provides both JavaScript and TypeScript definitions (`dist/index.js` and `dist/index.d.ts`).
- Styling utilities use [`clsx`](https://www.npmjs.com/package/clsx) and [`tailwind-merge`](https://www.npmjs.com/package/tailwind-merge) internally, so you can safely combine and override classes.

Once installed and configured, you can start importing components like:

```tsx
import { Chat, ChatHeader, MessageList, MessageBar } from '@alejotoro-o/chat-ui';
```

## Usage

This package allows you to build a chat UI in a **modular fashion**. Each component is highly extensible and customizable, so you can compose them together to create a full chat interface or use them individually in existing layouts.

Below is a minimal example showing how to wire up the components with local state. For a more complete demo, check out `App.tsx` in the `dev` folder.

```ts
type ChatMessage = {
    text?: string;
    files?: { name: string; url: string; type: string }[];
    sender: "UserA" | "UserB";
    timestamp: Date;
};

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

### How it works

- **`Chat`**: Main wrapper that defines the chat layout.  
- **`ChatHeader`**: Displays the chat title, status, and optional actions (e.g., clear/delete).  
- **`MessageList`**: Scrollable container for messages.  
- **`DateDivider`**: Separates messages by date.  
- **`Message`**: Renders individual messages, aligned left/right based on `isMe`.  
- **`MessageBar`**: Input area for sending text and files.  

### Customization

- Override styles using Tailwind classes or custom CSS.  
- Extend functionality by passing callbacks (`onSend`, `onClick`, etc.) to integrate with any backend.  
- File support is built in — drag‑and‑drop, paste, or select files directly in the message bar.

## Components Overview

This package provides the following components:

### `Chat`

The `Chat` component is the main wrapper for a chat interface. It defines the layout and contains the header, message list, and input bar.

```ts
type ChatProps = {
    children: React.ReactNode
    className?: string
}
```

- **children:** React nodes to render inside the chat (header, list, bar).
- **className:** Optional Tailwind/custom classes to style the Chat container.

### `ChatHeader`

The `ChatHeader` component displays the chat title, avatar, status, and an optional action menu.

```ts
type ChatHeaderOption = {
    label: string;
    onClick: () => void;
    destructive?: boolean; // optional flag for styling (e.g. red text for delete)
};

type ChatHeaderProps = {
    name: string;
    onClick?: () => void;
    imageUrl?: string;
    status?: string;
    className?: string;
    options?: ChatHeaderOption[]
};
```

- **name:** Display name of the chat or contact.
- **onClick:** Optional callback to perform an action when the user’s profile is clicked.
- **imageUrl:** Optional avatar image source URL.
- **status:** Presence text (e.g., “Online”, “Typing…”).
- **className:** Optional styles for the header container.
- **options:** Array of actions with `label`, `onClick`, and optional `destructive` flag.

### `Message`

The `Message` component renders a single message bubble with optional text, files, and timestamp. Alignment is controlled by the `isMe` flag.

```ts
type MessageProps = {
    text?: string;
    files?: { name: string; url: string; type: string }[];
    isMe: boolean;
    timestamp: Date;
    classNameMe?: string;
    textColorMe?: string;
    classNameOther?: string;
    textColorOther?: string;
    className?: string;
};
```

- **text:** Message text content.
- **files:** Array of file attachments with preview URLs.
- **isMe:** Whether the message belongs to the current user.
- **timestamp:** Date object used for display and grouping.
- **classNameMe / textColorMe:** Styles for the “me” bubble and text.
- **classNameOther / textColorOther:** Styles for the “other” bubble and text.
- **className:** Styles for the outer wrapper.

### `MessageList`

The `MessageList` component is a scrollable container for messages and date dividers.

```ts
type MessageListProps = {
    children: React.ReactNode;
    className?: string;
    classNameScrollButton?: string;
};
```

- **children:** Messages and related helpers (e.g., `DateDivider`).
- **className:** Styles for the list container.
- **classNameScrollButton:** Styles for the scroll-to-bottom button.

### `MessageBar`

The `MessageBar` component provides an input area for sending messages and files.

```ts
type MessageBarProps = {
    onSend: (payload: { text?: string; files?: File[] }) => void;
    placeholder?: string;
    className?: string;
    allowFiles?: boolean;
    classNameAttachIcon?: string;
    classNameSendIcon?: string;
};
```

- **onSend:** Callback invoked with text and/or files when the user sends.
- **placeholder:** Input placeholder text.
- **className:** Styles for the bar container.
- **allowFiles:** Enables file selection/drag‑and‑drop if true.
- **classNameAttachIcon:** Styles for the attachment icon.
- **classNameSendIcon:** Styles for the send icon.

### `ChatItem`

The `ChatItem` component represents a row in a chat list, showing name, last message, date, avatar, and an options menu.

```ts
type ChatItemOptions = {
    label: string;
    onClick: () => void;
    destructive?: boolean; 
};

type ChatItemProps = {
    id: string;
    name: string;
    lastMessage: string;
    date: Date;
    onClick: (id: string) => void;
    imageUrl?: string;
    className?: string;
    options?: ChatItemOptions[]
};
```

- **id:** Unique identifier passed to `onClick`.
- **name:** Chat or contact name.
- **lastMessage:** Preview of the most recent message.
- **date:** Date of the last activity.
- **onClick:** Handler invoked when the item is clicked.
- **imageUrl:** Optional avatar image.
- **className:** Styles for the list item.
- **options:** Array of actions for the overflow menu.

### `ChatList`

The `ChatList` component is a container for multiple `ChatItem` entries.

```ts
type ChatListProps = {
    children: React.ReactNode
    className?: string
}
```

- **children:** One or more `ChatItem` elements.
- **className:** Styles for the list container.

### `DateDivider`

The `DateDivider` component separates messages by date with a label and horizontal lines.

```ts
type DateDividerProps = {
    date: Date
    locale?: string
    className?: string
    classNameLines?: string
    classNameText?: string
}
```

- **date:** Date object to display as the divider label.
- **locale:** Locale string used for date formatting.
- **className:** Styles for the divider container.
- **classNameLines:** Styles for the horizontal lines.
- **classNameText:** Styles for the center date label.

Here’s a polished **Utilities** section in Markdown, with a short explanation and prop descriptions for `formatDate`. Ready for copy‑paste into your README:

## Utilities

### `formatDate`

A helper function to format a `Date` object into a short, human‑readable string (day, month, year only). Useful for rendering timestamps in messages or dividers.

```ts
// Utility to format just the date (no time)
export const formatDate = (date: Date, locale: string = "en-US") =>
    date.toLocaleDateString(locale, {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
```

#### Parameters
- **`date`**: A JavaScript `Date` object to format.  
- **`locale`**: Optional locale string (default `"en-US"`). Determines language and formatting style.

#### Example
```ts
formatDate(new Date()); 
// "26 Nov 2025" (depending on locale)
```

