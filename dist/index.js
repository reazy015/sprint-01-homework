"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const db_1 = require("./data-access-layer/db");
const PORT = process.env.PORT || 5000;
(0, db_1.rundb)();
app_1.app.listen(PORT, () => console.log(`Server started on localhost:${PORT}`));
//# sourceMappingURL=index.js.map