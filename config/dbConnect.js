import mongoose from "mongoose";

const dbConnect = async () => {
    try {
        mongoose.set("strictQuery", true);
        const connected = await mongoose.connect(process.env.DB_URL);

        console.log(`MongoDB Connected ${connected.connection.host}`);
    
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

export default dbConnect;