"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var typeorm_1 = require("typeorm");
var data_1 = require("@myorg/data");
function seed() {
    return __awaiter(this, void 0, void 0, function () {
        var ds, orgRepo, userRepo, org, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    ds = new typeorm_1.DataSource({
                        type: 'postgres',
                        host: 'localhost',
                        port: 5432,
                        username: 'postgres',
                        password: 'P@ssw0rd4132',
                        database: 'turbovets',
                        entities: [data_1.Task, data_1.User, data_1.Organization],
                        synchronize: true,
                    });
                    return [4 /*yield*/, ds.initialize()];
                case 1:
                    _a.sent();
                    orgRepo = ds.getRepository(data_1.Organization);
                    userRepo = ds.getRepository(data_1.User);
                    return [4 /*yield*/, orgRepo.findOneBy({ name: 'Acme Org' })];
                case 2:
                    org = _a.sent();
                    if (!!org) return [3 /*break*/, 4];
                    org = orgRepo.create({ name: 'Acme Org' });
                    return [4 /*yield*/, orgRepo.save(org)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [4 /*yield*/, userRepo.findOne({ where: { email: 'owner@example.com' } })];
                case 5:
                    user = _a.sent();
                    if (!!user) return [3 /*break*/, 7];
                    user = userRepo.create({
                        email: 'owner@example.com',
                        password: 'password123',
                        role: 'OWNER',
                        organization: org,
                    });
                    return [4 /*yield*/, userRepo.save(user)];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7:
                    console.log('Seed complete. Credentials: owner@example.com / password123');
                    return [4 /*yield*/, ds.destroy()];
                case 8:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
seed().catch(function (err) {
    console.error('Seeding failed', err);
    process.exit(1);
});
