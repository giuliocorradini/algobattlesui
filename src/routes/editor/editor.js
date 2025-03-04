import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "../../components/ui/dropdown-menu"
import { Button } from "../../components/ui/button"
import { Textarea } from "./textarea"
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from "../../components/ui/drawer"
import { OctagonX, CircleCheck, ChevronDownIcon, CodeIcon, CheckIcon, XIcon, TrophyIcon, FrownIcon, Hammer } from "lucide-react"
import { useEffect, useState } from "react"
import { getPreviousAttempts, getPuzzle, getPuzzlePublicTests, puzzleAttemptRequest, pollAttempt, puzzleAttemptRequestMultiplayer, getPreviousAttemptsMultiplayer } from "../../lib/api/puzzle"
import { useNavigate, useParams } from "react-router-dom"
import { AuthenticationContext, CurrentUserContext } from "../../lib/api"
import { useContext } from "react"
import { HomeButton } from "../../components/homebutton"
import { FetchUserInfo } from "../../lib/api/user"
import { AccountButton } from "../../components/accountbutton"
import { Toaster } from "../../components/ui/toaster"
import { useToast } from "../../components/ui/use-toast"
import { CompileResultsDrawer } from "./resultsdrawer"
import React from "react"
import { useChallenge } from "../multiplayer/challengecontext"
import { useMultiplayerWebsocket } from "../multiplayer/websocket"
import EndDialog from "./enddialog"
import { ScrollArea } from "@radix-ui/themes"


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

function PuzzleText({ title, description, examples, constr: { mem, cpu } }) {
  function Example({example}) {
    if (example === undefined)
      return <p>
        No additional examples available.
      </p>
    else
      return <div className="mb-2">
        <p>
          For:
          <br/><code className="text-slate-900">{example.input}</code>
        </p>
        <p>
          the expected output is:
          <br/><code className="text-slate-900">{example.output}</code>
        </p>
      </div>
  }

  return <div className="bg-muted p-6 overflow-auto">
    <h2 className="text-2xl font-bold mb-4">{title}</h2>
    <div className="prose text-muted-foreground">
      <p>
        {description}
      </p>

      {
        examples && examples.length > 0 ? [
          <h3 className="mt-4">Example{examples.length>1?"s":""}</h3>,
          examples.map((e, i) => <Example key={i} example={e} />)] :
          <h3 className="mt-4">No examples available</h3>
      }

      <h3 className="mt-4">Constraints</h3>
      <p>
        Memory <code>{mem}</code> bytes
      </p>
      <p>
        CPU time <code>{cpu}</code> µs
      </p>
    </div>
  </div>
}

function AttemptsDrawer({attempts}) {
  const Attempt = ({ id, results, passed, build_error }) => {
    const results_obj = build_error || results == "" ? {} : JSON.parse(results)
    const total = Object.keys(results_obj).length
    const passedTests = Object.entries(results_obj).map(([k, v]) => v).filter(v => v == "passed").map(s => 1).reduce((a, c) => a+c, 0)

    return <div className="flex items-start gap-4">
          <div className={"flex h-8 w-8 items-center justify-center rounded-full text-primary-foreground font-medium " + (passed ? "bg-green-600" : "bg-red-600")}>
            { passed ? <CircleCheck /> : (build_error ? <Hammer /> : <OctagonX />)}
          </div>
          <div>
            <div className="font-medium">Attempt {id}</div>
            <div className="text-muted-foreground text-sm">{
              build_error ? "Build error" : `Passed ${passedTests} out of ${total} tests`
  }</div>
          </div>
        </div>
  }



  return <Drawer>
    <DrawerTrigger asChild>
      <Button variant="ghost">Attempts</Button>
    </DrawerTrigger>
    <DrawerContent className="fixed bottom-0 left-0 right-0 max-h-screen">
      <ScrollArea>
      <DrawerHeader>
        <DrawerTitle>Attempts</DrawerTitle>
        <DrawerDescription>View your previous attempts.</DrawerDescription>
      </DrawerHeader>
      <DrawerFooter>
      <div className="px-4 py-6 space-y-4">

        {attempts.map((att, i) => {
          return <Attempt key={i} id={i} {...att}></Attempt>
        })}
        
      </div>
      </DrawerFooter>

      </ScrollArea>
    </DrawerContent>
  </Drawer>
}

