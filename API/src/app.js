import express from 'express';
import usersRouter from './routes/users.router.js';
import tripsRouter from './routes/trip.router.js';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();  

// Habilita CORS para tu frontend local
app.use(cors({
  origin: 'http://localhost:3000', // Cambia esto según tu frontend
  credentials: true
}));

const PORT = process.env.PORT || 8080;

const CONECTION_STRING = "mongodb+srv://oops93119:tJP59hOwfWVzq6Fo@clustertripmanagment.u5ctfqg.mongodb.net/trip-managment?retryWrites=true&w=majority&appName=ClusterTripManagment";

// Connect to MongoDB
mongoose.connect(CONECTION_STRING)

app.listen(PORT,()=>console.log(`Listening on port ${PORT}`));

app.use(express.json()); // Middleware to parse JSON bodies

app.use(express.static('./src/public')); // Serve static files from the 'public' directory

app.use('/api/users', usersRouter); // Users API routes

app.use('/api/trips', tripsRouter); // Trips API routes
