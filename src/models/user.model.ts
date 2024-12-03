import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
    {
        username: { type: String, unique: true, require: true },
        name: { type: String, unique: false, require: true },
        university_number: { type: String, unique: true, require: true },
        email: { type: String, unique: true, require: true },
        program: { type: String, unique: false, require: true },
        password: { type: String, unique: false, require: true },
        role: { type: String, unique: false, require: false },
        tags: [{ type: String, unique: false, require: false }],
        profile_picture: { type: String, unique: false, require: false },
    },
    { timestamps: true }
);

// either exports the User model or create the user model.
export default mongoose.models.User || mongoose.model("User", userSchema);