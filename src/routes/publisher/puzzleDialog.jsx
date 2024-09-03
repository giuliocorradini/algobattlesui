import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Label } from "../../components/ui/label";
import NewProblemButton from './newProblemButton';
import { FormField } from '../../components/formfield';
import { ErrorTextArea } from '../../components/errorTextArea';

/**
 * Dialog to create/edit a puzzle. Handles form data internally and passes to handleSubmit.
 * Errors are set externally in the response, and are get from the errs facility.
 */
export default function PuzzleDialog({open, setOpen, errs, handleSubmit, openButton}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {openButton}
      </DialogTrigger>
      <DialogContent className="md:max-w-[1000px]">
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
            <Label htmlFor="memoryConstraint">Memory Constraint</Label>
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
                    
          <Button type="submit">Publish</Button>
        </form>
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
