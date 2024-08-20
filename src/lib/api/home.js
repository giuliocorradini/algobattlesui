import { client } from "../api";

export function FetchFeaturedProblems() {
    return client.get("/featured")
}