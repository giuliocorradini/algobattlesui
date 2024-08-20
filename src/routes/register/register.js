import { Link } from "react-router-dom"
import { Button } from "../../components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card"
import { Label } from "../../components/ui/label"
import { AuthenticationContext, registerRequest } from "../../lib/api"
import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ErrorInput, NonBlankInput } from "../../components/errorfield"
import { useToast } from "../../components/ui/use-toast"
import ButtonLoading from "../../components/buttonloading"

function RegisterForm() {
  const [errors, setErrors] = useState({})
  const [isLoading, setLoading] = useState(false)
  const {isLogged, ...auth} = useContext(AuthenticationContext)
  const navigate = useNavigate()
  const {toast} = useToast()
  
  const hasErrors = (field) => field in errors
  const errorFor = (field) => errors[field]
  const errs = (field) => {return {
      error: hasErrors(field),
      errorLabel: errorFor(field)
  }}

  useEffect(() => {
    if (isLogged)
      navigate("/")
  })

  function handleSubmit(evt) {
    evt.preventDefault()

    setLoading(true)

    const formData = evt.target
    const username = formData.username.value
    const password = formData.password.value
    const email = formData.email.value
    const first_name = formData.first_name.value
    const last_name = formData.last_name.value

    if (isLogged)
      navigate("/") //failsafe if effect doesn't work

    registerRequest(username, password, email, first_name, last_name)
    .then(resp => {
      if (resp.status == 201) {
        navigate("/login")
        toast({
          title: "Registration",
          description: "Registration has been successful, please login with your username and password."
        })
      }
    })
    .catch(({response: {data}}) => setErrors(data))
    .finally(() => {setLoading(false)})
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-xl">Sign Up</CardTitle>
          <CardDescription>Enter your information to create an account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="first_name">First name</Label>
                <ErrorInput id="first_name" name="first_name" placeholder="John" {...errs("first_name")} required={false} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="last_name">Last name</Label>
                <ErrorInput id="last_name" name="last_name" placeholder="Appleseed" {...errs("last_name")} required={false} />
              </div>
            </div>
            <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <NonBlankInput name="username" id="username" placeholder="Choose a cool username..." {...errs("username")} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <NonBlankInput
                id="email"
                name="email"
                type="email"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <NonBlankInput name="password" id="password" type="password" {...errs("password")} />
            </div>
            {
              isLoading ? <ButtonLoading /> : <Button type="submit" className="w-full">Create an account</Button>
            }
          </div>
        </CardContent>
      </Card>
    </form>
  )
}

export default function RegisterPage() {
  return <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div>
      <RegisterForm />
      <p className="text-center mt-2 text-sm text-slate-500">Already have an account? <Link to="/login" className="text-slate-800">Sign in</Link></p>
    </div>
  </div>
}