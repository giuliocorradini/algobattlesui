import { useState } from "react"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "./ui/table"
import { Button } from "./ui/button"
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react"
import { Badge } from "./ui/badge"
import PaginatedPuzzleTable from "../../components/paginatedPuzzleTable"

export default function PaginatedSearchResultsTable({ puzzles, fetchPuzzles, setPuzzles, openProblem }) {
    return <PaginatedPuzzleTable puzzles={puzzles} setPuzzles={setPuzzles} fetchPuzzles={fetchPuzzles}></PaginatedPuzzleTable>
}