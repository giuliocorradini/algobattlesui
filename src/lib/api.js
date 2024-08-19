'use client'

import axios from "axios";
import { createContext } from "react";
import { api_token_key } from "../config";

/**
 * This context is used by authentication aware components. Values are defined in index.js
 * as a state and passed to the AuthenticationContext provider.
 */
export const AuthenticationContext = createContext({
    isLogged: false,
    token: null,
    setAuthentication: (isLogged, token) => {}
})

export const CurrentUserContext = createContext({
    user: {},
    setUser: user => {}
})

export function getToken() {
    return AuthenticationContext.token
}

export function getAuthorizationTokenHeader() {
    return {"Authorization" : `Token ${AuthenticationContext.token}`}
}

export function setToken(tok) {
    AuthenticationContext.token = tok
    AuthenticationContext.isLogged = true
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

export function saveLocalStorageToken(token) {
    localStorage.setItem(api_token_key, token)
}

export function invalidateLocalStorageToken() {
    localStorage.removeItem(api_token_key)
}

export function checkLocalStorageToken(setAuthentication) {
    const savedToken = localStorage.getItem(api_token_key)

    if (savedToken)
        client.post("/auth/token", {}, {
            headers: { Authorization: `Token ${savedToken}` }
        })
            .then(response => setAuthentication([true, savedToken]))
            .catch(err => invalidateLocalStorageToken())
}
