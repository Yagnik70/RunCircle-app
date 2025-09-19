import db from "../config/db.js";

const MAX_DISTANCE_KM = 50;

export const createRoute = (req, res) => {
    const user_id = req.user.id; 
    const { from, to, distance_km } = req.body;

    if (!from || !to || !distance_km) {
        return res.status(400).json({ message: "missing fields" });
    }

    if (distance_km > MAX_DISTANCE_KM) {
        return res.status(400).json({ message: `Route distance cannot exceed ${MAX_DISTANCE_KM} km within Ahmedabad` });
    }

    const sql = "INSERT INTO routes (user_id, from_location, to_location, distance_km) VALUES (?, ?, ?, ?)";
    db.query(sql, [user_id, from, to, distance_km], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ message: "Route Created", route_id: result.insertId, distance_km });
    });
};

export const getUserRoutes = (req, res) => {
    const user_id = req.user.id;

    const sql = "SELECT * FROM routes WHERE user_id = ?";
    db.query(sql, [user_id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
};

export const getSports = (req, res) => {
    const sql = "SELECT * FROM sports";
    db.query(sql, (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
};

export const saveRoute = (req, res) => {
    const user_id = req.user.id;
    const { route_id, sport_id } = req.body;

    if (!route_id || !sport_id) {
        return res.status(400).json({ message: "missing fields" });
    }

    const sql = "INSERT INTO saved_routes (user_id, route_id, sport_id) VALUES (?, ?, ?)";
    db.query(sql, [user_id, route_id, sport_id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ message: "Route saved with sport", saved_id: result.insertId });
    });
};

export const getSavedRoutes = (req, res) => {
    const user_id = req.user.id;

    const sql = `
        SELECT sr.id, r.from_location, r.to_location, r.distance_km, s.name AS sport
        FROM saved_routes sr
        JOIN routes r ON sr.route_id = r.id
        JOIN sports s ON sr.sport_id = s.id
        WHERE sr.user_id = ?
    `;
    db.query(sql, [user_id], (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
};
