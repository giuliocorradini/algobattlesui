import { client } from "../api"

export function FetchPublishedPuzzles(token, pageNumber) {
    return client.get("/publisher/list", {
        params: { page: pageNumber },
        headers: {Authorization: `Token ${token}`}
    })
}

export function SearchPublishedPuzzles(token, pageNumber, terms) {
    return client.get("/publisher/search", {
        params: { page: pageNumber, q: terms },
        headers: {Authorization: `Token ${token}`}
    })
}
