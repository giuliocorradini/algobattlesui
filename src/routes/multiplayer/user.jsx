import { Card, CardContent } from "../../components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "../../components/ui/avatar"

export function UserCard({user, sendRequest}) {
    return <Card key={user.id} className="bg-card" onClick={sendRequest}>
        <CardContent className="p-4 flex flex-col items-center">
            <Avatar className="w-20 h-20 mb-2">
                <AvatarImage src={user.picture} alt={user.username} />
                <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-center">{user.username}</span>
        </CardContent>
    </Card>
}