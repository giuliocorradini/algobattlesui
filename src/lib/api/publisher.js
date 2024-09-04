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

export function PublishPuzzle(token, data) {
    return client.post("/publisher/create", data, {
        headers: { Authorization: `Token ${token}` }
    })
}


export function PublisherDetailPuzzle(token, pk) {
    return client.get(`/publisher/${pk}`, {
        headers: { Authorization: `Token ${token}` }
    })
}

export function PublisherGetTests(token, pk) {
    return client.get(`/publisher/tests/${pk}`, {
        headers: { Authorization: `Token ${token}` }
    })
}

export function EditPuzzle(token, pk, data) {
    return client.put(`/publisher/${pk}`, data, {
        headers: { Authorization: `Token ${token}` }
    })
}

export function DeletePuzzle(token, pk) {
    return client.delete(`/publisher/${pk}`, {
        headers: { Authorization: `Token ${token}` }
    })
}
