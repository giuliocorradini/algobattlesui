import { useState } from "react"
import { Input } from "./ui/input"
import { SearchPuzzle } from "../lib/api/search"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "./ui/table"
import { Button } from "./ui/button"
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react"
import { Badge } from "./ui/badge"
import { cn } from "../lib/utils"

export function SearchBar({ setResults, className, searchCallback }) {
    const [query, setQuery] = useState("")
    const searchFetch = searchCallback ? searchCallback : SearchPuzzle

    function performSearch() {
        if (query == "")
            setResults(null)

        else
            searchFetch(query)
                .then(response => {
                    setResults(response.data.results)
                })
                .catch(err => { })
    }

    return <div className={cn("relative flex items-center", className)}>
        <div className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <form onSubmit={evt => {
            evt.preventDefault()
            performSearch()
        }}>
            <Input
                type="search"
                placeholder="Search puzzles..."
                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                value={query}
                onChange={(evt) => setQuery(evt.target.value)}
            />
        </form>
    </div>
}



export function SearchResults({ results, openProblem }) {
    const [sortColumn, setSortColumn] = useState("")
    const [sortDirection, setSortDirection] = useState("asc")

    const difficulty = {
        "E": { label: "Easy", value: 0, color: 'bg-green-100 text-green-800' },
        "M": { label: "Medium", value: 1, color: 'bg-yellow-100 text-yellow-800' },
        "H": { label: "Hard", value: 2, color: 'bg-red-100 text-red-800' },
    }

    const sortedResults = [...results].sort((a, b) => {
        if (sortColumn === 'title') {
            return sortDirection === 'asc'
                ? a.title.localeCompare(b.title)
                : b.title.localeCompare(a.title)
        } else if (sortColumn === 'difficulty') {
            return sortDirection === 'asc'
                ? difficulty[a.difficulty].value - difficulty[b.difficulty].value
                : difficulty[b.difficulty].value - difficulty[a.difficulty].value
        } else {
            return true
        }
    })

    const SortIcon = ({ column }) => {
        if (sortColumn !== column) return <ArrowUpDown className="ml-2 h-4 w-4" />
        return sortDirection === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />
    }

    function toggleSort(column) {
        if (sortColumn === column) {
            if (sortDirection === "desc")
                setSortColumn("")
                setSortDirection("asc")
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
        } else {
            setSortColumn(column)
            setSortDirection('asc')
        }
    }

    return (
        <div>
            <div className="mt-4 px-2 text-xl font-medium text-muted-foreground">Search results</div>

            {results.length == 0 ? <div>
                <p>No results</p>
            </div> :
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>
                                <Button variant="ghost" onClick={() => toggleSort('title')}>
                                    Title
                                    <SortIcon column="title" />
                                </Button>
                            </TableHead>
                            <TableHead>
                                <Button variant="ghost" onClick={() => toggleSort('difficulty')}>
                                    Difficulty
                                    <SortIcon column="difficulty" />
                                </Button>
                            </TableHead>
                            <TableHead>Categories</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedResults.map((puzzle) => (
                            <TableRow key={puzzle.id} onClick={() => {openProblem(puzzle.id)}}>
                                <TableCell className="font-medium">{puzzle.title}</TableCell>
                                <TableCell>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${difficulty[puzzle.difficulty].color}`}>
                                        {difficulty[puzzle.difficulty].label}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-wrap gap-1">
                                        {puzzle.categories.map((category, index) => (
                                            <Badge key={index} variant="secondary">{category}</Badge>
                                        ))}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            }
        </div>
    )
}