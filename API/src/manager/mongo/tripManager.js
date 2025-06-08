import tripModel from "./models/trip.model.js";

export default class TripManager {

    async createTrip(tripData) {
        return await tripModel.create(tripData); 
    }

    async getTripById(tripId) {
        return await tripModel.findById(tripId).populate('participants');
    }

    getTrip(opt={}){
        return tripModel.findOne(opt).populate('participants');
    }

    async updateTrip(tripId, updateData) {
        return await tripModel.findByIdAndUpdate(tripId, updateData, { new: true });
    }

    async deleteTrip(tripId) {
        return await tripModel.findByIdAndDelete(tripId);
    }

    async getAllTrips() {
        return await tripModel.find().populate('participants');
    }
    
    async getTripsByUserId(userId) {
        return await tripModel.find({ participants: userId }).populate('participants');
    }

    async getDayDataForTrip(tripId, date = new Date()) {
        // 1. search trip by ID
        const trip = await tripModel.findById(tripId).populate('participants');
        if (!trip) throw new Error('Trip not found');
        //console.log('Trip found:', trip);
        // 2. Verify that the user is a participant of the trip
        /*
        const isParticipant = trip.participants.some(
            participant => participant._id.toString() === userId.toString()
        );
        if (!isParticipant) throw new Error('User is not a participant of this trip');
        */

        // 3. Extract the time from the date parameter
        const inputDate = new Date(date);
        inputDate.setHours(0, 0, 0, 0); // Set time to midnight for comparison

        // 4. Verify that inputDate is within the trip dates
        const startDate = new Date(trip.startDate);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(trip.endDate);
        endDate.setHours(0, 0, 0, 0);
        if (inputDate < startDate || inputDate > endDate) {
            throw new Error('The date is not within the trip dates');
        }

        // 5. Search activity for inputDay
        const activity = trip.activities?.find(a => {
            if (!a.date) return false;
            const actDate = new Date(a.date);
            actDate.setHours(0, 0, 0, 0);
            return actDate.getTime() === inputDate.getTime();
        });
        //console.log('Activity found:', activity);
        // 6. Search stay for inputDay
        const stay = trip.stays?.find(s => {
            if (!s.startDate || !s.endDate) return false;
            const stayStart = new Date(s.startDate);
            const stayEnd = new Date(s.endDate);
            stayStart.setHours(0, 0, 0, 0);
            stayEnd.setHours(0, 0, 0, 0);
            return inputDate >= stayStart && inputDate <= stayEnd;
        });

        // 7. Search transfer for inputDay
        const transfer = trip.transfers?.find(t => {
            if (!t.startDate || !t.endDate) return false;
            const transferStart = new Date(t.startDate);
            const transferEnd = new Date(t.endDate);
            transferStart.setHours(0, 0, 0, 0);
            transferEnd.setHours(0, 0, 0, 0);
            return inputDate >= transferStart && inputDate <= transferEnd;
        });

        return {
            city: activity?.city || null,
            activity: activity?.name || null,
            transfer: transfer
                ? { name: transfer.name, starTime: transfer.starTime, transferId: transfer._id }
                : null,
            stay: stay
                ? { name: stay.name, checkin: stay.checkin, stayId: stay._id }
                : null
        };
    }
    
    async addParticipantToTrip(tripId, userId) {
        return await tripModel.findByIdAndUpdate(
            tripId,
            { $addToSet: { participants: userId } },
            { new: true }
        );
    }

    async removeParticipantFromTrip(tripId, userId) {
        return await tripModel.findByIdAndUpdate(
            tripId,
            { $pull: { participants: userId } },
            { new: true }
        );
    }

    async addActivityToTrip(tripId, activity) {
        return await tripModel.findByIdAndUpdate(
            tripId,
            { $push: { activities: activity } },
            { new: true }
        );
    }

    async addStayToTrip(tripId, stay) {
        return await tripModel.findByIdAndUpdate(
            tripId,
            { $push: { stays: stay } },
            { new: true }
        );
    }

    async addTransferToTrip(tripId, transfer) {
        return await tripModel.findByIdAndUpdate(
            tripId,
            { $push: { transfers: transfer } },
            { new: true }
        );
    }

    async addBlogToTrip(tripId, blog) {
        return await tripModel.findByIdAndUpdate(
            tripId,
            { $push: { blog: blog } },
            { new: true }
        );
    }

    async deleteActivityFromTrip(tripId, activityId) {
        return await tripModel.findByIdAndUpdate(
            tripId,
            { $pull: { activities: { _id: activityId } } },
            { new: true }
        );
    }

    async deleteStayFromTrip(tripId, stayId) {
        return await tripModel.findByIdAndUpdate(
            tripId,
            { $pull: { stays: { _id: stayId } } },
            { new: true }
        );
    }

    async deleteTransferFromTrip(tripId, transferId) {
        return await tripModel.findByIdAndUpdate(
            tripId,
            { $pull: { transfers: { _id: transferId } } },
            { new: true }
        );
    }

    async deleteBlogFromTrip(tripId, blogId) {
        return await tripModel.findByIdAndUpdate(
            tripId,
            { $pull: { blog: { _id: blogId } } },
            { new: true }
        );
    }

    async getBudgetForTrip(tripId) {
        const trip = await tripModel.findById(tripId);
        if (!trip) throw new Error('Trip not found');
        return trip.budget;
    }

    async updateBudgetForTrip(tripId, budget) {
        return await tripModel.findByIdAndUpdate(
            tripId,
            { budget: budget },
            { new: true }
        );
    }

    async addBudgetToTrip(tripId, amount) {
        return await tripModel.findByIdAndUpdate(
            tripId,
            { $inc: { budget: amount } },
            { new: true }
        );
    }

    async subtractBudgetFromTrip(tripId, amount) {
        return await tripModel.findByIdAndUpdate(
            tripId,
            { $inc: { budget: -amount } },
            { new: true }
        );
    }

    async addExpenseToTrip(tripId, expense) {
        if (!expense || !expense.amount) {
            throw new Error('Expense must have a name and amount');
        }
        this.subtractBudgetFromTrip(tripId, expense.amount);
        return await tripModel.findByIdAndUpdate(
            tripId,
            { $push: { expenses: expense } },
            { new: true }
        );
    }

    async getBudgetDailyForRestOfTrip(tripId, date = new Date()) {
        const trip = await tripModel.findById(tripId);
        if (!trip) throw new Error('Trip not found');
        const today = new Date(date);
        today.setHours(0, 0, 0, 0); // Set time to midnight for comparison
        const endDate = new Date(trip.endDate);
        endDate.setHours(0, 0, 0, 0); // Set time to midnight for comparison

        if (today > endDate) {
            throw new Error('Today is after the trip end date');
        }
        const remainingDays = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24)) + 1; // Include today
        const restBudget = trip.budget;
        const dailyBudget = restBudget / remainingDays;
        return {
            remainingDays: remainingDays,
            dailyBudget: dailyBudget.toFixed(2),
            restBudget: restBudget.toFixed(2)
        };
    }
}