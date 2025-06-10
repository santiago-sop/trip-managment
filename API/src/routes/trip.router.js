import { Router } from "express";
//import tripModel from "../manager/mongo/models/trip.model.js";
import { tripService } from "../manager/index.js";
import { userService } from "../manager/index.js";

const tripsRouter = Router();

tripsRouter.get("/:user_email", async (req, res) => {
    try {
        const { user_email } = req.params;
        if (!user_email) {
            return res.status(400).send({ status: "error", message: "User email is required" });
        }
        const user = await userService.getUserbyEmail({ email: user_email });
        if (!user) {
            return res.status(404).send({ status: "error", message: "User not found" });
        }
        const trips = await tripService.getAllTrips( { participants: user_email });
        if (!trips || trips.length === 0) {
            return res.status(404).send({ status: "error", message: "No trips found for this user" });
        }
        res.send({ status: "success", payload: trips });
    } catch (err) {
        res.status(500).send({ status: "error", message: err.message });
    }
});

tripsRouter.post("/:user_email", async (req, res) => {
    try {
        const { user_email } = req.params;
        if (!user_email) {
            return res.status(400).send({ status: "error", message: "User email is required" });
        }
        const tripData = req.body;
        if (!tripData.name || !tripData.startDate || !tripData.endDate) {
            return res.status(400).send({ status: "error", message: "Name, start date, and end date are required" });
        }
        const user = await userService.getUserbyEmail({ email: user_email });
        const user_id = user ? user._id : null;
        tripData.participants = [user_id]; // Add the user as a participant
        const newTrip = await tripService.createTrip(tripData);

        // Agregar el viaje al usuario
        await userService.addTripToUser(user_id, newTrip._id);

        res.send({ status: "success", payload: newTrip });
    } catch (err) {
        res.status(500).send({ status: "error", message: err.message });
    }
});

tripsRouter.post("/addParticipant/:tripId", async (req, res) => {
    try {
        const { tripId } = req.params;
        if (!tripId) {
            return res.status(400).send({ status: "error", message: "Trip ID is required" });
        }
        const { email } = req.body;
        if (!email) {
            return res.status(400).send({ status: "error", message: "Email is required to add a participant" });
        }
        const user = await userService.getUserbyEmail({ email });
        if (!user) {
            return res.status(404).send({ status: "error", message: "User not found" });
        }
        const updatedTrip = await tripService.addParticipantToTrip(tripId, user._id);
        res.send({ status: "success", payload: updatedTrip });
    } catch (err) {
        res.status(500).send({ status: "error", message: err.message });
    }
});

tripsRouter.post("/addActivity/:tripId", async (req, res) => {
    try {
        const { tripId } = req.params;
        if (!tripId) {
            return res.status(400).send({ status: "error", message: "Trip ID is required" });
        }
        const activityData = req.body;
        if (!activityData.name || !activityData.date || !activityData.city) {
            return res.status(400).send({ status: "error", message: "Name, city and date are required for the activity" });
        }
        const updatedTrip = await tripService.addActivityToTrip(tripId, activityData);
        res.send({ status: "success", payload: updatedTrip });
    } catch (err) {
        res.status(500).send({ status: "error", message: err.message });
    }
});

tripsRouter.post("/addStay/:tripId", async (req, res) => {
    try {
        const { tripId } = req.params;
        if (!tripId) {
            return res.status(400).send({ status: "error", message: "Trip ID is required" });
        }
        const stayData = req.body;
        if (!stayData.name || !stayData.startDate || !stayData.endDate || !stayData.checkin || !stayData.checkout) {
            return res.status(400).send({ status: "error", message: "Name, start date, and end date, check-in and check-out are required for the stay" });
        }
        if (!transferData.checkin.match(/^([0-1]\d|2[0-3]):([0-5]\d)$/) || !transferData.checkout.match(/^([0-1]\d|2[0-3]):([0-5]\d)$/)) {
            return res.status(400).send({ status: "error", message: "Check-in and check-out time must be in HH:mm format" });
        }
        if (new Date(transferData.startDate) > new Date(transferData.endDate)) {
            return res.status(400).send({ status: "error", message: "Start date must be before end date" });
        }
        const trip = await tripService.getTripById(tripId);
        const startDateTrip = new Date(trip.startDate);
        const endDateTrip = new Date(trip.endDate);
        if (new Date(transferData.startDate) < startDateTrip || new Date(transferData.endDate) > endDateTrip) {
            return res.status(400).send({ status: "error", message: "Transfer dates must be within the trip dates" });
        }
        const updatedTrip = await tripService.addStayToTrip(tripId, stayData);
        res.send({ status: "success", payload: updatedTrip });
    } catch (err) {
        res.status(500).send({ status: "error", message: err.message });
    }
});

