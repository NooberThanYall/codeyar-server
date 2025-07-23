import mongoose from "mongoose";

const ActivitySchema  = new mongoose.Schema({
   userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
   },
   action: {
      type: String,
      enum: ['like', 'view', 'query']
   },
   itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Snippet'
   },
   query: {
      type: String,
      default: ''
   },
   // MetaData : {},
   
}, {
   timestamps: true
});

export const Activity = mongoose.models.Activity || mongoose.model('Activity', ActivitySchema)