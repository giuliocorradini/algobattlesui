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
