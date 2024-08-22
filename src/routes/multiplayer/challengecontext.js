import React, { createContext, useContext, useState } from 'react'

/**
 * Current challenge being played. Contains challenge id and opponent user id.
 */
const ChallengeContext = createContext(null)

export const ChallengeContextProvider = ({ children }) => {
  const [challenge, setChallenge] = useState(0)
  const [opponent, setOpponent] = useState(0)

  return (
    <ChallengeContext.Provider
      value={{ challenge, setChallenge, opponent, setOpponent }}
    >
      {children}
    </ChallengeContext.Provider>
  )
}

export const useChallenge = () => useContext(ChallengeContext)
