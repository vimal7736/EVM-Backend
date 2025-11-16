import mongoose from "mongoose";

const connectEventDB = async () => {


  try {

    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Database connected: ${conn.connection.host}`);


  } catch (err) {

    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1);

  }
};

export default connectEventDB;
