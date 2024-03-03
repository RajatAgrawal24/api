const mongoose  = require('mongoose')

const connectDb = () => {
    return mongoose.connect(process.env.LIVE_URL)
    .then(()=>{
        console.log("Connected to MongoDB")
    }).catch((err)=>{
        console.log(err);
    })
}

module.exports = connectDb;