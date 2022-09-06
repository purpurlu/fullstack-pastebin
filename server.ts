import { Client } from "pg";
import { config } from "dotenv";
import express from "express";
import cors from "cors";

config(); //Read .env file lines as though they were env vars.

//Call this script with the environment variable LOCAL set if you want to connect to a local db (i.e. without SSL)
//Do not set the environment variable LOCAL if you want to connect to a heroku DB.

//For the ssl property of the DB connection config, use a value of...
// false - when connecting to a local DB
// { rejectUnauthorized: false } - when connecting to a heroku DB
const herokuSSLSetting = { rejectUnauthorized: false }
const sslSetting = process.env.LOCAL ? false : herokuSSLSetting
const dbConfig = {
  connectionString: process.env.LOCAL ? process.env.DATABASE_URL_LOCAL : process.env.DATABASE_URL,
  ssl: sslSetting,
  //ssl: false,
};

const app = express();

app.use(express.json()); //add body parser to each following route handler
app.use(cors()) //add CORS support to each following route handler

const client = new Client(dbConfig);
client.connect();

// app.get("/", async (req, res)=> {
  
// })

app.get("/pastes", async (req, res) => {
  try {
    const dbres = await client.query('select title, body from pastes ORDER BY id_paste DESC LIMIT 10');
    res.status(200).json(dbres.rows);
  }
  catch (err) {
    console.error(err)
  }
  
});

app.post("/pastes", async(req, res) => {
  try {
      const {title, body} = req.body
      if (body !== ("")) {
        const newPaste = await client.query("INSERT INTO pastes (title, body) VALUES($1, $2) RETURNING *", [title, body])
        res.status(200).json(newPaste.rows)
      }
      else {
        res.status(500).json("THE BODY CANNOT BE EMPTY")
      }
    }
  catch (err) {
    console.error(err)
  }
})

//Start the server on the given port
const port = process.env.PORT;
if (!port) {
  throw 'Missing PORT environment variable.  Set it in .env file.';
}




app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});
