import { client, getToken } from "../api";

export function getPuzzle(pk) {
    return client.get(`/puzzle/${pk}`)
}

export function getPuzzlePublicTests(pk) {
    return client.get(`/puzzle/${pk}/test`)
}