tripsRouter.post("/addTransfer/:tripId", async (req, res) => {
    try {
        const { tripId } = req.params;
        if (!tripId) {
            return res.status(400).send({ status: "error", message: "Trip ID is required" });
        }
        const transferData = req.body;
        if (!transferData.name || !transferData.startDate || !transferData.endDate || !transferData.startTime || !transferData.endTime || !transferData.startLocation || !transferData.endLocation) {
            return res.status(400).send({ status: "error", message: "Name, start date, end date, start time, end time, start location and end location are required for the transfer" });
        }
        if (!transferData.startTime.match(/^([0-1]\d|2[0-3]):([0-5]\d)$/) || !transferData.endTime.match(/^([0-1]\d|2[0-3]):([0-5]\d)$/)) {
            return res.status(400).send({ status: "error", message: "Start time and end time must be in HH:mm format" });
        }
        if (new Date(transferData.startDate) > new Date(transferData.endDate)) {
            return res.status(400).send({ status: "error", message: "Start date must be before end date" });
        }
        const trip = await tripService.getTripById(tripId);
        const startDateTrip = new Date(trip.startDate);
        const endDateTrip = new Date(trip.endDate);
        if (new Date(transferData.startDate) < startDateTrip || new Date(transferData.endDate) > endDateTrip) {
            return res.status(400).send({ status: "error", message: "Transfer dates must be within the trip dates" });
        }
        const updatedTrip = await tripService.addTransferToTrip(tripId, transferData);
        res.send({ status: "success", payload: updatedTrip });
    } catch (err) {
        res.status(500).send({ status: "error", message: err.message });
    }
});

tripsRouter.post("/addExpense/:tripId", async (req, res) => {
    try {
        const { tripId } = req.params;
        if (!tripId) {
            return res.status(400).send({ status: "error", message: "Trip ID is required" });
        }
        const expenseData = req.body;
        if (!expenseData.name || !expenseData.amount) {
            return res.status(400).send({ status: "error", message: "Name and amount are required for the expense" });
        }
        const updatedTrip = await tripService.addExpenseToTrip(tripId, expenseData);
        res.send({ status: "success", payload: updatedTrip });
    } catch (err) {
        res.status(500).send({ status: "error", message: err.message });
    }
});

tripsRouter.post("/addBlog/:tripId", async (req, res) => {
    try {
        const { tripId } = req.params;
        if (!tripId) {
            return res.status(400).send({ status: "error", message: "Trip ID is required" });
        }
        const blogData = req.body;
        if (!blogData.title || !blogData.content) {
            return res.status(400).send({ status: "error", message: "Title and content are required for the blog" });
        }
        const updatedTrip = await tripService.addBlogToTrip(tripId, blogData);
        res.send({ status: "success", payload: updatedTrip });
    } catch (err) {
        res.status(500).send({ status: "error", message: err.message });
    }
});

tripsRouter.get("/dayData/:tripId", async (req, res) => {
    try {
        const { tripId } = req.params;
        const { date } = req.query; // Optional date query parameter
        if (!tripId) {
            return res.status(400).send({ status: "error", message: "Trip ID is required" });
        }
        const trip = await tripService.getTripById(tripId);
        if (!trip) {
            return res.status(404).send({ status: "error", message: "Trip not found" });
        }
        //console.log(trip);
        let dayData;
        if (!date) {
            console.log("No date provided, fetching data for the current day");
            dayData = await tripService.getDayDataForTrip(tripId);
        }
        else{
            console.log(`Fetching data for the specified date: ${date}`);
            dayData = await tripService.getDayDataForTrip(tripId, new Date(date));
        }
        //console.log(dayData);
        res.send({ status: "success", payload: dayData });
    } catch (err) {
        res.status(500).send({ status: "error", message: err.message });
    }
});

tripsRouter.get("/dailyBudget/:tripId", async (req, res) => {
    try {
        const { tripId } = req.params;
        if (!tripId) {
            return res.status(400).send({ status: "error", message: "Trip ID is required" });
        }
        const budget = await tripService.getBudgetDailyForRestOfTrip(tripId);
        res.send({ status: "success", payload: budget });
    } catch (err) {
        res.status(500).send({ status: "error", message: err.message });
    }
});

export default tripsRouter;
// This file defines the trips router for handling trip-related API requests.