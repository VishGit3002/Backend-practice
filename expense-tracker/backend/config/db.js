import mongoose from "mongoose";

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Database connected successfully")
    } catch (error) {
        console.log("DB error", error)
    }
}

export default connectDB