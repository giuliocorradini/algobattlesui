import { client } from "../api"

/**
 * Fetch current user information (username, email, image) from the server
 */
export function FetchUserInfo(token) {
    return client.get("/user", {
        headers: {Authorization: `Token ${token}`}
    })
}

export function UpdateUserInfo(token, data) {
    return client.patch("/user", data, {
        headers: { Authorization: `Token ${token}` }
    })
}

export function UpdatePassword(token, data) {
    return client.put("/user/password", data, {
        headers: { Authorization: `Token ${token}` }
    })
}