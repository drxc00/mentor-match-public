import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config()

const mongoUrl: any = process.env.MONGO_URL;

const connect = async () => {
    if(mongoose.connections[0].readyState) return;

    try {
        await mongoose.connect(mongoUrl);
        console.log("Connection Successful");
    } catch (err) {
        throw new Error("Error With Database Connection: " + err);
    }
}

export default connect;