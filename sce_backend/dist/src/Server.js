"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const App_1 = __importDefault(require("./App"));
const port = process.env.PORT;
(0, App_1.default)().then((app) => {
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}!`);
    });
});
//# sourceMappingURL=Server.js.map