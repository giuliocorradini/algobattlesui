import PaginatedPuzzleTable from "../../components/paginatedPuzzleTable"
import { FetchPublishedPuzzles } from "../../lib/api/publisher"
import { useState } from "react";

export default function PublishedPuzzleTable({token}) {
    function fetchPuzzles(page) {
        return FetchPublishedPuzzles(token, page)
    }

    const [puzzles, setPuzzles] = useState([]);
    
    return <PaginatedPuzzleTable fetchPuzzles={fetchPuzzles} puzzles={puzzles} setPuzzles={setPuzzles}></PaginatedPuzzleTable>
}
