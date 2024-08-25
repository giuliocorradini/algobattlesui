import { client } from "../api";

export function SearchPuzzle(query) {
    return client.get("/search", {
        params: {
            t: query
        }
    })
}
