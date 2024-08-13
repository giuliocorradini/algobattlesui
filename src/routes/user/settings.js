import { Button } from "../../components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card"
import { Label } from "../../components/ui/label"
import { Input } from "../../components/ui/input"
import { Avatar, AvatarImage, AvatarFallback } from "../../components/ui/avatar"
import { Switch } from "../../components/ui/switch"
import { Link } from "react-router-dom"
import { FrameIcon } from "lucide-react"
import { AccountButton } from "../home"

function Header() {
    return <header className="flex items-center h-16 px-4 border-b shrink-0 md:px-6">
                <Link href="#" className="flex items-center gap-2 text-lg font-semibold sm:text-base mr-4" prefetch={false}>
                    <FrameIcon className="w-6 h-6" />
                    <span className="sr-only">Acme Inc</span>
                </Link>
                <nav className="hidden font-medium sm:flex flex-row items-center gap-5 text-sm lg:gap-6">
                    <Link href="#" className="text-muted-foreground" prefetch={false}>
                        Projects
                    </Link>
                    <Link href="#" className="text-muted-foreground" prefetch={false}>
                        Deployments
                    </Link>
                    <Link href="#" className="text-muted-foreground" prefetch={false}>
                        Analytics
                    </Link>
                    <Link href="#" className="font-bold" prefetch={false}>
                        Settings
                    </Link>
                </nav>
                    <AccountButton></AccountButton>
                <div className="flex items-center w-full gap-4 md:ml-auto md:gap-2 lg:gap-4">
                </div>
            </header>
}

export default function SettingsPage() {
    return (
        <div className="flex flex-col w-full min-h-screen bg-muted/40">
            <Header></Header>
            <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
                <div className="max-w-6xl w-full mx-auto grid gap-2">
                    <h1 className="font-semibold text-3xl">Settings</h1>
                </div>
                <div className="grid md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr] items-start gap-6 max-w-6xl w-full mx-auto">
                    <nav className="text-sm text-muted-foreground grid gap-4">
                        <Link href="#" className="font-semibold text-primary" prefetch={false}>
                            Profile
                        </Link>
                        <Link href="#" prefetch={false}>
                            Password
                        </Link>
                    </nav>
                    <div className="grid gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Profile</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="username">Username</Label>
                                    <Input id="username" defaultValue="johndoe" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" defaultValue="john@example.com" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="firstName">First Name</Label>
                                        <Input id="firstName" defaultValue="John" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="lastName">Last Name</Label>
                                        <Input id="lastName" defaultValue="Doe" />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label>Profile Picture</Label>
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-16 w-16">
                                            <AvatarImage src="/placeholder-user.jpg" alt="../..shadcn" />
                                            <AvatarFallback>JD</AvatarFallback>
                                        </Avatar>
                                        <Button variant="outline" size="sm">
                                            Upload
                                        </Button>
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="address">Github Profile</Label>
                                    <Input id="address" defaultValue="@github" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="address">Linkedin</Label>
                                    <Input id="address" defaultValue="@linkedin" />
                                </div>
                                <div className="grid gap-2">
                                    <Button size="sm">Update</Button>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Password</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input id="password" type="password" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="password">Repeat password</Label>
                                    <Input id="password" type="password" />
                                </div>
                            </CardContent>
                            <CardContent className="grid gap-6">
                                <Button variant="destructive">Delete Account</Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    )
}
