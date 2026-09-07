import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

let cachedCatalog: any = null;

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
      return res.json({ success: true, message: "Catálogo sincronizado com sucesso." });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || "Erro ao salvar catálogo." });
    }
  });

  // Reset to default
  app.post("/api/catalog/reset", (req, res) => {
    cachedCatalog = null;
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
