import db from "../config/db.js";

export const createGroup = (req, res) => {
  console.log(" Incoming body:", req.body);
  const {
    name,
    type,
    description,
    created_by,
    target_minutes,
    start_date,
    end_date,
    location,
  } = req.body;

  db.query(
    "INSERT INTO `groups` (name, type, description, created_by) VALUES (?, ?, ?, ?)",
    [name, type, description, created_by],
    (err, result) => {
      if (err)
        return res.status(500).json({ success: false, error: err.message });

      const groupId = result.insertId;

      if (type === "challenge") {
        db.query(
          "INSERT INTO challenges (group_id, target_minutes, start_date, end_date) VALUES (?, ?, ?, ?)",
          [groupId, target_minutes, start_date, end_date],
          (err2) => {
            if (err2)
              return res
                .status(500)
                .json({ success: false, error: err2.message });
            res.status(201).json({ success: true, groupId });
          }
        );
      } else if (type === "club") {
        db.query(
          "INSERT INTO clubs (group_id, location) VALUES (?, ?)",
          [groupId, location],
          (err3) => {
            if (err3)
              return res
                .status(500)
                .json({ success: false, error: err3.message });
            res.status(201).json({ success: true, groupId });
          }
        );
      } else {
        res.status(201).json({ success: true, groupId });
      }
    }
  );
};

export const joinGroup = (req, res) => {
  const { user_id } = req.body;
  const groupId = parseInt(req.params.groupId);
  if (isNaN(groupId))
    return res.status(400).json({ success: false, error: "Invalid groupId" });

  db.query(
    "INSERT INTO group_members (user_id, group_id) VALUES (?, ?)",
    [user_id, groupId],
    (err) => {
      if (err)
        return res.status(500).json({ success: false, error: err.message });
      res.json({ success: true, message: "Joined group successfully" });
    }
  );
};

export const getGroups = (req, res) => {
  db.query("SELECT * FROM `groups`", (err, rows) => {
    if (err)
      return res.status(500).json({ success: false, error: err.message });
    res.json(rows);
  });
};

export const getGroupById = (req, res) => {
  const { groupId } = req.params;
  db.query("SELECT * FROM `groups` WHERE id = ?", [groupId], (err, groups) => {
    if (err)
      return res.status(500).json({ success: false, error: err.message });
    if (groups.length === 0)
      return res.status(404).json({ success: false, error: "Group not found" });

    let group = groups[0];

    if (group.type === "challenge") {
      db.query(
        "SELECT * FROM challenges WHERE group_id = ?",
        [groupId],
        (err2, challenge) => {
          if (err2)
            return res
              .status(500)
              .json({ success: false, error: err2.message });
          group.details = challenge[0];
          res.json(group);
        }
      );
    } else if (group.type === "club") {
      db.query(
        "SELECT * FROM clubs WHERE group_id = ?",
        [groupId],
        (err3, club) => {
          if (err3)
            return res
              .status(500)
              .json({ success: false, error: err3.message });
          group.details = club[0];
          res.json(group);
        }
      );
    } else {
      res.json(group);
    }
  });
};

export const getActiveGroupsByUser = (req, res) => {
  const { userId } = req.params;
  db.query(
    `SELECT g.* 
       FROM \`groups\` g
       JOIN group_members gm ON g.id = gm.group_id
      WHERE gm.user_id = ? AND gm.is_active = TRUE`,
    [userId],
    (err, rows) => {
      if (err)
        return res.status(500).json({ success: false, error: err.message });
      res.json(rows);
    }
  );
};

export const createClub = (req, res) => {
  if (!req.body)
    return res
      .status(400)
      .json({ success: false, error: "Request body missing" });

  const { location } = req.body;
  if (!location)
    return res
      .status(400)
      .json({ success: false, error: "Location is required" });

  const groupId = parseInt(req.params.groupId);
  if (isNaN(groupId))
    return res.status(400).json({ success: false, error: "Invalid groupId" });

  db.query(
    "INSERT INTO clubs (group_id, location) VALUES (?, ?)",
    [groupId, location],
    (err, result) => {
      if (err)
        return res.status(500).json({ success: false, error: err.message });
      res
        .status(201)
        .json({
          success: true,
          id: result.insertId,
          group_id: groupId,
          location,
        });
    }
  );
};

export const getClubsByGroup = (req, res) => {
  db.query(
    "SELECT * FROM clubs WHERE group_id = ?",
    [req.params.groupId],
    (err, rows) => {
      if (err)
        return res.status(500).json({ success: false, error: err.message });
      res.json(rows);
    }
  );
};

export const updateClub = (req, res) => {
  const { location } = req.body;
  const { id, groupId } = req.params;

  db.query(
    "UPDATE clubs SET location = ? WHERE id = ? AND group_id = ?",
    [location, id, groupId],
    (err, result) => {
      if (err)
        return res.status(500).json({ success: false, error: err.message });
      if (result.affectedRows === 0)
        return res
          .status(404)
          .json({ success: false, error: "Club not found or wrong groupId" });
      res.json({ success: true, message: "Club updated" });
    }
  );
};

export const deleteClub = (req, res) => {
  db.query("DELETE FROM clubs WHERE id = ?", [req.params.id], (err) => {
    if (err)
      return res.status(500).json({ success: false, error: err.message });
    res.json({ success: true, message: "Club deleted" });
  });
};
