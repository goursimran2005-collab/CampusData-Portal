const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// DB
const db = new sqlite3.Database("students.db");

// TABLES
db.run(`CREATE TABLE IF NOT EXISTS students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  age INTEGER
)`);

db.run(`CREATE TABLE IF NOT EXISTS marks (
  id INTEGER PRIMARY KEY,
  maths INTEGER,
  physics INTEGER,
  chemistry INTEGER
)`);

// ADD
app.get("/add", (req, res) => {
  const { name, age, maths, physics, chemistry } = req.query;

  db.run(
    "INSERT INTO students (name, age) VALUES (?, ?)",
    [name, age],
    function (err) {
      const id = this.lastID;

      db.run(
        "INSERT INTO marks VALUES (?, ?, ?, ?)",
        [id, maths || 0, physics || 0, chemistry || 0],
        () => res.send("Added")
      );
    }
  );
});

// GET
app.get("/students", (req, res) => {
  db.all(`
    SELECT students.id, name, age, maths, physics, chemistry
    FROM students
    LEFT JOIN marks ON students.id = marks.id
  `, [], (err, rows) => res.json(rows));
});

// UPDATE
app.get("/update", (req, res) => {
  const { id, name, age, maths, physics, chemistry } = req.query;

  // Update student table
  db.run(
    "UPDATE students SET name=?, age=? WHERE id=?",
    [name, age, id],
    (err) => {
      if (err) return res.send(err);

      // Check if marks exist
      db.get("SELECT * FROM marks WHERE id=?", [id], (err, row) => {
        if (err) return res.send(err);

        if (row) {
          // ✅ UPDATE marks
          db.run(
            "UPDATE marks SET maths=?, physics=?, chemistry=? WHERE id=?",
            [maths || 0, physics || 0, chemistry || 0, id],
            (err) => {
              if (err) return res.send(err);
              res.send("Updated ✅");
            }
          );
        } else {
          // ✅ INSERT marks (only if not exists)
          db.run(
            "INSERT INTO marks (id, maths, physics, chemistry) VALUES (?, ?, ?, ?)",
            [id, maths || 0, physics || 0, chemistry || 0],
            (err) => {
              if (err) return res.send(err);
              res.send("Updated ✅");
            }
          );
        }
      });
    }
  );
});

// DELETE
app.get("/delete", (req, res) => {
  const { id } = req.query;

  db.run("DELETE FROM students WHERE id=?", [id]);
  db.run("DELETE FROM marks WHERE id=?", [id], () => res.send("Deleted"));
});

app.get("/topper/:subject", (req, res) => {
  const subject = req.params.subject;

  db.get(`
    SELECT students.name, ${subject}
    FROM marks
    JOIN students ON students.id = marks.id
    ORDER BY ${subject} DESC LIMIT 1
  `, (err, row) => {
    if (err) {
      console.log(err);
      return res.json({});
    }
    res.json(row || {});
  });
});

// LOGIN
app.get("/login", (req, res) => {
  const { username, password } = req.query;

  if (username === "admin" && password === "123") {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

// SERVER
app.listen(3000, () => {
  console.log("Server running on port 3000 🚀");
});