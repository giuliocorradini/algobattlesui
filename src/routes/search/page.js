import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { CiFilter } from "react-icons/ci"
import Link from "next/link"

function CategoryMenu({categories, selectedCategory, setSelectedCategory}) {
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
            <FilterIcon className="w-4 h-4" />
            <span>{selectedCategory ? selectedCategory : "Category"}</span>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuCheckboxItem
                checked={selectedCategory === ""}
                onCheckedChange={() => setSelectedCategory("")}
            >
            All
            </DropdownMenuCheckboxItem>

            { categories.map(c => 
                <DropdownMenuCheckboxItem
                    checked={selectedCategory === c}
                    onCheckedChange={() => setSelectedCategory({c})}
                >
                {c}
                </DropdownMenuCheckboxItem>
            )}
        </DropdownMenuContent>
    </DropdownMenu>
}

function PuzzleResult({id, title, difficulty, category, publisher}) {
    return <li key={id} className="bg-white rounded-lg shadow-md p-4">
    <h3 className="text-lg font-bold mb-2">{title}</h3>
    <div className="flex items-center mb-2">
      <Badge variant="outline" className="mr-2">
        {category}
      </Badge>
      <Badge variant="outline">{difficulty}</Badge>
      <Link href="#" className="ml-auto text-primary hover:underline" prefetch={false}>
        {publisher}
      </Link>
    </div>
  </li>
}

export default function SearchPage({puzzles, categories, results}) {

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Find Your Next Puzzle</h1>
        <div className="flex items-center mb-8 gap-4">
          <Input
            type="search"
            placeholder="Search puzzles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <CategoryMenu categories={categories} selectedCategory={""} setSelectedCategory={() => {}}></CategoryMenu>
          <div className="flex items-center gap-2">
            <CiFilter className="w-4 h-4" />
            <span>Difficulty: {difficulty}</span>
            <Slider value={[difficulty]} onValueChange={setDifficulty} min={1} max={5} step={1} className="w-32" />
          </div>
        </div>
        <ul className="space-y-4">
          {filteredPuzzles.map((puzzle) => (
           <PuzzleResult {...puzzle}></PuzzleResult>
          ))}
        </ul>
      </div>
    </div>
  )
}

function FilterIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  )
}


function SlidersVerticalIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="4" y1="21" y2="14" />
      <line x1="4" x2="4" y1="10" y2="3" />
      <line x1="12" x2="12" y1="21" y2="12" />
      <line x1="12" x2="12" y1="8" y2="3" />
      <line x1="20" x2="20" y1="21" y2="16" />
      <line x1="20" x2="20" y1="12" y2="3" />
      <line x1="2" x2="6" y1="14" y2="14" />
      <line x1="10" x2="14" y1="8" y2="8" />
      <line x1="18" x2="22" y1="16" y2="16" />
    </svg>
  )
}