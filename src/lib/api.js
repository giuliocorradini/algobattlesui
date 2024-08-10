'use client'

import axios from "axios";

let token = "";
export function getToken() {
    return token;
}

function getAuthorizationTokenHeader() {
    return {"Authorization" : `Token ${token}`}
}

export function setToken(tok) {
    token = tok;
}

export const client = axios.create({
    baseURL: "http://127.0.0.1:3000/api/",
    timeout: 5000,
});

export function loginRequest(username, password) {
    return client.post(
        "/auth/login/", {
            username: username,
            password: password
        }
    )
}

export function logoutRequest() {
    return client.get("/auth/logout/", {
        headers: {"Authorization": `Token ${token}`}
    })
}

export function registerRequest(username, password, email) {
    return client.post("/auth/register/", {
        username: username,
        password: password,
        email: email
    }, {
        headers: ""
    })
}
