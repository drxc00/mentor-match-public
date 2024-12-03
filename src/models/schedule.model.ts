import mongoose from "mongoose";

const { Schema } = mongoose;

const scheduleSchema = new Schema(
    {
        tutor: { type: mongoose.Types.ObjectId, ref: "User", require: true },
        permanent_indexes: {
            type: [[Number]], // Define an array of arrays of strings
        },
        transient_dates: [{ date: Date, start_time: String, end_time: String }]
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Schedule || mongoose.model("Schedule", scheduleSchema);
