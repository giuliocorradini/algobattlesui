import { client, getAuthorizationTokenHeader, getToken } from ".";
import { Base64 } from "js-base64";

export function getPuzzle(pk) {
    return client.get(`/puzzle/${pk}`)
}

export function getPuzzlePublicTests(pk) {
    return client.get(`/puzzle/${pk}/test`)
}

export function puzzleAttemptRequest(pk, token, language, source) {
    return client.post(`/puzzle/${pk}/attempt`, {
        language: language,
        source: Base64.encode(source)
    }, {
        headers:  {Authorization: `Token ${token}`}
    })
}

export function getPreviousAttempts(pk, token) {
    return client.get(`/puzzle/${pk}/attempt`, {
        headers: {Authorization: `Token ${token}`}
    })
}

export function pollAttempt(pk, token) {
    return client.get(`/puzzle/attempt_result/${pk}`, {
        headers: {Authorization: `Token ${token}`}
    })
}


//  Multiplayer version

export function puzzleAttemptRequestMultiplayer(pk, token, language, source, challengeId) {
    return client.post(`/puzzle/${pk}/multiplayer/attempt?chal=${challengeId}`, {
        language: language,
        source: Base64.encode(source)
    }, {
        headers:  {Authorization: `Token ${token}`}
    })
}

export function getPreviousAttemptsMultiplayer(pk, token, challengeId) {
    return client.get(`/puzzle/${pk}/multiplayer/attempt?chal=${challengeId}`, {
        headers: {Authorization: `Token ${token}`}
    })
}

export function FetchRecentlyPlayed(token) {
    return client.get(`/puzzle/attempted/`, {
        headers: {Authorization: `Token ${token}`}
    })
}

export function FetchCompleted(token) {
    return client.get(`/puzzle/completed/`, {
        headers: {Authorization: `Token ${token}`}
    })
}
