import { Card, CardContent, CardFooter } from "./ui/card"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"

//TODO: show categories
export function PuzzleCollectionCard({ title, difficulty, categories, id: pk, problemCallback }) {
    return <Card className="w-[200px] shrink-0">
        <CardContent className="flex aspect-[3/4] items-center justify-center rounded-md bg-background p-4">
            <img
                src="/placeholder.svg"
                alt="Puzzle"
                className="aspect-[3/4] w-full rounded-md object-cover"
                width="200"
                height="300"
            />
        </CardContent>
        <CardFooter>
            <div className="text-sm font-medium">{title}</div>
            <div className="text-xs text-muted-foreground">{difficulty}</div>
        </CardFooter>
        <Link onClick={() => problemCallback(pk)}>Open</Link>
    </Card>
}

/**
 * 
 * @param {*} openProblem Callback for the "Open" label of a collection card. Defaults to redirect to
 * `editor/puzzle_key`
 * @returns 
 */
export default function PuzzleCollection({ collectionName, content, openProblem }) {
    const navigate = useNavigate()
    const problemCallback = (openProblem == null) ? (pk) => navigate(`editor/${pk}`) : openProblem

    return <section>
        <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{collectionName}</h2>
            <Link href="#" className="text-sm font-medium text-primary hover:underline">
                View all
            </Link>
        </div>
        <div className="mt-4 flex gap-4 overflow-auto">

            {content.map((p, i) => {
                return <PuzzleCollectionCard key={i} {...p} problemCallback={problemCallback}></PuzzleCollectionCard>
            })}

        </div>
    </section>
}