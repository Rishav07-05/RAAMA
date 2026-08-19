"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpServer = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const publicRoutes_1 = __importDefault(require("./routes/publicRoutes"));
const qrRoutes_1 = __importDefault(require("./routes/qrRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const SocketService_1 = require("./services/SocketService");
const CleanupHoldJob_1 = require("./jobs/CleanupHoldJob");
const rateLimiter_1 = require("./middleware/rateLimiter");
dotenv_1.default.config();
const app = (0, express_1.default)();
exports.app = app;
const httpServer = http_1.default.createServer(app);
exports.httpServer = httpServer;
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hotel_raama';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
// 1. Security & Body Middlewares
app.use((0, helmet_1.default)({ contentSecurityPolicy: false }));
app.use((0, cors_1.default)({
    origin: [CLIENT_URL, 'http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)('dev'));
app.use('/api', rateLimiter_1.apiLimiter);
// 2. Register Routes
app.use('/api', publicRoutes_1.default);
app.use('/api', qrRoutes_1.default);
app.use('/api/admin', adminRoutes_1.default);
// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date(), service: 'Hotel Raama Backend API' });
});
// 3. Initialize Socket.IO Server & Cron Job
SocketService_1.SocketService.init(httpServer, CLIENT_URL);
(0, CleanupHoldJob_1.initCleanupHoldJob)();
// 4. Connect MongoDB & Start HTTP Server
mongoose_1.default
    .connect(MONGODB_URI)
    .then(() => {
    console.log('[MongoDB] Connected successfully to hotel_raama database.');
    httpServer.listen(PORT, () => {
        console.log(`[Server] Hotel Raama Backend API running at http://localhost:${PORT}`);
    });
})
    .catch((err) => {
    console.error('[MongoDB Error] Connection failed:', err);
    process.exit(1);
});
