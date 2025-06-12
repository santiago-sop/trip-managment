import { Router } from "express";
import { userService } from "../manager/index.js";
//import userModel from "../manager/mongo/models/user.model.js";

const usersRouter = Router();

usersRouter.get("/", async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.send({status: "success", payload: users});
    } catch (err) {
        res.status(500).send({status: "error", message: err.message});
    }
});

usersRouter.get("/email/:email", async (req, res) => {
    try {
        const { email } = req.params;
        if (!email) {
            return res.status(400).send({status: "error", message: "Email is required"});
        }
        const user = await userService.getUserbyEmail({ email });
        if (!user) {
            return res.status(404).send({status: "error", message: "User not found"});
        }
        res.send({status: "success", payload: user});
    } catch (err) {
        res.status(500).send({status: "error", message: err.message});
    }
});

usersRouter.get("/id/:id", async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).send({status: "error", message: "ID is required"});
        }
        const user = await userService.getUserById(id);
        if (!user) {
            return res.status(404).send({status: "error", message: "User not found"});
        }
        res.send({status: "success", payload: user});
    } catch (err) {
        res.status(500).send({status: "error", message: err.message});
    }
});

usersRouter.get('/email/:email/password/:password', async (req, res) => {
    try {
        const { email, password } = req.params;
        if (!email || !password) {
            return res.status(400).send({status: "error", message: "Email and password are required"});
        }
        const user = await userService.getUserByEmailAndPassword(email, password);
        if (!user || user.length === 0) {
            return res.status(404).send({status: "error", message: "User or password is incorrect"});
        }  
        res.send({status: "success", payload: user[0]});
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
        const existingUser = await userService.getUserbyEmail({email:user.email});
        if(existingUser) {
            return res.status(400).send({status: "error", message: "Email already exists"});
        }
        const userResult = await userService.createUser(user);
        res.send({status: "success", payload: userResult});
    } catch (err) {
        res.status(500).send({status: "error", message: err.message});
    }
});

usersRouter.put("/", async (req, res) => {
    try {
        const user = req.body;
        if(!user.email || !user.firstName || !user.lastName || !user.password) {
            return res.status(400).send({status: "error", message: "Email, password, first name, and last name are required"});
        }
        await userService.updateUserByEmail(user.email, user);
        res.send({status: "success", message: "User updated successfully"});
    } catch (err) {
        res.status(500).send({status: "error", message: err.message});
    }
});

usersRouter.delete("/email/:email", async (req, res) => {
    try {
        const { email } = req.params;
        if (!email) {
            return res.status(400).send({status: "error", message: "Email is required"});
        }
        await userService.deleteUserByEmail({ email });
        res.send({status: "success", message: "User deleted successfully"});
    } catch (err) {
        res.status(500).send({status: "error", message: err.message});
    }
});

usersRouter.post("/trip/:userId/:tripId", async (req, res) => {
    try {
        const { userId, tripId } = req.params;
        if (!userId || !tripId) {
            return res.status(400).send({status: "error", message: "User ID and Trip ID are required"});
        }
        const updatedUser = await userService.pushTripToUser(userId, tripId);
        res.send({status: "success", payload: updatedUser});
    } catch (err) {
        res.status(500).send({status: "error", message: err.message});
    }
});

export default usersRouter;
// This file defines the users router for handling user-related API requests.