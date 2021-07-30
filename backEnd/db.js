import { join } from "path";
import { Low, JSONFile } from "lowdb";

// Use JSON file for storage
const file = join("", "db.json");
const adapter = new JSONFile(file);
const db = new Low(adapter);

db.data ||= { restaurants: [] };

export default db