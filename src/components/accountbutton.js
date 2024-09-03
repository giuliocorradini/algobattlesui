import { useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "../components/ui/dropdown-menu"
import {  UserRound } from "lucide-react"
import { AuthenticationContext, invalidateLocalStorageToken, logoutRequest } from "../lib/api"
import { useContext } from "react"

export function AccountButton({username, email, picture}) {
    const navigate = useNavigate();
    const auth = useContext(AuthenticationContext)
  
    function handleLogout() {
      logoutRequest().then(response => {}).catch(error => {})
      invalidateLocalStorageToken()
      auth.setAuthentication([false, null])
      navigate("/")
    }
  
    function DefaultUserImage() {
      return <UserRound
        width="32"
        height="32"
        className="rounded-full"
        alt="Avatar"
        style={{ aspectRatio: "32/32", objectFit: "cover" }}
      />
    }
  
    if (auth.isLogged === false)
      return <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <DefaultUserImage />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => navigate("/login")}>Login</DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/register")}>Register</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
  
    return <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          {
            picture === null ? <DefaultUserImage /> :
            <img
              src={picture}
              width="32"
              height="32"
              className="rounded-full"
              alt="Avatar"
              style={{ aspectRatio: "32/32", objectFit: "cover" }}
            />
          }
          <span className="sr-only">Toggle user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="font-bold data-[disabled]:opacity-100" disabled>{username}</DropdownMenuItem>
        <DropdownMenuItem className="data-[disabled]:opacity-100" disabled>{email}</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate("/settings")}>Settings</DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  }