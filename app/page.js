/**
 * v0 by Vercel.
 * @see https://v0.dev/t/rx31yL2PNpp
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { SwordsIcon, ChevronRightIcon, PlusIcon, BookmarkIcon, PuzzleIcon, MenuIcon, CircleUserIcon } from "lucide-react"

function LoggedInActions() {
  return <>
    <Button variant="ghost" className="justify-start gap-2 px-3 py-2 text-left">
      <BookmarkIcon className="h-4 w-4" />
      <span>Saved</span>
    </Button>
    <Button variant="ghost" className="justify-start gap-2 px-3 py-2 text-left">
      <PuzzleIcon className="h-4 w-4" />
      <span>Discover</span>
    </Button>
  </>
}

function AnonumousActions() {
  return <>
    <Button variant="ghost" className="justify-start gap-2 px-3 py-2 text-left">
      <CircleUserIcon className="h-4 w-4" />
      <span>Login</span>
    </Button>
  </>
}

function Actions({ isLogged }) {
  if (isLogged)
    return <LoggedInActions></LoggedInActions>
  else
    return <AnonumousActions></AnonumousActions>
}

function CategoryElement({ name, link }) {
  return <>
    <Link
      href={link}
      className="flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground"
      prefetch={false}
    >
      <span>{name}</span>
      <ChevronRightIcon className="h-4 w-4" />
    </Link>
  </>
}

function PuzzleCollectionCard({ title, difficulty, categories, pk }) {
  return <Card className="w-[200px] shrink-0">
    <CardContent className="flex aspect-[3/4] items-center justify-center rounded-md bg-background p-4">
      <img
        src="/placeholder.svg"
        alt="Puzzle"
        className="aspect-[3/4] w-full rounded-md object-cover"
        width="200"
        height="300"
      />
    </CardContent>
    <CardFooter>
      <div className="text-sm font-medium">{title}</div>
      <div className="text-xs text-muted-foreground">{difficulty}</div>
    </CardFooter>
  </Card>
}

function PuzzleCollection({ collectionName, content }) {
  return <section>
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold">{collectionName}</h2>
      <Link href="#" className="text-sm font-medium text-primary hover:underline" prefetch={false}>
        View all
      </Link>
    </div>
    <div className="mt-4 flex gap-4 overflow-auto">

      {content.map((p, i) => {
        return <PuzzleCollectionCard key={i} {...p}></PuzzleCollectionCard>
      })}

    </div>
  </section>
}

function AccountButton({username, email, image}) {
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="icon" className="rounded-full">
        <img
          src={image}
          width="32"
          height="32"
          className="rounded-full"
          alt="Avatar"
          style={{ aspectRatio: "32/32", objectFit: "cover" }}
        />
        <span className="sr-only">Toggle user menu</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem>{username}</DropdownMenuItem>
      <DropdownMenuItem>{email}</DropdownMenuItem>
      <DropdownMenuItem>My Account</DropdownMenuItem>
      <DropdownMenuItem>Settings</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem>Logout</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
}

export default function Home() {
  const highlight_categories = [
    { name: "Greedy", link: "greedy" },
    { name: "Divide and conquer", link: "dac" },
    { name: "Tree", link: "tree" },
    { name: "Computational geometry", link: "geom" }
  ]

  return (
    <div className="flex min-h-screen w-full">
      <aside className="hidden w-64 shrink-0 border-r bg-background md:flex flex-col">
        <div className="sticky top-0 flex h-14 items-center justify-between border-b px-4">
          <Link href="#" className="flex items-center gap-2 font-bold" prefetch={false}>
            <SwordsIcon className="h-6 w-6" />
            AlgoBattles
          </Link>
        </div>
        <nav className="flex flex-1 flex-col space-y-1 overflow-auto p-4">
          <div className="px-2 text-xs font-medium text-muted-foreground">Categories</div>

          {highlight_categories.map((cat, i) => {
            return <CategoryElement {...cat} key={i}></CategoryElement>
          })}

          <div className="mt-4 px-2 text-xs font-medium text-muted-foreground">Actions</div>
          <Actions isLogged={false}></Actions>
        </nav>
      </aside>

      <div className="flex-1 bg-muted/40">
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-white px-4 md:px-6">

          <div className="relative flex items-center">
            <div className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search puzzles..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
            />
          </div>
         
        </header>

        <main className="grid gap-4 p-4 md:p-6">

          <PuzzleCollection collectionName="Interview for FAANG" content={[
            { title: "Infinite stairs", difficulty: "Easy", pk: 20, categories: ["Tree", "Recursive"] }
          ]}></PuzzleCollection>

        </main>
      </div>
    </div>
  )
}
