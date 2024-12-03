import mongoose from "mongoose";

const { Schema } = mongoose;

const feedbackSchema = new Schema(
    {
        session: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true },
        reviewer: { type: mongoose.Types.ObjectId, ref: "User", require: true },
        reviewee: { type: mongoose.Types.ObjectId, ref: "User", require: true },
        rating: { type: Number, require: true },
        feedback: { type: String, require: true }
    },
    {
        timestamps: true
    }
)

export default mongoose.models.Feedback || mongoose.model("Feedback", feedbackSchema);