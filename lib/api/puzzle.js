import { client, getToken } from "../api";

export function getPuzzle(pk) {
    return client.get(`/puzzle/${pk}`)
}