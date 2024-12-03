import mongoose from "mongoose";

import Message from "../models/message.model"; //imported just to be sure

const conversationSchema = new mongoose.Schema(
    {
        participants:
        [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            }
        ],

        messages:
        [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Message",
                default: [],
            },
        ],
    },

    {timestamps: true}

);


//replaced export with this; previous seems to be a cause of an overwrite error
export default mongoose.models.Conversation || mongoose.model("Conversation", conversationSchema);