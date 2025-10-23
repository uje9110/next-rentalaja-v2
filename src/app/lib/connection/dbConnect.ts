import mongoose, { Connection } from "mongoose";

const GLOBAL_DB_URI = process.env.MONGO_MAIN_URI as string;
if (!GLOBAL_DB_URI) {
  throw new Error("❌ Please define the MONGO_MAIN_URI environment variable");
}

const connections: Record<string, Connection> = {};

/**
 * Connects to the MongoDB database, ensuring proper connection handling.
 */
async function dbConnect(storeId?: string | null): Promise<Connection> {
  const connectionString = storeId
    ? GLOBAL_DB_URI.replace("GLOBAL", storeId)
    : GLOBAL_DB_URI;

  if (connections[connectionString]) {
    // console.log(`✅ Reusing existing connection for ${connectionString}`);
    return connections[connectionString];
  }

  try {
    // console.log(`🔗 Connecting to ${connectionString}...`);

    const conn = mongoose.createConnection(connectionString);

    // conn.on("connected", () =>
    //   console.log(`✅ Connected to ${connectionString}`),
    // );
    conn.on("error", (err) => console.error(`❌ Connection error:`, err));

    connections[connectionString] = conn;
    // console.log(connections);

    return conn;
  } catch (error) {
    // console.error(`❌ Database connection failed:`, error);
    throw error;
  }
}

/**
 * Disconnect a specific database connection
 * @param storeId - The store identifier or "global" for the main DB
 */
async function dbDisconnect(storeId: string | null) {
  const connectionString = storeId
    ? GLOBAL_DB_URI.replace("GLOBAL", storeId)
    : GLOBAL_DB_URI;

  if (connections[connectionString]) {
    await connections[connectionString].close(); // ✅ Close the specific connection
    delete connections[connectionString]; // ✅ Remove from tracking object
    console.log(`🛑 Disconnected from database: ${connectionString}`);
  }
}

export { dbConnect, dbDisconnect };
