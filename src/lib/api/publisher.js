import { client } from "../api"

export function FetchPublishedPuzzles(token, pageNumber) {
    return client.get("/publisher/list", {
        params: { page: pageNumber },
        headers: {Authorization: `Token ${token}`}
    })
}