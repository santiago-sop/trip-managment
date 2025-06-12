import mongoose from "mongoose";
import userModel from './models/user.model.js';

export default class UserManager {
    async createUser(userData) {
        return await userModel.create(userData);
    }

    async getUserById(userId) {
        return await userModel.findById(userId);
    }

    async getUserbyEmail(opt = {}) {
        // trips es ahora un array de ObjectId, el populate funciona directo
        return await userModel.findOne(opt).populate('trips', '_id name');
    }

    async getUserByTripId(tripId) {
        // trips es ahora un array de ObjectId, la consulta es directa
        return await userModel.findOne({ trips: new mongoose.Types.ObjectId(tripId) }).populate('trips', '_id name');
    }

    async getUserByEmailAndPassword(email, password) {
        return await userModel.find({ email, password });
    }

    async updateUserById(userId, updateData) {
        return await userModel.findByIdAndUpdate(userId, updateData, { new: true });
    }

    async updateUserByEmail(email, updateData) {
        return await userModel.findOneAndUpdate({ email }, updateData, { new: true });
    }

    async deleteUserbyId(userId) {
        return await userModel.findByIdAndDelete(userId);
    }

    async deleteUserByEmail(opt = {}) {
        return await userModel.deleteOne(opt);
    }

    async getAllUsers() {
        return await userModel.find();
    }

    async pushTripToUser(userId, tripId) {
        // trips es ahora un array de ObjectId, el push es directo
        return await userModel.findByIdAndUpdate(
            userId,
            { $push: { trips: new mongoose.Types.ObjectId(tripId) } },
            { new: true }
        );
    }

    async pullTripFromUser(userId, tripId) {
        // trips es ahora un array de ObjectId, el pull es directo
        return await userModel.findByIdAndUpdate(
            userId,
            { $pull: { trips: new mongoose.Types.ObjectId(tripId) } },
            { new: true }
        );
    }
}
