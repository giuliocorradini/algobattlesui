import { Dialog, DialogTitle, DialogHeader, DialogContent } from "../../components/ui/dialog"
import { Avatar, AvatarImage, AvatarFallback } from "../../components/ui/avatar"
import { Trophy, Frown } from "lucide-react"

function WinnerLabel() {
    return [<Trophy className="w-5 h-5 text-yellow-500" />,
        <span className="text-sm font-medium text-green-600">Winner</span>]
}

function LoserLabel() {
    return [<Frown className="w-5 h-5 text-gray-500" />,
        <span className="text-sm font-medium text-red-600">Loser</span>]
}

/**
 * Dialog when the game ends
 * @param winner: true if I won myself, false if my rival won (and I lose)
 */
export default function EndDialog({ open, onOpenChange, myself, rival, winner }) {
    return (
        <div className="flex justify-center items-center bg-background">
          <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-center mb-4">Game Result</DialogTitle>
              </DialogHeader>
              <div className="flex justify-between items-start space-x-4">
                <div className="flex flex-col items-center space-y-2">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={myself.picture} alt={myself.username} />
                    <AvatarFallback>{myself.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="font-semibold text-center">{myself.username}</span>
                  <div className="flex items-center space-x-1">
                    {winner ? <WinnerLabel /> : <LoserLabel />}
                  </div>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={rival.picture} alt={rival.username} />
                    <AvatarFallback>{rival.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="font-semibold text-center">{rival.username}</span>
                  <div className="flex items-center space-x-1">
                    {!winner ? <WinnerLabel /> : <LoserLabel />}
                  </div>
                </div>
              </div>
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Congratulations to {winner ? myself.username : rival.username} on their victory!
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )
}
