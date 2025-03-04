import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Label } from "../../components/ui/label";
import NewProblemButton from './newProblemButton';
import { FormField } from '../../components/formfield';
import { ErrorTextArea } from '../../components/errorTextArea';
import { TrashIcon } from 'lucide-react';
import { Checkbox } from '../../components/ui/checkbox';
import { ScrollArea } from '@radix-ui/themes';


function TestRow({ index, test, deleteTest, updateTest }) {
  return <div key={index}>
    <h2 className="text-l font-semibold">Test {index}</h2>
    <div className="flex items-start space-x-4">
      <div className="space-y-2 flex-1">
        <Label htmlFor={`test-${index}-input`}>Input</Label>
        <Textarea id={`test-${index}-input`} value={test.input} onChange={(e) => updateTest(index, 'input', e.target.value)} />
      </div>
      <div className="space-y-2 flex-1">
        <Label htmlFor={`test-${index}-output`}>Output</Label>
        <Textarea id={`test-${index}-output`} value={test.output} onChange={(e) => updateTest(index, 'output', e.target.value)} />
      </div>
    </div>
    <div className="flex items-start space-x-4 mt-4 justify-end">
      <div className="space-y-2 items-end">
        <Label htmlFor={`test-${index}-private`}>Private </Label>
        <Checkbox id={`test-${index}-private`} checked={test.is_private} onCheckedChange={(checked) => updateTest(index, 'is_private', checked)} />
      </div>
      <div className="space-y-2 flex items-end">
        <Button onClick={(evt) => { evt.preventDefault(); deleteTest(index) }} variant="outline" size="icon">
          <TrashIcon className="h-6 w-6 stroke-2" />
        </Button>
      </div>
    </div>
  </div>
}

/**
 * Dialog to create/edit a puzzle. Handles form data internally and passes to handleSubmit.
 * Errors are set externally in the response, and are get from the errs facility.
 */
export default function PuzzleDialog({open, setOpen, errs, handleSubmit, openButton, tests, setTests}) {
  const addTest = () => {
    setTests([...tests, { input: '', output: '', is_private: true }]);
  };

  const updateTest = (index, field, value) => {
    const updatedTests = [...tests];
    updatedTests[index][field] = value;
    setTests(updatedTests);
  };

  const deleteTest = (index) => {
    const updatedTests = [...tests];
    updatedTests.splice(index, 1);
    setTests(updatedTests);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {openButton}
      </DialogTrigger>
      <DialogContent className="md:max-w-[1000px] h-full max-h-[96%]">
        <ScrollArea className="overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Puzzle</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <FormField id="title" name="title" maxLength={150} required {...errs("title")} />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="difficulty">Difficulty</Label>
            <Select name="difficulty" defaultValue="E">
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="E" default>Easy</SelectItem>
                <SelectItem value="M">Medium</SelectItem>
                <SelectItem value="H">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <ErrorTextArea id="description" name="description" {...errs("description")} />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="timeConstraint">Time Constraint (μs)</Label>
            <FormField id="timeConstraint" name="timeConstraint" type="number" {...errs("time_constraint")} />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="memoryConstraint">Memory Constraint (B)</Label>
            <FormField id="memoryConstraint" name="memoryConstraint" type="number"  {...errs("memory_constraint")} />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="visibility">Visibility</Label>
            <Select name="visibility" defaultValue="P">
              <SelectTrigger>
                <SelectValue placeholder="Select visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="P">Public</SelectItem>
                <SelectItem value="H">Hidden</SelectItem>
                <SelectItem value="R">Private</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="categories">Categories (comma-separated)</Label>
            <FormField id="categories" name="categories" placeholder="e.g. Arrays, Strings, Dynamic Programming" {...errs("categories")} />
          </div>
                    
          {
            tests.map((test, index) => <TestRow
            index={index} test={test} deleteTest={deleteTest} updateTest={updateTest} addTest={addTest}
            ></TestRow>)
          }
          
          <div className="flex justify-end space-x-4">
            <Button onClick={(evt) => {evt.preventDefault(); addTest()}} variant="outline">
              Add test row
            </Button>
            <Button type="submit">Publish</Button>
          </div>
        </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export function CreatePuzzleDialog(params) {
  return <PuzzleDialog
    openButton={<NewProblemButton />}
    {...params}
  />
}

export function EditPuzzleDialog({open, setOpen, errs, handleSubmit, openButton, values, tests, setTests, deletePuzzle}) {
  const addTest = () => {
    setTests([...tests, { input: '', output: '', is_private: true }]);
  };

  const updateTest = (index, field, value) => {
    const updatedTests = [...tests];
    updatedTests[index][field] = value;
    setTests(updatedTests);
  };

  const deleteTest = (index) => {
    const updatedTests = [...tests];
    updatedTests.splice(index, 1);
    setTests(updatedTests);
  };


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        
      </DialogTrigger>
      <DialogContent className="md:max-w-[1000px] h-full max-h-[96%]">
        <ScrollArea className="overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit puzzle</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <FormField id="title" name="title" maxLength={150} required {...errs("title")} defaultValue={values.title} />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="difficulty">Difficulty</Label>
            <Select name="difficulty" defaultValue={values.difficulty}>
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="E" default>Easy</SelectItem>
                <SelectItem value="M">Medium</SelectItem>
                <SelectItem value="H">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <ErrorTextArea id="description" name="description" {...errs("description")} defaultValue={values.description} />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="timeConstraint">Time Constraint (μs)</Label>
            <FormField id="timeConstraint" name="timeConstraint" type="number" {...errs("time_constraint")} defaultValue={values.time_constraint} />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="memoryConstraint">Memory Constraint (B)</Label>
            <FormField id="memoryConstraint" name="memoryConstraint" type="number"  {...errs("memory_constraint")} defaultValue={values.memory_constraint} />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="visibility">Visibility</Label>
            <Select name="visibility" defaultValue={values.visibility}>
              <SelectTrigger>
                <SelectValue placeholder="Select visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="P">Public</SelectItem>
                <SelectItem value="H">Hidden</SelectItem>
                <SelectItem value="R">Private</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="categories">Categories (comma-separated)</Label>
            <FormField id="categories" name="categories" placeholder="e.g. Arrays, Strings, Dynamic Programming" {...errs("categories")}
            defaultValue={values.categories ? values.categories.join(", ") : ""} />
          </div>
          
          {
            tests.map((test, index) => <TestRow
            index={index} test={test} deleteTest={deleteTest} updateTest={updateTest} addTest={addTest}
            ></TestRow>)
          }
          
          <div className="flex justify-end space-x-4">
            <Button onClick={(evt) => {evt.preventDefault(); addTest()}} variant="outline">
              Add test row
            </Button>
            <Button type="submit">Update</Button>
            <Button variant="destructive" onClick={(evt) => {evt.preventDefault(); deletePuzzle()}}>Delete</Button>
          </div>
        </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
