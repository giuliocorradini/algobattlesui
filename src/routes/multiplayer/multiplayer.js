import useWebSocket from "react-use-websocket";

export default function MultiplayerPage() {
    const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket("ws://localhost:8000/ws/multiplayer");

    return <div>
        Multiplayer

        <p>Last message: {lastJsonMessage ? lastJsonMessage.message : ""}</p>

        <button onClick={() => {sendJsonMessage({
            message: "west end girls"
        })}}>Send message</button>
    </div>
}