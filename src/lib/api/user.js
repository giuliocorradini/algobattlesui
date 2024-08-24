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

export function UploadPicture(token, formData) {
    return client.put("/user/picture", formData, {
        headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "multipart/form-data"
        }
    })
}

/**
 * Fetch public user information
 */
export function FetchUserPublicInfo(token, userId) {
    return client.get(`/user/${userId}`, {
        headers: {Authorization: `Token ${token}`}
    })
}