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
import { client, loginRequest, setToken } from "../../lib/api"
import { useState } from "react"

export default function LoginForm() {
  const [isError, setError] = useState(false);
  const navigate = useNavigate();

  function performLogin(evt) {
    evt.preventDefault()

    const formData = evt.target;
    const username = formData.username.value;
    const password = formData.password.value;

    loginRequest(username, password)
    .then((response) => {
      if (response.status == 200 && 'token' in response.data) {
        setToken(response.data.token);
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
