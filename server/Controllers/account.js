 import db from "../db.js";
 export const getUser=async (req, res) => {
    try {
      const userID = Number(req.query.userID);
      if (!userID) return res.status(400).json({ error: "userID is required" });
      const response = await db.query("SELECT * FROM users WHERE id = $1", [
        userID,
      ]);
      if (response.rowCount === 0)
        return res.status(404).json({ error: "User not found" });
      res.json(response.rows[0]);
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  export const account = async (req, res) => {
    if (!req.session.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
  
    try {
      const dbase = await db.query(
        `
        SELECT firstname, lastname, email, phonenumber, gender, address, age, encode(pfp, 'base64') AS profileimage 
        FROM users 
        WHERE id = $1`,
        [req.session.user.id]
      );
  
      if (dbase.rowCount === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      const user = dbase.rows[0];
  
      res.json({
        fullName: `${user.firstname} ${user.lastname}`,
        email: user.email,
        mobileNumber: user.phonenumber,
        gender: user.gender,
        address: user.address,
        age: user.age,
        profileImage: user.profileimage
          ? `data:image/png;base64,${user.profileimage}`
          : null,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  };
  export const updateAccount=async (req, res) => {
    if (!req.session.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
  
    const { fullName, email, mobileNumber, gender, address, age, password } =
      req.body;
  
    if (!req.session.user.id)
      return res.status(400).json({ error: "Missing userId" });
  
    // same validators as signup
    const isValidName = (n) => /^[a-zA-Z\s]{2,30}$/.test(n);
    const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
    const isValidPhone = (p) => /^\d{10}$/.test(p);
    const isValidAddress = (a) => a && a.trim().length >= 5;
    const isValidAge = (a) => {
      const n = parseInt(a, 10);
      return !isNaN(n) && n >= 13;
    };
    const isValidPassword = (pw) =>
      pw.length >= 8 &&
      /[A-Z]/.test(pw) &&
      /[0-9]/.test(pw) &&
      /[!@#$%^&*(),.?":{}|<>\-_=+\[\]\\/;'`~]/.test(pw);
  
    try {
      if (fullName !== undefined) {
        if (!isValidName(fullName)) {
          return res
            .status(400)
            .json({ error: "Name must be 2-30 letters and spaces only" });
        }
        const [first, ...rest] = fullName.split(" ");
        const last = rest.join(" ") || "";
        await db.query(
          `UPDATE users SET firstname = $1, lastname = $2 WHERE id = $3`,
          [first, last, req.session.user.id]
        );
      }
      if (email !== undefined) {
        if (!isValidEmail(email)) {
          return res.status(400).json({ error: "Please enter a valid email" });
        }
        await db.query(`UPDATE users SET email = $1 WHERE id = $2`, [
          email,
          req.session.user.id,
        ]);
      }
      if (mobileNumber !== undefined) {
        if (!isValidPhone(mobileNumber)) {
          return res
            .status(400)
            .json({ error: "Phone number must be exactly 10 digits" });
        }
        await db.query(`UPDATE users SET phonenumber = $1 WHERE id = $2`, [
          mobileNumber,
          req.session.user.id,
        ]);
      }
      if (gender !== undefined) {
        if (!["male", "female"].includes(gender.toLowerCase())) {
          return res.status(400).json({ error: "Please select a gender" });
        }
        await db.query(`UPDATE users SET gender = $1 WHERE id = $2`, [
          gender,
          req.session.user.id,
        ]);
      }
      if (address !== undefined) {
        if (!isValidAddress(address)) {
          return res
            .status(400)
            .json({ error: "Address must be at least 5 characters" });
        }
        await db.query(`UPDATE users SET address = $1 WHERE id = $2`, [
          address,
          req.session.user.id,
        ]);
      }
      if (age !== undefined) {
        if (!isValidAge(age)) {
          return res
            .status(400)
            .json({ error: "You must be at least 13 years old" });
        }
        await db.query(`UPDATE users SET age = $1 WHERE id = $2`, [
          parseInt(age, 10),
          req.session.user.id,
        ]);
      }
      if (password !== undefined) {
        if (!isValidPassword(password)) {
          return res.status(400).json({
            error:
              "Password must be at least 8 characters with one uppercase letter, one number, and one symbol",
          });
        }
        const hashed = await bcrypt.hash(password, 10);
        await db.query(`UPDATE users SET password = $1 WHERE id = $2`, [
          hashed,
          req.session.user.id,
        ]);
      }
  
      res.json({ success: true });
    } catch (err) {
      console.error("Update failed:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  export const accountUploadImage= async (req, res) => {
    if (!req.session.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
  
    const { image } = req.body;
    if (!image) return res.status(400).json({ error: "Missing image" });
  
    try {
      const base64Data = image.split(",")[1];
      const buffer = Buffer.from(base64Data, "base64");
      await db.query(`UPDATE users SET pfp = $1 WHERE id = $2`, [
        buffer,
        req.session.user.id,
      ]);
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Image upload failed" });
    }
  };

  export const accountDeleteImage=async (req, res) => {
    if (!req.session.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
  
    try {
      await db.query(`UPDATE users SET pfp = NULL WHERE id = $1`, [
        req.session.user.id,
      ]);
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Image deletion failed" });
    }
  };
  