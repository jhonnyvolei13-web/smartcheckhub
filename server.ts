import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const DATA_DIR = path.join(process.cwd(), "data");
const CACHE_FILE = path.join(DATA_DIR, "catalog-cache.json");

let cachedCatalog: any = null;

// Initialize cache from disk if present
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (fs.existsSync(CACHE_FILE)) {
    const raw = fs.readFileSync(CACHE_FILE, "utf-8");
    cachedCatalog = JSON.parse(raw);
    console.log(`[SmartCheck Server] Loaded cached catalog from disk with ${cachedCatalog?.activities?.length || 0} activities.`);
  }
} catch (loadErr) {
  console.warn("[SmartCheck Server] Warning loading disk cache:", loadErr);
}

function persistCatalogToDisk(data: any) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (data) {
      fs.writeFileSync(CACHE_FILE, JSON.stringify(data), "utf-8");
    } else if (fs.existsSync(CACHE_FILE)) {
      fs.unlinkSync(CACHE_FILE);
    }
  } catch (saveErr) {
    console.warn("[SmartCheck Server] Failed to write catalog cache to disk:", saveErr);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      service: "SMARTCHECK HUB API"
    });
  });

  // Get current stored catalog
  app.get("/api/catalog", (req, res) => {
    res.json({
      success: true,
      catalog: cachedCatalog
    });
  });

  // Store uploaded/processed catalog on server
  app.post("/api/catalog", (req, res) => {
    try {
      const { catalog } = req.body;
      if (!catalog) {
        return res.status(400).json({ error: "Dados de catálogo não fornecidos." });
      }
      cachedCatalog = catalog;
      persistCatalogToDisk(catalog);
      return res.json({ success: true, message: "Catálogo sincronizado e salvo no servidor com sucesso." });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || "Erro ao salvar catálogo." });
    }
  });

  // Reset to default
  app.post("/api/catalog/reset", (req, res) => {
    cachedCatalog = null;
    persistCatalogToDisk(null);
    res.json({ success: true, message: "Catálogo resetado para o padrão." });
  });

  // Vite middleware for development vs static serve for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SMARTCHECK HUB Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
