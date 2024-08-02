const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const tableRoutes = require('./routes/tables');
const userRoutes = require('./routes/users');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend's origin
  credentials: true
}));
app.use(express.json());

const mongoUrl = "mongodb://127.0.0.1:27017/register?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.0.1";


const connectToMongo = () => {
    main()
    .then(() => {
      console.log("connected to mongo successfully");
    })
    .catch((err) => console.log(err));
  async function main() {
    await mongoose.connect(mongoUrl);
  }
}
connectToMongo();

app.use('/api/tables', tableRoutes);
app.use('/api/users', userRoutes); 

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
