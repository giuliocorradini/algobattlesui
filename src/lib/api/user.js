import { client } from "../api"

/**
 * Fetch current user information (username, email, image) from the server
 */
export function FetchUserInfo(token) {
    return client.get("/user", {
        headers: {Authorization: `Token ${token}`}
    })
}
