import TripManager from "./mongo/tripManager.js";
import UserManager from "./mongo/userManager.js";

export const userService = new UserManager();
export const tripService = new TripManager();