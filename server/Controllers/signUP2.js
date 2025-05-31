import bcrypt from "bcrypt";
import db from "../db.js";
const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;
export const signUp= async (req, res) => {
    const {
      firstName,
      lastName,
      address,
      day,
      month,
      year,
      gender,
      mobileNumber,
      email,
      password,
      confirmPassword,
    } = req.body;
  
    const isValidName = (name) => /^[a-zA-Z]{2,30}$/.test(name);
    const isValidPhone = (phone) => /^\d{10}$/.test(phone);
    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isValidPassword = (pw) => {
      return (
        pw.length >= 8 &&
        /[A-Z]/.test(pw) &&
        /[0-9]/.test(pw) &&
        /[!@#$%^&*(),.?":{}|<>\-_=+\[\]\\/;'`~]/.test(pw)
      );
    };
    const isValidDate = (d, m, y) => {
      const date = new Date(y, m - 1, d);
      return (
        date.getFullYear() == y && date.getMonth() == m - 1 && date.getDate() == d
      );
    };
  
    const d = parseInt(day),
      m = parseInt(month),
      y = parseInt(year);
  
    if (!firstName || !isValidName(firstName)) {
      return res
        .status(400)
        .json({ error: "First name must be 2-30 letters only" });
    }
    if (!lastName || !isValidName(lastName)) {
      return res
        .status(400)
        .json({ error: "Last name must be 2-30 letters only" });
    }
    if (!address || address.length < 5) {
      return res
        .status(400)
        .json({ error: "Address must be at least 5 characters" });
    }
    if (!d || !m || !y || !isValidDate(d, m, y)) {
      return res.status(400).json({ error: "Invalid date of birth" });
    }
    if (!gender || !["male", "female"].includes(gender.toLowerCase())) {
      return res.status(400).json({ error: "Please select a gender" });
    }
    if (!mobileNumber || !isValidPhone(mobileNumber)) {
      return res
        .status(400)
        .json({ error: "Phone number must be exactly 10 digits" });
    }
    if (!email || !isValidEmail(email)) {
      return res
        .status(400)
        .json({ error: "Please enter a valid email address" });
    }
    if (!password || !isValidPassword(password)) {
      return res.status(400).json({
        error:
          "Password must be at least 8 characters with at least one uppercase letter, one number, and one symbol",
      });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }
  
    const birthDate = new Date(y, m - 1, d);
    const ageDiff = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDiff);
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);
  
    if (age < 13) {
      return res.status(400).json({ error: "You must be at least 13 years old" });
    }
  
    try {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const query = `
        INSERT INTO users (firstname, lastname, password, phonenumber, email, age, address, gender)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id, email, firstname, lastname
      `;
      const values = [
        firstName,
        lastName,
        hashedPassword,
        mobileNumber,
        email,
        age,
        address,
        gender,
      ];
  
      const result = await db.query(query, values);
      const user = result.rows[0];
  
      res.status(201).json({
        message: "User created successfully",
        user: user,
      });
    } catch (error) {
      console.error("Error during signup:", error);
      if (error.code === "23505") {
        if (error.constraint === "users_email_key") {
          return res.status(400).json({ error: "Email already exists" });
        }
        if (error.constraint === "users_phonenumber_key") {
          return res.status(400).json({ error: "Phone number already exists" });
        }
      }
      res.status(500).json({ error: "Internal server error" });
    }
};
  