import cors from "cors";
import express from "express"
import 'dotenv/config'
import { MongoClient, ObjectId } from "mongodb";
import bcrypt from "bcrypt"


const client = new MongoClient(process.env.MONGO_URI as string)
const db = client.db('dinos-store')
const users = db.collection('users')

client.connect()

console.log()

const app = express()
app.use(cors())
app.use(express.json())

app.listen(process.env.PORT, () => console.log('api running here 😎'))

app.get("/",async (req,res) => {
   const allUsers = await users.find().toArray()
    res.send(allUsers)
})

app.post("/", async (req,res) => {
    const userEmail = req.body.email
    const userPassword = req.body.password

   const hashPass = await bcrypt.hash(userPassword,10)
const createUser = await users.insertOne({email: userEmail, password:userPassword})
res.status(201).send(createUser)
})

app.delete("/:_id",async (req,res) => {
const cleanId = new ObjectId(req.params._id)
const deleteUser = await users.findOneAndDelete({_id: cleanId})
res.status(200).send(deleteUser)
})

app.patch("/:_id", async (req,res) => {
    const cleanId = new ObjectId(req.params._id)
const updateUser = await users.findOneAndUpdate({_id: cleanId},{$set:req.body})
res.send(updateUser)
})

app.post("/login", async (req,res) => {
    const userPassword = req.body.password
    const foundUser = await users.findOne({email:req.body.email})

    const passInDb = foundUser?.password
   await bcrypt.compare(userPassword, passInDb)
   
   res.send(foundUser)
})