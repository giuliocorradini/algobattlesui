'use client'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "../../components/ui/dropdown-menu"
import { Button } from "../../components/ui/button"
import { Textarea } from "./textarea"
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "../../components/ui/drawer"
import { OctagonX, CircleCheck, ChevronDownIcon, CodeIcon, CheckIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { getPreviousAttempts, getPuzzle, getPuzzlePublicTests, puzzleAttemptRequest } from "../../lib/api/puzzle"
import { useParams } from "react-router-dom"
import { AuthenticationContext, CurrentUserContext } from "../../lib/api"
import { useContext } from "react"
import { HomeButton } from "../../components/homebutton"
import { FetchUserInfo } from "../../lib/api/user"
import { AccountButton } from "../home"

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

function PuzzleText({ title, description, example, constr: { mem, cpu } }) {
  function Example() {
    if (example === undefined)
      return <p>
        No additional examples available.
      </p>
    else
      return <>
        <p>
          For <code>{example.input}</code>
        </p>
        <p>
          the output should be <code>{example.output}</code>
        </p>
      </>
  }

  return <div className="bg-muted p-6 overflow-auto">
    <h2 className="text-2xl font-bold mb-4">{title}</h2>
    <div className="prose text-muted-foreground">
      <p>
        {description}
      </p>

      <h3>Example</h3>
      <Example />

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
          return <Attempt key={i} id={i} result={{...att}} isPassed={att.passed}></Attempt>
        })}
        
      </div>
    </DrawerContent>
  </Drawer>
}

function CompletionStatus({attempts}) {
  const isCompleted = attempts.some(a => a.passed)

  if (isCompleted)
    return <div className="flex">
      <p>Completed</p>
      <CheckIcon className="ml-2 stroke-green-600"/>
    </div>
  else
    return <></>
}

export default function EditorPage() {
  const [language, setLanguage] = useState("C")
  const [errorMessage, setErrorMessage] = useState("")
  const [problemDescription, setProblemDescription] = useState({})
  const [publicTests, setPublicTests] = useState([])
  const [editorContent, setEditorContent] = useState("")
  const lineCount = editorContent.split("\n").length
  const [attempts, setAttempts] = useState([])

  const { pk } = useParams();

  const exampleTest = publicTests.at(0)

  const {isLogged, token, ...auth} = useContext(AuthenticationContext)
  const {user, setUser} = useContext(CurrentUserContext)

  useEffect(() => {
    getPuzzle(pk).then(response => {
      setProblemDescription(response.data)
    })
    .catch(err => {
      setErrorMessage(err)
    })

    getPuzzlePublicTests(pk).then(response => {
      setPublicTests(response.data)
    })
    .catch(err => setErrorMessage(err))

    getPreviousAttempts(pk, auth.token).then(response => {
      setAttempts(response.data)
    })
    .catch(err => setErrorMessage(err))
  }, [])

  useEffect(() => {
    if (isLogged) {
      FetchUserInfo(token).then((response) => {
        if (response.status === 200)
          setUser(response.data)
      }).catch(err => {})
    }
  }, [isLogged])

  function sendAttempt() {
    puzzleAttemptRequest(pk, auth.token, language, editorContent)
    .then(response => {
      //TODO: update DOM to display a new attempt
      console.log("Sent!")
    })
    .catch(err => {
      //TODO: may show a popup error message
      setErrorMessage(err)
    })
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-background border-b flex items-center justify-between px-4 py-2 shadow-sm">
        <div className="flex items-center gap-4">
          <HomeButton />
        </div>
        <div className="flex items-center gap-4">
          <CompletionStatus  attempts={attempts}/>
          <LanguageSelector supportedLanguages={["C", "C++", "Java"]} language={language} setLanguage={setLanguage}></LanguageSelector>
          <Button onClick={sendAttempt}>Build</Button>
          <AttemptsDrawer attempts={attempts}></AttemptsDrawer>
          <AccountButton username={user.username} email={user.email} picture={user.picture}></AccountButton>
        </div>
      </header>
      <div className="flex-1 grid grid-cols-[1fr_2fr]">

        <PuzzleText title={problemDescription.title} description={problemDescription.description} example={exampleTest} constr={{ mem: problemDescription.memory_constraint, cpu: problemDescription.time_constraint }}></PuzzleText>

        <div className="relative bg-background p-6 overflow-auto">
          <div className="absolute top-0 left-0 w-8 bg-gray-100 text-gray-500 text-right pr-2 pt-2 pb-2 select-none">
            {Array.from({ length: lineCount }, (_, i) => (
              <div key={i + 1}>{i + 1}</div>
            ))}
          </div>
          <Textarea
            value={editorContent}
            onChange={e => setEditorContent(e.target.value)}
            placeholder="Write your code here..."
            className="w-full h-full resize-none border-none focus:ring-0 focus:outline-none font-mono"
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="off"
            autoComplete="off"
          />
        </div>
      </div>
    </div>
  )
}
