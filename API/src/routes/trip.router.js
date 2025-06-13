import { Router } from "express";
//import tripModel from "../manager/mongo/models/trip.model.js";
import { tripService } from "../manager/index.js";
import { userService } from "../manager/index.js";

const tripsRouter = Router();

//Trip
tripsRouter.get("/", async (req, res) => {
    try {
        const trips = await tripService.getAllTrips();
        if (!trips || trips.length === 0) {
            return res.status(404).send({ status: "error", message: "No trips found" });
        }
        res.send({ status: "success", payload: trips });
    } catch (err) {
        res.status(500).send({ status: "error", message: err.message });
    }
});

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
        const trips = await tripService.getTripsByUserId( user._id);
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
        await userService.pushTripToUser(user_id, newTrip._id);

        res.send({ status: "success", payload: newTrip });
    } catch (err) {
        res.status(500).send({ status: "error", message: err.message });
    }
});

tripsRouter.put("/:tripId", async (req, res) => {
    try {
        const { tripId } = req.params;
        if (!tripId) {
            return res.status(400).send({ status: "error", message: "Trip ID is required" });
        }
        const tripData = req.body;
        if (!tripData.name || !tripData.startDate || !tripData.endDate) {
            return res.status(400).send({ status: "error", message: "Name, start date, and end date are required" });
        }
        const updatedTrip = await tripService.updateTrip(tripId, tripData);
        if (!updatedTrip) {
            return res.status(404).send({ status: "error", message: "Trip not found" });
        }
        res.send({ status: "success", payload: updatedTrip });
    } catch (err) {
        res.status(500).send({ status: "error", message: err.message });
    }
});

tripsRouter.delete("/:tripId", async (req, res) => {
    try {
        console.log("Deleting trip");
        const { tripId } = req.params;
        console.log("Trip ID:", tripId);
        if (!tripId) {
            return res.status(400).send({ status: "error", message: "Trip ID is required" });
        }
        // Remove the trip from the user's trips
        console.log("Fetching user by trip ID");
        const user = await userService.getUserByTripId(tripId);
        console.log(user);
        if (user) {
            await userService.pullTripFromUser(user._id, tripId);
        }
        const deletedTrip = await tripService.deleteTrip(tripId);
        if (!deletedTrip) {
            return res.status(404).send({ status: "error", message: "Trip not found" });
        }
        res.send({ status: "success", payload: deletedTrip });
    } catch (err) {
        res.status(500).send({ status: "error", message: err.message });
    }
});

