const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
app.use(express.json())
app.use(cors());

require('dotenv').config();

//ummeaimanjannat
//7bH0BpIUSYOLX9r5


const { MongoClient, ServerApiVersion, Db, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}7bH0BpIUSYOLX9r5@cluster0.tzvbxiw.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.connect();

    const database = client.db("userDB");
    const userCollection = database.collection("users");
    const cartsCollection = database.collection("carts")
    // Send a ping to confirm a successful connection
   app.get('/users', async(req, res) =>{
    const cursor = userCollection.find();
    
    const result = await cursor.toArray();
    res.send(result);
   }) 

   app.put('/users/:id', async(req,res)=>{
    const id = req.params.id;
    const user = req.body;
    console.log("user",user);
    console.log('id',id);
    const filter={_id:new ObjectId(id)};
    const options={
      upsert:true
    }
    const updatedUser={
      $set:{
        name:user.name,
        photo:user.photo,
        brandName:user.brandName,
        price:user.price,
        rating:user.rating,
        type:user.type

      }
    }
    const result = await userCollection.updateOne(filter, updatedUser,options);
    res.send(result);
    })

   app.get('/users/:id',async(req,res)=>{
    const id = req.params.id;
    const query = {_id:new ObjectId(id)}
    const user = await userCollection.findOne(query);
    res.send(user);
   })

   app.delete('/carts/:id', async(req, res)=>{

    const id = req.params.id;
    const query = {_id:new ObjectId(id)};
    const result = await cartsCollection.deleteOne(query);
    res.send(result);
    
   })
    
  app.get('/carts', async(req, res) =>{
    const cursor = cartsCollection.find();
    const result = await cursor.toArray();
    res.send(result);
   }) 
    app.post('/users', async(req, res)=>{
      const user = req.body;
      console.log('new user',user);
      const result = await userCollection.insertOne(user);
      res.send(result);
      
    
    
    })
    app.post('/carts', async(req, res)=>{
      const user = req.body;
      console.log('new user',user);
      const result = await cartsCollection.insertOne(user);
      res.send(result);
      
    
    
    })
    
    
    
    
    
    
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    
  }
}
run().catch(console.dir);


app.get('/', (req, res)=>{
    res.send('simple crud is running');
})


app.listen(port, ()=>{
    console.log('simple crud is running on port')
})