import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { ChevronFirst, ChevronLast } from 'lucide-react'


export default function PaginatedPuzzleTable({ fetchPuzzles, setPuzzles, puzzles, openCallback, forceUpdate, setForceUpdate }) {
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const callback = openCallback ? openCallback : () => {}

    useEffect(() => {
        fetchPuzzles(currentPage)
            .then(response => {
                const { results, count } = response.data

                setPuzzles(results)
                setTotalPages(Math.ceil(count / 10))
            })
            .catch(err => { })
    }, [currentPage])

    useEffect(() => {
        if (forceUpdate) {
            fetchPuzzles(1)
                .then(response => {
                    const { results, count } = response.data

                    setPuzzles(results)
                    setTotalPages(Math.ceil(count / 10))
                })
                .catch(err => { })
                setForceUpdate(false)
        }
    }, [forceUpdate])

    const DifficultyLUTs = {
        E: { color: 'bg-green-500', label: "Easy" },
        M: { color: 'bg-yellow-500', label: "Medium" },
        H: { color: 'bg-red-500', label: "Hard" },
    }

    return (
        <div className="container mx-auto p-4">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Difficulty</TableHead>
                        <TableHead>Categories</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {puzzles ? puzzles.map((puzzle) => (
                        <TableRow key={puzzle.id} onClick={() => callback(puzzle.id)}>
                            <TableCell>{puzzle.title}</TableCell>
                            <TableCell>
                                <Badge className={`${DifficultyLUTs[puzzle.difficulty].color} text-white`}>
                                    {DifficultyLUTs[puzzle.difficulty].label}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-wrap gap-1">
                                    {puzzle.categories.map((category, index) => (
                                        <Badge key={index} variant="outline">{category}</Badge>
                                    ))}
                                </div>
                            </TableCell>
                        </TableRow>
                    )) : null}
                </TableBody>
            </Table>
            <div className="flex justify-between items-center mt-4">
                <div className="flex space-x-2">
                    <Button
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                        title="First Page"
                    >
                        <ChevronFirst className="h-4 w-4" />
                    </Button>
                    <Button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>
                </div>
                <span>Page {currentPage} of {totalPages > 0 ? totalPages : 1}</span>
                <div className="flex space-x-2">
                    <Button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </Button>
                    <Button
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                        title="Last Page"
                    >
                        <ChevronLast className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}