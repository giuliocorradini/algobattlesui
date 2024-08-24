import { Dialog, DialogHeader, DialogContent } from "../../components/ui/dialog"
import { Avatar, AvatarImage, AvatarFallback } from "../../components/ui/avatar"
import { Button } from "../../components/ui/button"
import { SiGithub, SiLinkedin } from "@icons-pack/react-simple-icons"

/**
 * Shows a skeleton instead of user information, waiting for user info from the API
 */
function SkeletonUserInfo() {
  //TODO
}

/**
 * Dialog shown in the lobby when selecting a user, asks if you're sure to send the request and
 * shows additional information on the user.
 */
export default function UserInfoDialog({ open, onOpenChange, user, handleSendChallenge }) {
  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-[425px]">
      {"username" in user ? (
        <>
          <DialogHeader>
          </DialogHeader>
          <div className="flex items-center space-x-4 mb-2">
            <Avatar className="w-16 h-16">
              <AvatarImage src={user.picture} alt={user.username} />
              <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold">{user.username}</h3>
            </div>
          </div>
          <div className="space-y-2">
            {
              user.github != "" && <div className="flex items-center space-x-2">
                <SiGithub className="w-5 h-5 text-muted-foreground text-slate-950" />
                <span>{user.github}</span>
              </div>
            }
            {
              user.linkedin && <div className="flex items-center space-x-2">
                <SiLinkedin className="w-5 h-5 text-muted-foreground text-slate-950" />
                <span>{user.linkedin}</span>
              </div>
            }
          </div>
          <Button className="w-full" onClick={() => {
            onOpenChange(false)
            handleSendChallenge()
          }}>
            Send Challenge Request
          </Button>
        </>
      ) : <></>}
    </DialogContent>
  </Dialog>
}
