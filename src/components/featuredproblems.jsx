import PuzzleCollection from "./puzzlecollection"
import { FetchFeaturedProblems } from "../lib/api/home"
import { useState, useEffect } from "react"

export default function FeaturedProblems(props) {
    const [featuredProblems, setFeaturedProblems] = useState([])

    useEffect(() => {    
        FetchFeaturedProblems()
        .then(({data}) => {
          setFeaturedProblems(data)
        })
        .catch(err => {})
      }, [])

    return (
        featuredProblems.map((c, i) => <PuzzleCollection
            collectionName={c.name} key={i}
            content={c.puzzles}
            {...props}
        />)
    )
}