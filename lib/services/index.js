"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.services = void 0;
const users_1 = require("./users/users");
const services = (app) => {
    app.configure(users_1.users);
    // All services will be registered here
};
exports.services = services;
//# sourceMappingURL=index.js.map