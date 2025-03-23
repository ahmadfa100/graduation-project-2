import db from "../db.js";


export const getAllOffers = async (req, res) => {
  try {
    const { search, city, period, space } = req.query;
    const limit = parseInt(req.query.limit) || 3;    
    const offset = parseInt(req.query.offset) || 0;    

    let baseQuery = `SELECT * FROM offers WHERE 1=1`;
    const values = [];
    let paramIndex = 1;

    if (search) {
      baseQuery += ` AND landTitle ILIKE $${paramIndex}`;
      values.push(`%${search}%`);
      paramIndex++;
    }

    if (city) {
      baseQuery += ` AND landLocation ILIKE $${paramIndex}`;
      values.push(`%${city}%`);
      paramIndex++;
    }

    if (period) {
      baseQuery += ` AND leasePeriod = $${paramIndex}`;
      values.push(period);
      paramIndex++;
    }

    if (space) {
      baseQuery += ` AND landSize >= $${paramIndex}`;
      values.push(Number(space));
      paramIndex++;
    }

    
    baseQuery += ` ORDER BY id DESC LIMIT $${paramIndex}`;
    values.push(limit);
    paramIndex++;

    baseQuery += ` OFFSET $${paramIndex}`;
    values.push(offset);

    const result = await db.query(baseQuery, values);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching filtered offers:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
