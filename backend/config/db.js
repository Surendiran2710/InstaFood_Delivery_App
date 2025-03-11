import mongoose from "mongoose";

export const connectDB=async()=>{
    await mongoose.connect('mongodb+srv://mernstackproject:6NpiKPM0d1wfB09k@cluster0.juoqp.mongodb.net/food-delivery').then(()=>console.log("DB Connected"));
}