import { Card, CardContent } from "../../components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "../../components/ui/avatar"
import { Button } from "../../components/ui/button"

export function UserCard({user, clickAction}) {
    return <Card key={user.id} className="bg-card" onClick={clickAction}>
        <CardContent className="p-4 flex flex-col items-center">
            <Avatar className="w-20 h-20 mb-2">
                <AvatarImage src={user.picture} alt={user.username} />
                <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-center">{user.username}</span>
        </CardContent>
    </Card>
}

export function UserCardWithButton({user, acceptChallenge}) {
    return <Card key={user.id} className="bg-card" >
        <CardContent className="p-4 flex flex-col items-center">
            <Avatar className="w-20 h-20 mb-2">
                <AvatarImage src={user.picture} alt={user.username} />
                <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-center">{user.username}</span>
            <Button onClick={() => acceptChallenge()} variant="ghost" className="mt-2">Accept</Button>
        </CardContent>
    </Card>
}