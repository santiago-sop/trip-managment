import { Router } from "express";
import userModel from "../manager/models/user.model.js";

const usersRouter = Router();

usersRouter.get("/", async (req, res) => {
    const users = await userModel.find();
    res.send({status: "success", payload: users});
});

usersRouter.post("/", async (req, res) => {
    const user = req.body;
    if(!user.email || !user.password || !user.firstName || !user.lastName) {
        return res.status(400).send({status: "error", message: "All fields are required"});
    }
    if(userModel.find({"email":user.email}).length > 0) {
        return res.status(400).send({status: "error", message: "Email already exists"});
    }
    const userResult = await userModel.create(user);
    res.send({status: "success", payload: userResult});
});

usersRouter.put("/", (req, res) => {

});

usersRouter.delete("/", (req, res) => {

});

export default usersRouter;
// This file defines the users router for handling user-related API requests.