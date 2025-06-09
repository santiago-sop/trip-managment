import { Router } from "express"
import uploaders from "../middlewares/uploaders.js"

const activitiesRouter = Router()

activitiesRouter.get("/", (req, res) => {
    res.send("Get all activities")
})

activitiesRouter.post("/",uploaders.single(), (req, res) => {
    res.send("Create a new activity")
})

activitiesRouter.put("/", (req, res) => {
    res.send("Update an activity")
})

activitiesRouter.delete("/", (req, res) => {
    res.send("Delete an activity")
})

export default activitiesRouter
// This file defines the activities router for handling activity-related API requests.