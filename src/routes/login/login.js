import { redirect, useNavigate } from "react-router-dom"
import { Button } from "../../components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { AuthenticationContext, saveLocalStorageToken, loginRequest } from "../../lib/api"
import { useContext, useState } from "react"

function LoginForm() {
  const [isError, setError] = useState(false);
  const navigate = useNavigate();
  const auth = useContext(AuthenticationContext)

  if (auth.isLogged)
    navigate("/")

  function performLogin(evt) {
    evt.preventDefault()

    const formData = evt.target;
    const username = formData.username.value;
    const password = formData.password.value;

    loginRequest(username, password)
    .then((response) => {
      if (response.status == 200 && 'token' in response.data) {
        auth.setAuthentication([true, response.data.token]);
        saveLocalStorageToken(response.data.token)
        navigate("/")
      }
      else
        setError(true);
    })
    .catch(error => {
      setError(true);
    })
  }

  return (
    <form onSubmit={performLogin}>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            { isError ? "Cannot login with this username and password"
            : "Enter your email below to login to your account."}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input name="username" type="text" placeholder="Your username..." required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input name="password" type="password" required />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Sign in</Button>
        </CardFooter>
      </Card>
    </form>
  )
}

export default function LoginPage() {
  return <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <LoginForm />
  </div>
}