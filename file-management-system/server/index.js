import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Supabase Client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_API_KEY
);

// Routes

// Fetch all files
app.get("/api/files", async (req, res) => {
  const { data, error } = await supabase.from("files").select("*");
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Add a new file
app.post("/api/files", async (req, res) => {
  const { name } = req.body;
  const { data, error } = await supabase.from("files").insert([{ name }]);
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data[0]);
});

// Delete a file
app.delete("/api/files/:id", async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from("files").delete().eq("id", id);
  if (error) return res.status(400).json({ error: error.message });
  res.status(204).send();
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
