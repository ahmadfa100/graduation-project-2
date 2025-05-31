import bcrypt from 'bcrypt';
import db from '../db.js';

export async function loginUser(req, res) {
  const { emailOrPhone, password } = req.body;
  if (!emailOrPhone || !password) {
    return res.status(400).json({ 
      error: 'Email/phone and password are required',
      errorType: 'validation' 
    });
  }

  try {
    const query = `SELECT * FROM users WHERE email = $1 OR phonenumber = $1`;
    const result = await db.query(query, [emailOrPhone]);

    if (result.rows.length === 0) {
      return res.status(401).json({ 
        error: 'Invalid email or phone number', 
        errorType: 'account' 
      });
    }

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ 
        error: 'Invalid password', 
        errorType: 'password' 
      });
    }

    const { password: _, ...userData } = user;
    req.session.user = userData;
    console.log('Session established. Session ID:', req.sessionID);

    res.status(200).json({
      message: 'Login successful',
      user: userData,
      sessionID: req.sessionID,
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      errorType: 'server' 
    });
  }
}




// import bcrypt from 'bcrypt';
// import db from '../db.js';

// export async function loginUser(req, res) {
//   const { emailOrPhone, password } = req.body;
//   if (!emailOrPhone || !password) {
//     return res.status(400).json({ error: 'Email/phone and password are required' });
//   }

//   try {
//     // Find user by email or phone
//     const query = `SELECT * FROM users WHERE email = $1 OR phonenumber = $1`;
//     const result = await db.query(query, [emailOrPhone]);

//     if (result.rows.length === 0) {
//       return res.status(401).json({ error: 'Invalid Account' });
//     }

//     const user = result.rows[0];
//     const match = await bcrypt.compare(password, user.password);
//     if (!match) {
//       return res.status(401).json({ error: 'Invalid password' });
//     }

//     // Strip password and create session
//     const { password: _, ...userData } = user;
//     req.session.user = userData;
//     console.log('Session established. Session ID:', req.sessionID);

//     // Return sessionID so front-end can capture it
//     res.status(200).json({
//       message: 'Login successful',
//       user: userData,
//       sessionID: req.sessionID,
//     });
//   } catch (error) {
//     console.error('Error during login:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// }