function Linecounter({lineCount}) {
  return <div className="absolute top-0 left-0 min-h-full bg-muted text-gray-500 text-right pr-2 pt-2 select-none text-sm font-mono">
    <div className="">
      {Array.from({ length: lineCount }, (_, i) => (
        <div key={i + 1}>{i + 1}</div>
      ))}

    </div>
  </div>
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


export default function EditorPage({multiplayer}) {
  const [language, setLanguage] = useState("C")
  const [problemDescription, setProblemDescription] = useState({})
  const [publicTests, setPublicTests] = useState([])
  const [editorContent, setEditorContent] = useState("")
  const lineCount = editorContent.split("\n").length
  const [attempts, setAttempts] = useState([])

  const { pk } = useParams();

  const {isLogged, token, ...auth} = useContext(AuthenticationContext)
  const {user, setUser} = useContext(CurrentUserContext)

  const { challenge, opponent } = useChallenge()

  const [lastAttempt, setLastAttempt] = useState({
    results: null,
    build_error: false,
    passed: false
  });

  const navigate = useNavigate()

  const {toast} = useToast()

  function setErrorMessage(error) {
    toast({
      title: "Error",
      description: error,
      variant: "destructive"
    })
  }

  useEffect(() => {
    if (user.is_publisher) {
      navigate("/")
      toast({
        title: "Unauthorized",
        description: "You can't use the editor and submit solutions if you are using a publisher account",
        variant: "destructive"
      })
      return
    }


    getPuzzle(pk).then(response => {
      setProblemDescription(response.data)
    })
    .catch(err => {
      navigate("/")
      setErrorMessage(err.response.data.detail)
    })

    getPuzzlePublicTests(pk).then(response => {
      setPublicTests(response.data)
    })
    .catch(err => {})

    let attemptsRequest = multiplayer ? getPreviousAttemptsMultiplayer(pk, token, challenge) : getPreviousAttempts(pk, token)
    attemptsRequest.then(response => {
      setAttempts(response.data)
    })
    .catch(err => {})
  }, [])

  useEffect(() => {
    if (isLogged) {
      FetchUserInfo(token).then((response) => {
        if (response.status === 200)
          setUser(response.data)
      }).catch(err => {})
    }
  }, [isLogged])

  const [{waitingResponse, attemptId}, setResponseStatus] = useState({
    waitingResponse: false,
    attemptId: null
  })
  const updateResponseStatus = (update) => setResponseStatus({waitingResponse, attemptId, ...update})

  function sendAttempt() {
    setResponseStatus({waitingResponse: false})
    
    let request = multiplayer ?
      puzzleAttemptRequestMultiplayer(pk, token, language, editorContent, challenge) :
      puzzleAttemptRequest(pk, token, language, editorContent)

    request
    .then(response => {      
      toast({
        title: "Build message",
        description: "Your attempt was successfully submitted"
      })

      setResponseStatus({
        waitingResponse: true,
        attemptId: response.data.id
      })
    })
    .catch(err => {
      if (err.response.status == 401)
        toast({
          title: "Unauthorized",
          description: "You must log in to submit a solution.",
          variant: "destructive"
        })
      else
        toast({
          title: "Build error",
          description: "There was an error submitting your attempt. Please retry.",
          variant: "destructive"
        })
    })
  }

  function pollAttemptResponse() {
    pollAttempt(attemptId, token)
      .then(response => {
        if (response.data.passed == true) {
          setLastAttempt({ ...lastAttempt, results: null })
          updateResponseStatus({waitingResponse: false})

          toast({
            title: "Tests passed",
            description: "Your solution has passed all the tests."
          })

          setAttempts(attempts.concat(response.data))
        } else if (response.data.passed == false && response.data.results != "") {
          toast({
            title: "Build error",
            description: "There was an error building your attempt. Check the error drawer.",
            variant: "destructive"
          })

          setLastAttempt(response.data)
          updateResponseStatus({ waitingResponse: false })

          setAttempts(attempts.concat(response.data))
        } else if (response.data.results == "") {
          updateResponseStatus({ waitingResponse: true })
        }
      })
      .catch(err => {
        console.log()
      })

      updateResponseStatus({ waitingResponse: false })
  }

  useEffect(() => {
    if(waitingResponse) {
      let id = setTimeout(pollAttemptResponse, 1000)

      return () => {
        clearTimeout(id)
      }
    }
  }, [waitingResponse])

  const [{challengeOngoing, amITheWinner}, setChallengeStatus] = useState({challengeOngoing: true, amITheWinner: false})

  const {lastJsonMessage, sendJsonMessage} = useMultiplayerWebsocket()

  const [openEndDialog, setOpenEndDialog] = useState(false)

  useEffect(() => {
    if (multiplayer && "stop" in lastJsonMessage) {
      const {stop: {result}} = lastJsonMessage
      setChallengeStatus({
        challengeOngoing: false,
        amITheWinner: (result == "winner")
      })
      setOpenEndDialog(true)
    }
  }, [lastJsonMessage])

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-background border-b flex items-center justify-between px-4 py-2 shadow-sm">
        <div className="flex items-center gap-4">
          <HomeButton />
        </div>
        {multiplayer ? <div>
          Challenge with {opponent.username}. {challengeOngoing ? "Ongoing." : (amITheWinner ? "You won." : "You lose.")}
        </div> : <></>}
        <div className="flex items-center gap-4">
          <CompletionStatus  attempts={attempts}/>
          <LanguageSelector supportedLanguages={["C", "C++"]} language={language} setLanguage={setLanguage}></LanguageSelector>
          <Button onClick={sendAttempt} disabled={multiplayer && !challengeOngoing}>Build</Button>
          <AttemptsDrawer attempts={attempts}></AttemptsDrawer>
          <AccountButton username={user.username} email={user.email} picture={user.picture}></AccountButton>
        </div>
      </header>
      <div className="flex-1 grid grid-cols-[1fr_2fr] overflow-auto">

        <PuzzleText title={problemDescription.title} description={problemDescription.description} examples={publicTests} constr={{ mem: problemDescription.memory_constraint, cpu: problemDescription.time_constraint }}></PuzzleText>

        <div className="relative bg-background p-2">
          <Textarea
            value={editorContent}
            onChange={e => setEditorContent(e.target.value)}
            placeholder="Write your code here..."
            className="w-full h-full resize-none border-none focus:ring-0 focus:outline-none font-mono pl-2"
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="off"
            autoComplete="off"
          />
          <div className="absolute bottom-4 right-4">
            {
              multiplayer && !challengeOngoing && <Button onClick={() => { navigate("/multiplayer") }} className="mr-2">Go to lobby</Button>
            }
            <CompileResultsDrawer errors={lastAttempt.results} isCompilerError={lastAttempt.build_error}></CompileResultsDrawer>
          </div>
        </div>
      </div>

      {
        multiplayer && <EndDialog open={openEndDialog} onOpenChange={setOpenEndDialog} winner={amITheWinner} myself={user} rival={opponent}/>
      }
      <Toaster />
    </div>
  )
}
