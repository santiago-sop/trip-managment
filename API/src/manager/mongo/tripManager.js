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

    async getDayDataForTrip(userId, tripId) {
        // 1. Buscar el viaje
        const trip = await tripModel.findById(tripId).populate('participants');
        if (!trip) throw new Error('Trip not found');

        // 2. Verificar que el usuario es participante
        const isParticipant = trip.participants.some(
            participant => participant._id.toString() === userId.toString()
        );
        if (!isParticipant) throw new Error('User is not a participant of this trip');

        // 3. Fecha de hoy (sin hora)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // 4. Verificar que hoy está dentro del viaje
        const startDate = new Date(trip.startDate);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(trip.endDate);
        endDate.setHours(0, 0, 0, 0);
        if (today < startDate || today > endDate) {
            throw new Error('Today is not within the trip dates');
        }

        // 5. Buscar actividad para hoy
        const activity = trip.activities?.find(a => {
            if (!a.date) return false;
            const actDate = new Date(a.date);
            actDate.setHours(0, 0, 0, 0);
            return actDate.getTime() === today.getTime();
        });

        // 6. Buscar hospedaje (stay) para hoy
        const stay = trip.stays?.find(s => {
            if (!s.starDate || !s.endDate) return false;
            const stayStart = new Date(s.starDate);
            const stayEnd = new Date(s.endDate);
            stayStart.setHours(0, 0, 0, 0);
            stayEnd.setHours(0, 0, 0, 0);
            return today >= stayStart && today <= stayEnd;
        });

        // 7. Buscar traslado (transfer) para hoy
        const transfer = trip.transfers?.find(t => {
            if (!t.starDate || !t.endDate) return false;
            const transferStart = new Date(t.starDate);
            const transferEnd = new Date(t.endDate);
            transferStart.setHours(0, 0, 0, 0);
            transferEnd.setHours(0, 0, 0, 0);
            return today >= transferStart && today <= transferEnd;
        });

        return {
            city: activity?.city || null,
            activity: activity?.name || null,
            transfer: transfer
                ? { name: transfer.name, starTime: transfer.starTime }
                : null,
            stay: stay
                ? { name: stay.name, checkin: stay.checkin }
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
}