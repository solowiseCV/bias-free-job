import { MongoClient } from "mongodb";

const uri = process.env.DATABASE_URL!;
const client = new MongoClient(uri);

async function applyIndexes() {
  try {
    await client.connect();
    const db = client.db();
    const profiles = db.collection("Profile");

    await profiles.createIndex({ interestedRoles: 1 });
    await profiles.createIndex({ experienceLevel: 1 });
    await profiles.createIndex({ workMode: 1 });
    await profiles.createIndex({ jobType: 1 });
    await profiles.createIndex({ skills: 1 });
    await profiles.createIndex({ industry: 1 });

    console.log("Indexes created successfully");
  } catch (error) {
    console.error("Error applying indexes:", error);
  } finally {
    await client.close();
  }
}

applyIndexes();
