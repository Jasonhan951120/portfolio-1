import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("leads.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    service TEXT NOT NULL,
    status TEXT DEFAULT 'New',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

function validateLeadInput(name: unknown, email: unknown, phone: unknown, service: unknown) {
    if (!name || !email || !phone || !service) return "All fields are required.";
    if (typeof name !== 'string' || name.trim().length < 1 || name.length > 200) return "Invalid name.";
    if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Invalid email address.";
    if (typeof phone !== 'string' || phone.trim().length < 5 || phone.length > 30) return "Invalid phone number.";
    if (typeof service !== 'string' || service.trim().length < 1 || service.length > 200) return "Invalid service.";
    return null;
}

async function startServer() {
    const app = express();
    const PORT = Number(process.env.PORT) || 5173;

    app.use(express.json({ limit: '10kb' }));

    // CORS
    const allowedOrigins = process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(',')
        : ['http://localhost:5173', 'http://localhost:3000'];

    app.use((req, res, next) => {
        const origin = req.headers.origin;
        if (origin && allowedOrigins.includes(origin)) {
            res.header('Access-Control-Allow-Origin', origin);
        }
        res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        if (req.method === 'OPTIONS') {
            res.sendStatus(200);
            return;
        }
        next();
    });

    // Enforce HTTPS in production
    if (process.env.NODE_ENV === "production") {
        app.use((req, res, next) => {
            if (req.headers["x-forwarded-proto"] !== "https") {
                res.redirect(`https://${req.headers.host}${req.url}`);
                return;
            }
            next();
        });
    }

    app.post("/api/leads", (req, res) => {
        const { name, email, phone, service } = req.body;
        const validationError = validateLeadInput(name, email, phone, service);
        if (validationError) {
            res.status(400).json({ error: validationError });
            return;
        }
        try {
            const stmt = db.prepare("INSERT INTO leads (name, email, phone, service) VALUES (?, ?, ?, ?)");
            const info = stmt.run(
                (name as string).trim(),
                (email as string).trim().toLowerCase(),
                (phone as string).trim(),
                (service as string).trim()
            );
            res.json({ id: info.lastInsertRowid, success: true });
        } catch {
            res.status(500).json({ error: "Failed to save lead" });
        }
    });

    app.get("/api/leads", (req, res) => {
        try {
            const leads = db.prepare("SELECT * FROM leads ORDER BY created_at DESC").all();
            res.json(leads);
        } catch {
            res.status(500).json({ error: "Failed to fetch leads" });
        }
    });

    app.patch("/api/leads/:id", (req, res) => {
        const { id } = req.params;
        const { status } = req.body;
        if (!status || typeof status !== 'string' || status.length > 100) {
            res.status(400).json({ error: "Invalid status." });
            return;
        }
        if (!/^\d+$/.test(id)) {
            res.status(400).json({ error: "Invalid ID." });
            return;
        }
        try {
            db.prepare("UPDATE leads SET status = ? WHERE id = ?").run(status.trim(), id);
            res.json({ success: true });
        } catch {
            res.status(500).json({ error: "Failed to update lead" });
        }
    });

    app.get("/api/stats", (req, res) => {
        try {
            const totalLeads = db.prepare("SELECT COUNT(*) as count FROM leads").get() as any;
            const newLeadsToday = db.prepare("SELECT COUNT(*) as count FROM leads WHERE date(created_at) = date('now')").get() as any;
            const pipelineValue = totalLeads.count * 2500;
            res.json({
                totalLeads: totalLeads.count,
                newLeadsToday: newLeadsToday.count,
                pipelineValue
            });
        } catch {
            res.status(500).json({ error: "Failed to fetch stats" });
        }
    });

    if (process.env.NODE_ENV !== "production") {
        const vite = await createViteServer({
            server: { middlewareMode: true },
            appType: "spa",
        });
        app.use(vite.middlewares);
    } else {
        app.use(express.static(path.join(__dirname, "dist")));
        app.get("*", (_req, res) => {
            res.sendFile(path.join(__dirname, "dist", "index.html"));
        });
    }

    app.listen(PORT, "0.0.0.0", () => {
        process.stdout.write(`Server running on http://localhost:${PORT}\n`);
    });
}

startServer();
