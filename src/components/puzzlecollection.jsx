import { Card, CardContent, CardFooter } from "./ui/card"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"

//TODO: show categories
export function PuzzleCollectionCard({ title, difficulty, categories, id: pk, problemCallback }) {
    return <Card className="w-[200px] flex-shrink-0">
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
export default function PuzzleCollection({ collectionName, content, openProblem, seeAll }) {
    const navigate = useNavigate()
    const problemCallback = (openProblem == null) ? (pk) => navigate(`editor/${pk}`) : openProblem
    const seeAllCallback = (seeAll == null) ? () => navigate(`/show?cat=${collectionName}`) : seeAll

    return <div className="w-full">
        <h2 onClick={seeAllCallback} className="text-lg font-semibold pb-4">{collectionName}</h2>
        <div className="flex flex-nowrap overflow-x-auto space-x-4">

            {content.map((p, i) => {
                return <PuzzleCollectionCard key={i} {...p} problemCallback={problemCallback}></PuzzleCollectionCard>
            })}

        </div>
    </div>
}