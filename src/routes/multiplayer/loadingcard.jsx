import { Card, CardContent } from "../../components/ui/card"
import { Loader2 } from "lucide-react"

export default function LoadingCard() {
    return (
        <div className="flex-grow flex items-center justify-center">
            <Card className="w-full max-w-md">
                <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-lg font-medium text-center text-foreground">
                        The opponent is choosing the problem
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}