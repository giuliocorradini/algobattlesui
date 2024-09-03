import PaginatedPuzzleTable from "../../components/paginatedPuzzleTable"
import { FetchPublishedPuzzles } from "../../lib/api/publisher"

export default function PublishedPuzzleTable({token}) {
    function fetchPuzzles(page) {
        return FetchPublishedPuzzles(token, page)
    }
    
    return <PaginatedPuzzleTable fetchPuzzles={fetchPuzzles}></PaginatedPuzzleTable>
}
