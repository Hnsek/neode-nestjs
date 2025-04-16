"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var NeodeModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NeodeModule = void 0;
const common_1 = require("@nestjs/common");
const neode_1 = require("neode");
const neode_2 = __importDefault(require("neode"));
const isTimestamped = true;
const handleWarn = (schema) => new common_1.Logger('NeodeModule', { timestamp: isTimestamped }).warn(`Could not install schema ${schema}. Already installed ?`);
let NeodeModule = NeodeModule_1 = class NeodeModule {
    static forRoot(connection) {
        if (!connection) {
            return {
                module: NeodeModule_1,
                global: true,
                providers: [
                    {
                        provide: 'Connection',
                        useFactory: () => __awaiter(this, void 0, void 0, function* () {
                            const connect = yield (0, neode_1.fromEnv)();
                            return connect;
                        }),
                    },
                ],
                exports: ['Connection'],
            };
        }
        return {
            module: NeodeModule_1,
            global: true,
            providers: [
                {
                    provide: 'Connection',
                    useFactory: () => __awaiter(this, void 0, void 0, function* () {
                        const connect = yield new neode_2.default(`${connection.host}:${connection.port}`, connection.username, connection.password);
                        return connect;
                    })
                }
            ]
        };
    }
    static forFeature(schema, connection) {
        if (!connection) {
            return {
                module: NeodeModule_1,
                global: false,
                providers: [
                    {
                        provide: 'CONFIG',
                        useValue: schema,
                    },
                    {
                        provide: 'Connection',
                        useFactory: () => __awaiter(this, void 0, void 0, function* () {
                            const connect = yield (0, neode_1.fromEnv)().with(schema);
                            try {
                                yield connect.schema.install();
                            }
                            catch (error) {
                                handleWarn(Object.keys(schema)[0]);
                            }
                            finally {
                                return connect;
                            }
                        }),
                        inject: ['CONFIG'],
                    },
                ],
                exports: ['Connection'],
            };
        }
        return {
            module: NeodeModule_1,
            global: false,
            providers: [
                {
                    provide: 'CONFIG',
                    useValue: schema,
                },
                {
                    provide: 'Connection',
                    useFactory: () => __awaiter(this, void 0, void 0, function* () {
                        const connect = yield new neode_2.default(`${connection.host}:${connection.port}`, connection.username, connection.password).with(schema);
                        try {
                            yield connect.schema.install();
                        }
                        catch (error) {
                            handleWarn(Object.keys(schema)[0]);
                        }
                        finally {
                            return connect;
                        }
                    }),
                    inject: ['CONFIG'],
                },
            ],
            exports: ['Connection'],
        };
    }
};
exports.NeodeModule = NeodeModule;
exports.NeodeModule = NeodeModule = NeodeModule_1 = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({})
], NeodeModule);
