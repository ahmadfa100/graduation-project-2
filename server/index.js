import express from 'express';
import cors from 'cors';
import pg from 'pg';
import env from 'dotenv';
const app = express();
const port =3500;
env.config();
app.use(cors());
app.use(express.json());

const db=new  pg.Client({
    user: process.env.DBuser,
    host: process.env.DBhost,
    database:process.env.databaseName,
    password: process.env.DBpassword,
    port: process.env.DBport,
});

db.connect().then(()=> console.log('Data base connection established')).catch(()=> console.log("Data base connection Error"));


// app.post("/register", async(req, res)=>{
// const [email,password] = req.body;
// const response=  await db.query("SELECT Email FROM users where email=($1)", email);

// if(response.rows.length > 0){
//     return res.status(400).json({message: "Email already exists"});
// }else{
//     await db.query("INSERT INTO users (email, password) VALUES ($1, $2)", [email, password]);
//     return res.status(201).json({message: "User registered successfully"});
// }
// });

app.post("/addOffer", async (req, res) => {
    try {
        console.log("Received data:", req.body);

        const { offer_title, size, years, months, price, location, description, landOwnerID } = req.body;

        // Convert to numbers
        const leaseDuration = (parseInt(years) * 12) + parseInt(months);

        // Validate required fields
        if (!offer_title || !size || !location || !description || !price || isNaN(leaseDuration) || !landOwnerID) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const values = [offer_title, size, location, description, price, leaseDuration, landOwnerID];
        const response = await db.query(
            "INSERT INTO Offers (landTitle, landSize, landLocation, offerDescription, landLeasePrice, leaseDuration, OwnerID) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id",
            values
        );

        console.log("Offer added successfully:", response.rows[0]);
        res.json({ message: "Offer added successfully", offerId: response.rows[0].id });

    } catch (error) {
        console.error("Error adding offer:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});