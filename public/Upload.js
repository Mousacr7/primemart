import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";
import mime from "mime-types"; // for detecting correct content type

// --- Supabase config ---
const SUPABASE_URL = "https://lkdcpkdsyznswcdohwvs.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxrZGNwa2RzeXpuc3djZG9od3ZzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzY5OTM4MiwiZXhwIjoyMDczMjc1MzgyfQ.bMz_zO5O4l_83KvUyLe9abx4Mspp6TFv__7QqK5RiBQ"; // server-side only

const  supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// --- Get __dirname in ES module ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Path to your asset folder ---
const assetRoot = path.join(__dirname, "./asset");

// --- Recursively get all files in subfolders ---
function getAllFiles(dirPath, arrayOfFiles = [], basePath = "") {
  if (!fs.existsSync(dirPath)) return arrayOfFiles;

  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    const relativePath = path.join(basePath, file);

    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, arrayOfFiles, relativePath);
    } else {
      arrayOfFiles.push({ fullPath, relativePath });
    }
  });

  return arrayOfFiles;
}

// --- Upload files ---
// --- Upload files ---
async function UploadFiles() {
  const files = getAllFiles(assetRoot);
  console.log(`Found files: ${files.length}`);

  for (const { fullPath, relativePath } of files) {
    try {
      const fileBuffer = fs.readFileSync(fullPath);
      const contentType = mime.lookup(fullPath) || "application/octet-stream";

      const { error } = await supabase.storage
        .from("primemart") // your bucket name
        .upload(relativePath.replace(/\\/g, "/"), fileBuffer, {
          upsert: true,
          contentType,
          // Add this line to set the cache control header
          cacheControl: "31536000",
        });

      if (error) throw error;
      console.log("✅ Uploaded:", relativePath);
    } catch (err) {
      console.error("❌ Error uploading:", relativePath, err.message);
    }
  }
}
// --- Start upload ---
 UploadFiles();
