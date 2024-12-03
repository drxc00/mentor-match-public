import mongoose from "mongoose";

const { Schema } = mongoose;

const addfeedbackSchema = new Schema(
    {
        session: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true },
        reviewer: { type: mongoose.Types.ObjectId, ref: "User", require: true },
        reviewee: { type: mongoose.Types.ObjectId, ref: "User", require: true },
        // rating: { type: Number, require: true },
        additional_feedback: { type: String, require: true }
    },
    {
        timestamps: true
    }
)

export default mongoose.models.AdditionalFeedback || mongoose.model("AdditionalFeedback", addfeedbackSchema);