import userModel from './models/user.model.js';

export default class UserManager {
    async createUser(userData) {
        return await userModel.create(userData);
    }

    async getUserById(userId) {
        return await userModel.findById(userId);
    }

    async getUserbyEmail(opt = {}) {
        return await userModel.findOne(opt).populate('trips', '_id name');
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
        return await userModel.findByIdAndUpdate(
            userId,
            { $push: { trips: tripId } },
            { new: true }
        );
    }
}
        