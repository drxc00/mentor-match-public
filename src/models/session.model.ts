import mongoose from "mongoose";

const { Schema } = mongoose;

const sessionSchema = new Schema(
  {
    tutor: { type: mongoose.Types.ObjectId, ref: "User", require: true },
    student: { type: mongoose.Types.ObjectId, ref: "User", require: true },
    course_code: { type: String, require: true },
    course_name: { type: String, require: true },
    description: { type: String, require: true },
    date: { type: Date },
    start_time: { type: String },
    end_time: { type: String },
    status: { type: String },
    duration_minutes: { type: Number },
    duration_seconds: { type: Number },
    chat_isActive: { type: Boolean },
    conversation: { type: mongoose.Types.ObjectId, ref: "Conversation" },
    feedbacks: [{ type: mongoose.Types.ObjectId, ref: "Feedback" }],
    additionalFeedback: [{ type: mongoose.Types.ObjectId, ref: "AdditionalFeedback" }]
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Session || mongoose.model("Session", sessionSchema);
