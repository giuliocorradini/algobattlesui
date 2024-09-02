import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { useNavigate } from "react-router-dom"

export function PuzzleCollectionCard({ title, difficulty, categories, id: pk, problemCallback }) {
    const difficultyColors = {
        E: "bg-green-500",
        M: "bg-yellow-500",
        H: "bg-red-500",
    }

    return (
        <Card className="w-full max-w-sm h-[300px] flex flex-col justify-between">
            <CardHeader>
                <CardTitle className="text-center">{title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col items-center gap-4">
                <Badge className={`${difficultyColors[difficulty]} text-white`}>
                    {difficulty}
                </Badge>
                <Button onClick={() => problemCallback(pk)}>Open</Button>
                <div className="flex flex-wrap justify-center gap-2">
                    {categories.map((category, index) => (
                        <Badge key={index} variant="outline">
                            {category}
                        </Badge>
                    ))}
                </div>
            </CardContent>
            <CardFooter className="flex justify-center">
            </CardFooter>
        </Card>
    )
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