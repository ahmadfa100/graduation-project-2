import db from "../db.js";

export const SignUp=async(req,res)=>{
    
        const { FirstName, LastName, Address, dob, gender, MobileNumber, EmailAddress, NewPassword } = req.body;
      
        try {
          // 1. Hash the password with salt
          const saltRounds = 10;
          const hashedPassword = await bcrypt.hash(password, saltRounds);
      
          // 2. Insert into database with hashed password
          const query = `
            INSERT INTO users (first_name, last_name, address, date_of_birth, gender, phone, email, password)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          `;
          const values = [firstName, lastName, address, dob, gender, phone, email, hashedPassword];
      
          await pool.query(query, values);
          res.send('User signed up successfully!');
        } catch (err) {
          console.error(err);
          res.status(500).send('Error saving user');
        }
      
}