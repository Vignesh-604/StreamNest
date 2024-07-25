import {Schema, model} from "mongoose";

const subscriptionSchema = new Schema({

  subscriber: {                         // One who subscibes
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  channel: {
    type: Schema.Types.ObjectId,        // The channel user subscribes to
    ref: "User"
  }
},{
    timestamps: true,
});

export const Subscription = model('Subscription', subscriptionSchema);