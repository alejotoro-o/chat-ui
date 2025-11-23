import {
    Message,
    MessageBar,
    MessageList,
} from "../src/index"

function App() {

    const date = new Date

    const submitMessage = (message: string) => {
        console.log(message)
    }


    return (
        <MessageList className="max-w-xl">
            <Message text='This is a message' isMe={false} timestamp={date} />
            <Message text='Answer' isMe timestamp={date} />
            <MessageBar onSubmit={submitMessage} />
        </MessageList>
    )
}

export default App
