import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { FetchPublishedPuzzles } from '../../lib/api/publisher'


export default function PaginatedPuzzleTable({token}) {
    const [puzzles, setPuzzles] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)


    function fetchPuzzles(page) {
        FetchPublishedPuzzles(token, page)
        .then(response => {
            const {results, count} = response.data

            setPuzzles(results)
            setTotalPages(Math.ceil(count / results.length))
        })
        .catch(err => {})
    }

    useEffect(() => {
        fetchPuzzles(currentPage)
    }, [currentPage])


    const DifficultyLUTs = {
        E: {color: 'bg-green-500', label: "Easy"},
        M: {color: 'bg-yellow-500', label: "Medium"},
        H: {color: 'bg-red-500', label: "Hard"},
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
                    {puzzles.map((puzzle) => (
                        <TableRow key={puzzle.id}>
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
                    ))}
                </TableBody>
            </Table>
            <div className="flex justify-between items-center mt-4">
                <Button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Previous
                </Button>
                <span>Page {currentPage} of {totalPages}</span>
                <Button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Next
                </Button>
            </div>
        </div>
    )
}