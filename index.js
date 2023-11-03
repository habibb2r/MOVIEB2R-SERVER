const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;



app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Hello World!');
})


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ir3lm70.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


    //Collection List
    const usersDB = client.db("movieB2R").collection("userCollection");




    // Operations

    app.get('/userList', async (req, res) => {
      const list = await usersDB.find().toArray();
      res.send(list);
    })
    app.post('/addUser', async (req, res) => {
      const data = req.body;
      const userEmail = { email : data.email}
      const isExisting = await usersDB.findOne(userEmail);
      if(isExisting){
          res.send({Exist: true})
      }
      else{
        const addedUser = await usersDB.insertOne(data)
        res.send({ addedUser,Exist : false});
      }
      
    })
    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
  
  }
}
run().catch(console.dir);




app.listen(port, () => {
    console.log(` server ${port}`)
})