"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const PORT = process.env.PORT || 3003;
app_1.app.listen(PORT, () => `Server started on localhost:${PORT}`);
