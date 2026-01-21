// src/backend/appwrite.js
import { Client, Account, Databases, Storage } from "appwrite";

// ✅ Initialize Appwrite client
const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1";
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;

const client = new Client();

if (endpoint && projectId) {
  client.setEndpoint(endpoint).setProject(projectId);
} else {
  console.error("⚠️ Appwrite Environment Variables missing! Check your Vercel settings.");
}

// ✅ Services
const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);

export { client, account, databases, storage };
