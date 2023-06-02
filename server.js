const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;
const bcrypt = require("bcrypt");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let dbConfig = {
  client: "mysql",
  connection: {
    user: "root",
    password: "ramadhana45",
    database: "projectakhir",
  },
};

if (process.env.NODE_ENV == "production") {
  dbConfig.connection.socketPath = process.env.GAE_DB_ADDRESS;
} else {
  dbConfig.connection.host = "127.0.0.1";
}
const knex = require("knex")(dbConfig);

const authenticate = (req, res, next) => {
  const { authorization } = req.headers;
  if (authorization === "123200150") {
    next();
  } else {
    res.sendStatus(401);
  }
};

app.get("/", (req, res) => {
  res.send("SELAMAT DATANG DI PROJECT KAMI UWUW");
});

// Service untuk tabel "user"
app.get("/users", authenticate, async (req, res) => {
  const result = await knex.select().table("user");
  res.json(result);
});

app.post("/users", authenticate, async (req, res) => {
  try {
    const insertedRows = await knex("user").insert({
      user_id: req.body.user_id,
      user_name: req.body.user_name,
      user_email: req.body.user_email,
      user_password: req.body.user_password,
    });
    if (insertedRows.length > 0) {
      res.json({ message: "User created successfully" });
    } else {
      res.status(500).json({ error: "Failed to create user" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/users/:user_id", authenticate, async (req, res) => {
  try {
    const updatedRows = await knex("user")
      .where({ user_id: req.params.user_id })
      .update({
        user_name: req.body.user_name,
        user_password: req.body.user_password,
      });

    if (updatedRows > 0) {
      res.json({ message: "User updated successfully" });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/users/:user_id", authenticate, async (req, res) => {
  const insertedRows = await knex("user")
    .where("user_id", req.params.user_id)
    .del();
  res.json({ message: "Data deleted successfully" });
});

// Service untuk tabel "barang"
app.get("/barang", authenticate, async (req, res) => {
  const result = await knex.select().table("barang");
  res.json(result);
});

app.get("/barang/:id_barang", authenticate, async (req, res) => {
  const { id_barang } = req.params;
  const result = await knex("barang").where({ id_barang }).first();
  if (result) {
    res.json(result);
  } else {
    res.status(404).json({ error: "Barang not found" });
  }
});

app.post("/barang", authenticate, async (req, res) => {
  try {
    const insertedRows = await knex("barang").insert({
      id_barang: req.body.id_barang,
      jenis: req.body.jenis,
      nama: req.body.nama,
      harga: req.body.harga,
    });
    if (insertedRows.length > 0) {
      res.json({ message: "Barang created successfully" });
    } else {
      res.status(500).json({ error: "Failed to create barang" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/barang/:id_barang", authenticate, async (req, res) => {
  try {
    const { id_barang } = req.params;
    const updatedRows = await knex("barang")
      .where({ id_barang })
      .update({
        jenis: req.body.jenis,
        nama: req.body.nama,
        harga: req.body.harga,
      });

    if (updatedRows > 0) {
      res.json({ message: "Barang updated successfully" });
    } else {
      res.status(404).json({ error: "Barang not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/barang/:id_barang", authenticate, async (req, res) => {
  const { id_barang } = req.params;
  const deletedRows = await knex("barang").where({ id_barang }).del();
  if (deletedRows > 0) {
    res.json({ message: "Barang deleted successfully" });
  } else {
    res.status(404).json({ error: "Barang not found" });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
