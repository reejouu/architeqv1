import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
    googleId:           { type: String, unique: true, sparse: true },
    email:              { type: String, required: true, unique: true },
    name:               { type: String, required: true },
    avatar:             { type: String },
    role:               { type: String, enum: ["Founder", "Product Manager", "Engineer", "Designer", "Other"] },
    teamSize:           { type: String, enum: ["Just me", "2-10", "11-50", "50+"] },
    intent:             { type: String, enum: ["Personal project", "Startup", "Client work", "Enterprise"] },
    onboardingComplete: { type: Boolean, default: false },
    createdAt:          { type: Date, default: Date.now },
    lastActiveAt:       { type: Date, default: Date.now },
});

export const User = mongoose.models.User ?? mongoose.model("User", UserSchema);