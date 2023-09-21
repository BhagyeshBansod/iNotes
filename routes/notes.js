import express from "express";
import Note from "../models/NotesSchema.js";
import fetchuser from "../middleware/fetchuser.js";
import { body, validationResult } from "express-validator";

export const noteRouter = express.Router();

// Route for fetching notes of the user
noteRouter.get("/getallnotes", fetchuser, async (req, res) => {
  try {
    //fetching the notes of the particular loggedin user
    const getnotes = await Note.find({ user: req.user.id });
    res.json(getnotes);
  } catch (error) {
    //Catching internal server error
    console.log(error.message);
    res.status(500).send("Something went wrong");
  }
});

// Route for adding notes
noteRouter.post(
  "/addnote",
  fetchuser,
  [
    //Validation for notes
    body("Title", "Title must be atleast 3 characters").isLength({ min: 3 }),
    body("Description", "Description must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      //Checking the errors in the request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      //Destructuring the Title, Description and Tag from the body
      const { Title, Description, Tag } = req.body;

      const note = new Note({
        Title,
        Description,
        Tag: "default",
        user: req.user.id,
      });

      const savenote = await note.save();

      res.json(savenote);
    } catch (error) {
      //Catching internal server error
      console.log(error.message);
      res.status(500).send("Something went wrong");
    }
  }
);

// Route for updating an existing notes
noteRouter.put("/updatenote/:id", fetchuser, async (req, res) => {

  //Destructing the data from body
  const {Title, Description, Tag} = req.body;

  //Empty variable to store the user note for updating from an existing notes
  let updatednote = {};

  // if above destructured values are present then store in the updatenote object
  if(Title && Description && Tag ){
    updatednote.Title = Title;
    updatednote.Description = Description;
    updatednote.Tag = Tag;
  }

  //stores the id of the loggedin user note
  let currentnote = await Note.findById(req.params.id);

  //if not id is not present then throws error
  if(!currentnote){res.status(404).send("Not Found")}

  //if the id is not present then throws error
  if(currentnote.user.toString() !== req.user.id){res.status(401).send("Not Authorised")}

  //finds an existing note and sets the updated value in the updatednote variable
  updatednote = await Note.findByIdAndUpdate(req.params.id, {$set: updatednote}, {new: true})

  //sends response of the updated note
  res.json(updatednote)

});

// Route for deleting an existing notes
noteRouter.delete("/deletenote/:id", fetchuser, async (req, res) => {


  //stores the id of the loggedin user note
  let currentnote = await Note.findById(req.params.id);

  //if not id is not present then throws error
  if(!currentnote){res.status(404).send("Not Found")}

  //if the id is not present then throws error
  if(currentnote.user.toString() !== req.user.id){res.status(401).send("Not Authorised")}

  //finds an existing note and sets the updated value in the updatednote variable
  currentnote = await Note.findByIdAndDelete(req.params.id)

  //sends response of the updated note
  res.json({ "Success": "Note has been deleted", currentnote: currentnote })

});