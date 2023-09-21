import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { body, validationResult } from "express-validator";
import users from "../models/UserSchema.js";
import fetchuser from "../middleware/fetchuser.js";

export const authRouter = express.Router();

const sectoken = "iNotebookUser";

// Route for creating user
authRouter.post(
  "/createuser",
  [
    //Validation for user form
    body("Name").isLength({ min: 2 }),
    body("Email", "Enter valid email address").isEmail(),
    body("Password", "Password must be atleast 8 characters").isLength({
      min: 8,
    }),
  ],
  async (req, res) => {
    //Checking the errors in the request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let success = false;

    try {
      //finds the entered email present in DB, if present then throws errors
      let user = await users.findOne({ Email: req.body.Email });
      if (user) {
        return res
          .status(400)
          .json({ errors: "A user with same email already exist" });
      }

      //Created hash and salt for user password
      const salt = bcrypt.genSaltSync(10);
      const secpassword = await bcrypt.hash(req.body.Password, salt);

      //Creating new user
      user = await users.create({
        Name: req.body.Name,
        Email: req.body.Email,
        Password: secpassword,
      });

      //data value to add in the authtoken
      const data = {
        user: { id: user.id },
      };

      //Generating authtoken using the data value and the secToken
      const authToken = jwt.sign(data, sectoken);
      success = true;
      res.json({ success, authToken });
    } catch (error) {
      //Catching internal server error
      console.log(error.message);
      res.status(500).send("Something went wrong");
    }
  }
);

// Route for user Login
authRouter.post(
  "/login",
  [
    //Checks the login credentials of the user
    body("Email", "Enter valid email address").isEmail(),
    body("Password", "Please enter the password").exists(),
  ],
  async (req, res) => {
    //Checking the errors in the request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //Destructuring the email and password from the body
    const { Email, Password } = req.body;

    let success = false;

    try {
      //finds the entered email present in DB, if not present then throws error
      let user = await users.findOne({ Email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: "Please login using correct credentials" });
      }

      //compares the entered password with password present in DB, if not match then throws error
      const checkingpassword = await bcrypt.compare(Password, user.Password);
      if (!checkingpassword) {
        return res
          .status(400)
          .json({ errors: "Please login using correct credentials" });
      }

      //data value to add in the authtoken
      const data = {
        user: { id: user.id },
      };

      //Generating authtoken using the data value and the secToken
      const authToken = jwt.sign(data, sectoken);
      success = true;

      //sends auth token to user if logged in successfully
      res.json({ success, authToken });
    } catch (error) {
      //Catching internal server error
      console.log(error.message);
      res.status(500).send("Something went wrong");
    }
  }
);

// Route for fetching user data after successful login
authRouter.post("/getuser", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;

    const loggedUser = await users.findById(userId).select("-Password");
    res.send(loggedUser);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Something went wrong");
  }
});
