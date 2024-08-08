'use client'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer"
import { OctagonX, CircleCheck, ChevronDownIcon, CodeIcon } from "lucide-react"
import { useState } from "react"

function LanguageSelector({ supportedLanguages, language, setLanguage }) {
  return <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" className="flex items-center gap-2">
        <CodeIcon className="w-5 h-5" />
        <span>{language}</span>
        <ChevronDownIcon className="w-4 h-4 text-muted-foreground" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="start">
      {supportedLanguages.map((lang, i) => {
        return <DropdownMenuItem key={i} onClick={() => setLanguage(lang)}>{lang}</DropdownMenuItem>
      })}
    </DropdownMenuContent>
  </DropdownMenu>
}

function PuzzleText({ title, description, example: { givenInput, expectedOutput }, constr: { mem, cpu } }) {
  return <div className="bg-muted p-6 overflow-auto">
    <h2 className="text-2xl font-bold mb-4">Coding Problem</h2>
    <div className="prose text-muted-foreground">
      <p>
        {description}
      </p>

      <h3>Example</h3>
      <p>
        For <code>{givenInput}</code>, the output should be <code>{expectedOutput}</code>.
      </p>

      <h3>Constraints</h3>
      <p>
        Memory <code>{mem}</code>
      </p>
      <p>
        CPU time <code>{cpu}</code>
      </p>
    </div>
  </div>
}

function AttemptsDrawer({attempts}) {
  function Attempt({id, result: {isPassed, total, passedTests}}) {
    return <div className="flex items-start gap-4">
          <div className={"flex h-8 w-8 items-center justify-center rounded-full text-primary-foreground font-medium " + (isPassed ? "bg-green-600" : "bg-red-600")}>
            { isPassed ? <CircleCheck /> : <OctagonX />}
          </div>
          <div>
            <div className="font-medium">Attempt {id}</div>
            <div className="text-muted-foreground text-sm">Passed {passedTests} out of {total} tests</div>
          </div>
        </div>
  }

  return <Drawer>
    <DrawerTrigger asChild>
      <Button variant="ghost">Attempts</Button>
    </DrawerTrigger>
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>Attempts</DrawerTitle>
        <DrawerDescription>View your previous attempts.</DrawerDescription>
      </DrawerHeader>
      <div className="px-4 py-6 space-y-4">

        {attempts.map((att, i) => {
          return <Attempt key={i} result={{...att}}></Attempt>
        })}
        
      </div>
    </DrawerContent>
  </Drawer>
}

export default function EditorPage() {
  const [language, setLanguage] = useState("C")

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-background border-b flex items-center justify-between px-4 py-2 shadow-sm">
        <div className="flex items-center gap-4">
          <LanguageSelector supportedLanguages={["C", "C++", "Java"]} language={language} setLanguage={setLanguage}></LanguageSelector>
        </div>
        <div className="flex items-center gap-4">
          <Button>Build</Button>
          <AttemptsDrawer attempts={[
            {isPassed: false, total: 5, passedTests: 3},
            {isPassed: true, total: 5, passedTests: 5}
          ]}></AttemptsDrawer>
        </div>
      </header>
      <div className="flex-1 grid grid-cols-[1fr_2fr]">

        <PuzzleText title="Feng shui" description="Problem description" example={{
          givenInput: "[1,2,3,4]", expectedOutput: "99"
        }} constr={{ mem: "512M", cpu: "200 sec" }}></PuzzleText>

        <div className="bg-background p-6 overflow-auto">
          <Textarea
            placeholder="Write your code here..."
            className="w-full h-full resize-none border-none focus:ring-0 focus:outline-none"
          />
        </div>
      </div>
    </div>
  )
}
