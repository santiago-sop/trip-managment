import { Router } from "express";
//import tripModel from "../manager/mongo/models/trip.model.js";
import { tripService } from "../manager/index.js";

const tripsRouter = Router();

tripsRouter.get("/", async (req, res) => {
    try {
        const trips = await tripService.getAllTrips();
        res.send({ status: "success", payload: trips });
    } catch (error) {
        res.status(500).send({ status: "error", message: error.message });
    }
});

tripsRouter.post("/:user_id", async (req, res) => {
    const trip = req.body;
    const { user_id } = req.params;
    if (!user_id) {
        return res.status(400).send({ status: "error", message: "User ID is required" });
    }
    trip.participants = [user_id]; // Add the user as a participant
    if (!trip.destination || !trip.startDate || !trip.endDate || !trip.participants) {
        return res.status(400).send({ status: "error", message: "Destination, start date, and end date are required" });
    }
    try {
        const tripResult = await tripModel.create(trip);
        res.send({ status: "success", payload: tripResult });
    } catch (error) {
        res.status(500).send({ status: "error", message: error.message });
    }
});

//await usersModel.updateOne({_id:uid},{$pusch:{trips:tip}});

tripsRouter.put("/", async (req, res) => {
    const trip = req.body;
    if (!trip._id || !trip.destination || !trip.startDate || !trip.endDate) {
        return res.status(400).send({ status: "error", message: "ID, destination, start date, and end date are required" });
    }
    try {
        await tripModel.updateOne({ _id: trip._id }, trip);
        res.send({ status: "success", message: "Trip updated successfully" });
    } catch (error) {
        res.status(500).send({ status: "error", message: error.message });
    }
});

tripsRouter.delete("/", async (req, res) => {
    const { id } = req.query;
    if (!id) {
        return res.status(400).send({ status: "error", message: "ID is required" });
    }
    try {
        await tripModel.deleteOne({ _id: id });
        res.send({ status: "success", message: "Trip deleted successfully" });
    } catch (error) {
        res.status(500).send({ status: "error", message: error.message });
    }
});

export default tripsRouter;
// This file defines the trips router for handling trip-related API requests.