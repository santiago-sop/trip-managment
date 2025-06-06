import { Router } from "express";
import userModel from "../manager/mongo/models/user.model.js";

const usersRouter = Router();

usersRouter.get("/", async (req, res) => {
    try {
        const users = await userModel.find();
        res.send({status: "success", payload: users});
    } catch (err) {
        res.status(500).send({status: "error", message: err.message});
    }
});

usersRouter.post("/", async (req, res) => {
    try {
        const user = req.body;
        if(!user.email || !user.password || !user.firstName || !user.lastName) {
            return res.status(400).send({status: "error", message: "All fields are required"});
        }
        const existingUser = await userModel.findOne({ email: user.email });
        if(existingUser) {
            return res.status(400).send({status: "error", message: "Email already exists"});
        }
        const userResult = await userModel.create(user);
        res.send({status: "success", payload: userResult});
    } catch (err) {
        res.status(500).send({status: "error", message: err.message});
    }
});

usersRouter.put("/", async (req, res) => {
    try {
        const user = req.body;
        if(!user.email || !user.firstName || !user.lastName) {
            return res.status(400).send({status: "error", message: "Email, first name, and last name are required"});
        }
        await userModel.updateOne({ email: user.email }, user);
        res.send({status: "success", message: "User updated successfully"});
    } catch (err) {
        res.status(500).send({status: "error", message: err.message});
    }
});

usersRouter.delete("/", (req, res) => {

});

export default usersRouter;
// This file defines the users router for handling user-related API requests.