//Participants
tripsRouter.post("/participant/:tripId", async (req, res) => {
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

tripsRouter.delete("/participant/:tripId/:userId", async (req, res) => {
    try {
        const { tripId, userId } = req.params;
        if (!tripId || !userId) {
            return res.status(400).send({ status: "error", message: "Trip ID and User ID are required" });
        }
        const trip = await tripService.getTripById(tripId);
        if (!trip) {
            return res.status(404).send({ status: "error", message: "Trip not found" });
        }
        const updatedTrip = await tripService.removeParticipantFromTrip(tripId, userId);
        if (!updatedTrip) {
            return res.status(404).send({ status: "error", message: "User not found in trip participants" });
        }
        // Remove the trip from the user's trips
        const user = await userService.getUserById(userId);
        if (user) {
            await userService.pullTripFromUser(user._id, tripId);
        }
        res.send({ status: "success", payload: updatedTrip });
    } catch (err) {
        res.status(500).send({ status: "error", message: err.message });
    }
});

//Activities
tripsRouter.get("activity/:activityId", async (req, res) => {
    try {
        const { activityId } = req.params;
        if (!activityId) {
            return res.status(400).send({ status: "error", message: "Activity ID is required" });
        }
        const activity = await tripService.getActivityById(activityId);
        if (!activity) {
            return res.status(404).send({ status: "error", message: "Activity not found" });
        }
        res.send({ status: "success", payload: activity });
    } catch (err) {
        res.status(500).send({ status: "error", message: err.message });
    }
});

tripsRouter.get("/activity/:tripId", async (req, res) => {
    try {  
        const { tripId } = req.params;
        if (!tripId) {
            return res.status(400).send({ status: "error", message: "Trip ID is required" });
        }
        const trip = await tripService.getTripById(tripId);
        if (!trip) {
            return res.status(404).send({ status: "error", message: "Trip not found" });
        }
        if (!trip.activities || trip.activities.length === 0) {
            return res.status(404).send({ status: "error", message: "No activities found for this trip" });
        }
        res.send({ status: "success", payload: trip.activities });
    } catch (err) {
        res.status(500).send({ status: "error", message: err.message });
    }
});

tripsRouter.post("/activity/:tripId", async (req, res) => {
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

tripsRouter.put("/activity/:tripId/:activityId", async (req, res) => {
    try {
        const { tripId, activityId } = req.params;
        if (!tripId || !activityId) {
            return res.status(400).send({ status: "error", message: "Trip ID and Activity ID are required" });
        }
        const activityData = req.body;
        if (!activityData.name || !activityData.date || !activityData.city) {
            return res.status(400).send({ status: "error", message: "Name, city and date are required for the activity" });
        }
        const updatedTrip = await tripService.modifyActivityInTrip(tripId, activityId, activityData);
        if (!updatedTrip) {
            return res.status(404).send({ status: "error", message: "Activity not found in trip" });
        }
        res.send({ status: "success", payload: updatedTrip });
    } catch (err) {
        res.status(500).send({ status: "error", message: err.message });
    }
});

tripsRouter.delete("/activity/:tripId/:activityId", async (req, res) => {
    try {
        const { tripId, activityId } = req.params;
        if (!tripId || !activityId) {
            return res.status(400).send({ status: "error", message: "Trip ID and Activity ID are required" });
        }
        const deletedActivity = await tripService.deleteActivityFromTrip(tripId, activityId);
        if (!deletedActivity) {
            return res.status(404).send({ status: "error", message: "Activity not found in trip" });
        }
        res.send({ status: "success", payload: deletedActivity });
    } catch (err) {
        res.status(500).send({ status: "error", message: err.message });
    }
});

//Stays
tripsRouter.get("/stay/:stayId", async (req, res) => {
    try {
        const { stayId } = req.params;
        if (!stayId) {
            return res.status(400).send({ status: "error", message: "Stay ID is required" });
        }
        const stay = await tripService.getStayById(stayId);
        if (!stay) {
            return res.status(404).send({ status: "error", message: "Stay not found" });
        }
        res.send({ status: "success", payload: stay });
    } catch (err) {
        res.status(500).send({ status: "error", message: err.message });
    }
});

tripsRouter.get("/stay/:tripId", async (req, res) => {
    try {
        const { tripId } = req.params;
        if (!tripId) {
            return res.status(400).send({ status: "error", message: "Trip ID is required" });
        }
        const trip = await tripService.getTripById(tripId);
        if (!trip) {
            return res.status(404).send({ status: "error", message: "Trip not found" });
        }
        if (!trip.stays || trip.stays.length === 0) {
            return res.status(404).send({ status: "error", message: "No stays found for this trip" });
        }
        res.send({ status: "success", payload: trip.stays });
    } catch (err) {
        res.status(500).send({ status: "error", message: err.message });
    }
});

tripsRouter.post("/stay/:tripId", async (req, res) => {
    try {
        const { tripId } = req.params;
        if (!tripId) {
            return res.status(400).send({ status: "error", message: "Trip ID is required" });
        }
        const stayData = req.body;
        if (!stayData.name || !stayData.startDate || !stayData.endDate || !stayData.checkin || !stayData.checkout) {
            return res.status(400).send({ status: "error", message: "Name, start date, and end date, check-in and check-out are required for the stay" });
        }
        if (!stayData.checkin.match(/^([0-1]\d|2[0-3]):([0-5]\d)$/) || !stayData.checkout.match(/^([0-1]\d|2[0-3]):([0-5]\d)$/)) {
            return res.status(400).send({ status: "error", message: "Check-in and check-out time must be in HH:mm format" });
        }
        if (new Date(stayData.startDate) > new Date(stayData.endDate)) {
            return res.status(400).send({ status: "error", message: "Start date must be before end date" });
        }
        const trip = await tripService.getTripById(tripId);
        const startDateTrip = new Date(trip.startDate);
        const endDateTrip = new Date(trip.endDate);
        if (new Date(stayData.startDate) < startDateTrip || new Date(stayData.endDate) > endDateTrip) {
            return res.status(400).send({ status: "error", message: "Stay dates must be within the trip dates" });
        }
        const updatedTrip = await tripService.addStayToTrip(tripId, stayData);
        res.send({ status: "success", payload: updatedTrip });
    } catch (err) {
        res.status(500).send({ status: "error", message: err.message });
    }
});

tripsRouter.put("/stay/:tripId/:stayId", async (req, res) => {
    try {
        const { tripId, stayId } = req.params;
        if (!tripId || !stayId) {
            return res.status(400).send({ status: "error", message: "Trip ID and Stay ID are required" });
        }
        const stayData = req.body;
        if (!stayData.name || !stayData.startDate || !stayData.endDate || !stayData.checkin || !stayData.checkout) {
            return res.status(400).send({ status: "error", message: "Name, start date, end date, check-in and check-out are required for the stay" });
        }
        if (!stayData.checkin.match(/^([0-1]\d|2[0-3]):([0-5]\d)$/) || !stayData.checkout.match(/^([0-1]\d|2[0-3]):([0-5]\d)$/)) {
            return res.status(400).send({ status: "error", message: "Check-in and check-out time must be in HH:mm format" });
        }
        if (new Date(stayData.startDate) > new Date(stayData.endDate)) {
            return res.status(400).send({ status: "error", message: "Start date must be before end date" });
        }
        const trip = await tripService.getTripById(tripId);
        const startDateTrip = new Date(trip.startDate);
        const endDateTrip = new Date(trip.endDate);
        if (new Date(stayData.startDate) < startDateTrip || new Date(stayData.endDate) > endDateTrip) {
            return res.status(400).send({ status: "error", message: "Stay dates must be within the trip dates" });
        }
        const updatedTrip = await tripService.modifyStayInTrip(tripId, stayId, stayData);
        if (!updatedTrip) {
            return res.status(404).send({ status: "error", message: "Stay not found in trip" });
        }
        res.send({ status: "success", payload: updatedTrip });
    } catch (err) {
        res.status(500).send({ status: "error", message: err.message });
    }
});

tripsRouter.delete("/stay/:tripId/:stayId", async (req, res) => {
    try {
        const { tripId, stayId } = req.params;
        if (!tripId || !stayId) {
            return res.status(400).send({ status: "error", message: "Trip ID and Stay ID are required" });
        }
        const deletedStay = await tripService.deleteStayFromTrip(tripId, stayId);
        if (!deletedStay) {
            return res.status(404).send({ status: "error", message: "Stay not found in trip" });
        }
        res.send({ status: "success", payload: deletedStay });
    } catch (err) {
        res.status(500).send({ status: "error", message: err.message });
    }
});

//Transfers
tripsRouter.get("/transfer/:transferID", async (req, res) => {
    try {
        const { transferID } = req.params;
        if (!transferID) {
            return res.status(400).send({ status: "error", message: "Transfer ID is required" });
        }
        const transfer = await tripService.getTransferById(transferID);
        if (!transfer) {
            return res.status(404).send({ status: "error", message: "Transfer not found" });
        }
        res.send({ status: "success", payload: transfer });
    } catch (err) {
        res.status(500).send({ status: "error", message: err.message });
    }
});

tripsRouter.get("/transfer/:tripId", async (req, res) => {
    try {
        const { tripId } = req.params;
        if (!tripId) {
            return res.status(400).send({ status: "error", message: "Trip ID is required" });
        }
        const trip = await tripService.getTripById(tripId);
        if (!trip) {
            return res.status(404).send({ status: "error", message: "Trip not found" });
        }
        if (!trip.transfers || trip.transfers.length === 0) {
            return res.status(404).send({ status: "error", message: "No transfers found for this trip" });
        }
        res.send({ status: "success", payload: trip.transfers });
    } catch (err) {
        res.status(500).send({ status: "error", message: err.message });
    }
});

tripsRouter.post("/transfer/:tripId", async (req, res) => {
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

tripsRouter.put("/transfer/:tripId/:transferId", async (req, res) => {
    try {
        const { tripId, transferId } = req.params;
        if (!tripId || !transferId) {
            return res.status(400).send({ status: "error", message: "Trip ID and Transfer ID are required" });
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
        const updatedTrip = await tripService.modifyTransferInTrip(tripId, transferId, transferData);
        if (!updatedTrip) {
            return res.status(404).send({ status: "error", message: "Transfer not found in trip" });
        }
        res.send({ status: "success", payload: updatedTrip });
    } catch (err) {
        res.status(500).send({ status: "error", message: err.message });
    }
});

tripsRouter.delete("/transfer/:tripId/:transferId", async (req, res) => {
    try {
        const { tripId, transferId } = req.params;
        if (!tripId || !transferId) {
            return res.status(400).send({ status: "error", message: "Trip ID and Transfer ID are required" });
        }
        const deletedTransfer = await tripService.deleteTransferFromTrip(tripId, transferId);
        if (!deletedTransfer) {
            return res.status(404).send({ status: "error", message: "Transfer not found in trip" });
        }
        res.send({ status: "success", payload: deletedTransfer });
    } catch (err) {
        res.status(500).send({ status: "error", message: err.message });
    }
});

// Expenses
tripsRouter.get("/expense/:tripId", async (req, res) => {
    try {
        const { tripId } = req.params;
        if (!tripId) {
            return res.status(400).send({ status: "error", message: "Trip ID is required" });
        }
        const trip = await tripService.getTripById(tripId);
        if (!trip) {
            return res.status(404).send({ status: "error", message: "Trip not found" });
        }
        if (!trip.expenses || trip.expenses.length === 0) {
            return res.status(404).send({ status: "error", message: "No expenses found for this trip" });
        }
        res.send({ status: "success", payload: trip.expenses });
    } catch (err) {
        res.status(500).send({ status: "error", message: err.message });
    }
});

tripsRouter.post("/expense/:tripId", async (req, res) => {
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

tripsRouter.post("/budget/:tripId", async (req, res) => {
    try {
        const { tripId } = req.params;
        if (!tripId) {
            return res.status(400).send({ status: "error", message: "Trip ID is required" });
        }
        const budgetData = req.body;
        if (!budgetData.amount) {
            return res.status(400).send({ status: "error", message: "Amount are required for the budget" });
        }
        const updatedTrip = await tripService.addBudgetToTrip(tripId, budgetData.amount);
        res.send({ status: "success", payload: updatedTrip });
    } catch (err) {
        res.status(500).send({ status: "error", message: err.message });
    }
});

//Blogs
tripsRouter.get("/blog/:tripId", async (req, res) => {
    try {
        const { tripId } = req.params;
        if (!tripId) {
            return res.status(400).send({ status: "error", message: "Trip ID is required" });
        }
        const trip = await tripService.getTripById(tripId);
        if (!trip) {
            return res.status(404).send({ status: "error", message: "Trip not found" });
        }
        if (!trip.blog || trip.blog.length === 0) {
            return res.status(404).send({ status: "error", message: "No blogs found for this trip" });
        }
        res.send({ status: "success", payload: trip.blog });
    } catch (err) {
        res.status(500).send({ status: "error", message: err.message });
    }
});

tripsRouter.post("/blog/:tripId", async (req, res) => {
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

tripsRouter.put("/blog/:tripId/:blogId", async (req, res) => {
    try {
        const { tripId, blogId } = req.params;
        if (!tripId || !blogId) {
            return res.status(400).send({ status: "error", message: "Trip ID and Blog ID are required" });
        }
        const blogData = req.body;
        if (!blogData.title || !blogData.content) {
            return res.status(400).send({ status: "error", message: "Title and content are required for the blog" });
        }
        const updatedTrip = await tripService.modifyBlogInTrip(tripId, blogId, blogData);
        if (!updatedTrip) {
            return res.status(404).send({ status: "error", message: "Blog not found in trip" });
        }
        res.send({ status: "success", payload: updatedTrip });
    } catch (err) {
        res.status(500).send({ status: "error", message: err.message });
    }
});
tripsRouter.delete("/blog/:tripId/:blogId", async (req, res) => {
    try {
        const { tripId, blogId } = req.params;
        if (!tripId || !blogId) {
            return res.status(400).send({ status: "error", message: "Trip ID and Blog ID are required" });
        }
        const deletedBlog = await tripService.deleteBlogFromTrip(tripId, blogId);
        if (!deletedBlog) {
            return res.status(404).send({ status: "error", message: "Blog not found in trip" });
        }
        res.send({ status: "success", payload: deletedBlog });
    } catch (err) {
        res.status(500).send({ status: "error", message: err.message });
    }
});

// Day Data
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