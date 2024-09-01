import { Card, CardContent, CardFooter } from "./ui/card"
import { Link } from "react-router-dom"

export function PuzzleCollectionCard({ title, difficulty, categories, id: pk }) {
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
        <Link to={`editor/${pk}`} >Open</Link>
    </Card>
}

export default function PuzzleCollection({ collectionName, content }) {
    return <section>
        <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{collectionName}</h2>
            <Link href="#" className="text-sm font-medium text-primary hover:underline">
                View all
            </Link>
        </div>
        <div className="mt-4 flex gap-4 overflow-auto">

            {content.map((p, i) => {
                return <PuzzleCollectionCard key={i} {...p}></PuzzleCollectionCard>
            })}

        </div>
    </section>
}