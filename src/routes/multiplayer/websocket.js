import React, { createContext, useContext, useState } from 'react'
import useWebSocket from 'react-use-websocket'

const MultiplayerWebsocketContext = createContext(null)

export const MultiplayerWebsocketProvider = ({ children }) => {
  const [shouldConnect, setShouldConnect] = useState(false)

  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    `ws://localhost:8000/ws/multiplayer`,
    {
      shouldReconnect: (closeEvent) => true,
      reconnectAttempts: 10,
      reconnectInterval: 3000,
      share: true,
      shouldConnect
    }
  )

  const connectWs = () => setShouldConnect(true)
  const disconnectWs = () => setShouldConnect(false)
  const authenticate = (token) => sendJsonMessage({
    "authenticate": {
        "token": token
    }
  })

  return (
    <MultiplayerWebsocketContext.Provider
      value={{ sendJsonMessage, lastJsonMessage, readyState, connectWs, disconnectWs, authenticate }}
    >
      {children}
    </MultiplayerWebsocketContext.Provider>
  )
}

export const useMultiplayerWebsocket = () => useContext(MultiplayerWebsocketContext)
