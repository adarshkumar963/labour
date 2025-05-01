import mongoose from "mongoose";
export const dbConnection=()=>{
    mongoose.connect(process.env.MONGO_URI,{
        dbName: "LABOUR_WORKLINK",
    }).then(()=>{
        console.log('Connected to datebase!')
    })
    .catch(err=>{
        console.log(`some error occoured while connecting to  datebase: ${err}`);
    });
}