'use client'

import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { registerRequest } from "@/lib/api"
import { useState } from "react"

export default function RegisterForm() {
  const [isError, setError] = useState(false);
  const [isRegistered, setRegistered] = useState(false);

  function handleSubmit(formData) {
    const username = formData.get("username")
    const password = formData.get("password")
    const email = formData.get("email")

    registerRequest(username, password, email)
    .then(resp => {
      if (resp.status == 200)
        setRegistered(true)
      else
        setError(true);
    })
    .catch(err => setError(true)) //TODO check error type and reason
  }

  return (
    <form action={handleSubmit}>
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Sign Up</CardTitle>
          <CardDescription>
            {isError?"User already exists":"Enter your information to create an account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="first-name">First name</Label>
                <Input id="first-name" placeholder="Max"  />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="last-name">Last name</Label>
                <Input id="last-name" placeholder="Robinson"  />
              </div>
            </div>
            <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input name="username" id="username" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input name="password" id="password" type="password" />
            </div>
            <Button type="submit" className="w-full">
              Create an account
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
