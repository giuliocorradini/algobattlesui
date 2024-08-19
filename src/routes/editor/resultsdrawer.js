import { CheckIcon, XIcon } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from "../../components/ui/drawer"
import React from "react"

export function CompileResultsDrawer({errors, isCompilerError}) {
    function NoErrorsButton(props) {
      return <Button variant="outline" {...props}>No errors</Button>
    }
  
    function DangerErrorsButton(props) {
      return <Button variant="destructive" {...props}>Errors</Button>
    }
  
    function getTitle() {
      if (errors) {
        if (isCompilerError)
            return "Build errors"
        return "Tests not passed"
      } else
        return "All good!"
    }

    function testPairs(errs) {
      const obj = JSON.parse(errs)
      return Object.entries(obj)
    }
  
    function getDescription() {
      if (errors) {
        if (isCompilerError)
            return <DrawerDescription className="text-left whitespace-pre-line whitespace-pre font-mono overflow-x-scroll">{errors}</DrawerDescription>
        return <DrawerDescription className="text-left">{
          testPairs(errors).map(([n, stat]) => [n, stat == "passed", stat]).map(([n, b, stat]) =>
            <div className="flex">
              {b ? <CheckIcon className="stroke-green-600" /> : <XIcon className="stroke-red-600" />}
              Test {n}: {stat}
            </div>
          )
        }</DrawerDescription>
      } else
        return <DrawerDescription className="text-left">There are no build errors.</DrawerDescription>
    }
    
    return <Drawer>
    <DrawerTrigger asChild>
      {
        errors == null ? <NoErrorsButton /> :
        <DangerErrorsButton />
      }
    </DrawerTrigger>
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle className="text-left">{getTitle()}</DrawerTitle>
        {getDescription()}
      </DrawerHeader>
      <DrawerFooter>
        <DrawerClose>
          <Button variant="outline">Got it</Button>
        </DrawerClose>
      </DrawerFooter>
    </DrawerContent>
  </Drawer>
  }