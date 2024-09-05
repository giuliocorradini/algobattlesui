import { Link, useNavigate } from "react-router-dom"
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
import { useContext, useEffect, useState } from "react"
import { TriangleAlertIcon } from "lucide-react"
import { Callout } from "@radix-ui/themes"
import ButtonLoading from "../../components/buttonloading"
import { Toaster } from "../../components/ui/toaster"

function InvalidCredentialsCallout() {
  return <Callout.Root color="red" role="alert">
    <Callout.Icon>
      <TriangleAlertIcon size={16} />
    </Callout.Icon>
    <Callout.Text>
      Cannot log in with provided credentials.
    </Callout.Text>
  </Callout.Root>
}

function LoginForm() {
  const [isError, setError] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();
  const auth = useContext(AuthenticationContext)

  useEffect(() => {
    if (auth.isLogged)
      navigate("/")
  })

  function performLogin(evt) {
    evt.preventDefault()

    setLoading(true)

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
        setError(true)
    })
    .catch(error => {
      setError(true)
    })
    .finally(() => {setLoading(false)})
  }

  return (
    <form onSubmit={performLogin}>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your credentials below to login to your account.</CardDescription>
          {isError ? <InvalidCredentialsCallout /> : <></>}
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input name="username" type="text" placeholder="Your username..." required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input name="password" type="password" placeholder="Your password..." required />
          </div>
        </CardContent>
        <CardFooter>{
          isLoading ?
            <ButtonLoading className="w-full" /> :
            <Button className="w-full">Sign in</Button>
        }</CardFooter>
      </Card>
    </form>
  )
}

export default function LoginPage() {
  return <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div>
      <LoginForm />
      <p className="text-center mt-2 text-sm text-slate-500">Don't have an account? <Link className="text-slate-800" to="/register">Sign up</Link></p>
    </div>
    <Toaster />
  </div>
}