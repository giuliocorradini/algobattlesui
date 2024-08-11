'use client'

import axios from "axios";
import { createContext } from "react";

export const AuthenticationContext = createContext({
    isLogged: false,
    token: null
})

export function getToken() {
    return AuthenticationContext.token
}

export function getAuthorizationTokenHeader() {
    return {"Authorization" : `Token ${AuthenticationContext.token}`}
}

export function setToken(tok) {
    AuthenticationContext.token = tok
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
        headers: getAuthorizationTokenHeader()
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
