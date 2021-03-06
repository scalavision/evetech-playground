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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
exports.__esModule = true;
exports.getNames = exports.getOrdersByCorporation = exports.sortByName = exports.sortNames = exports.getAllOrdersByCorporation = exports.getAllOrdersByCorporationUrl = exports.typeIdsFromOrders = void 0;
var axios_1 = require("axios");
var _ = require("lodash");
var httpHandler_1 = require("./httpHandler");
function typeIdsFromOrders(orders) {
    return orders.map(function (_a) {
        var type_id = _a.type_id;
        return type_id;
    });
}
exports.typeIdsFromOrders = typeIdsFromOrders;
var Api = 'https://esi.evetech.net/latest';
function getAllOrdersByCorporationUrl(corporationId, dataSource, pagination) {
    if (dataSource === void 0) { dataSource = 'tranquility'; }
    if (pagination === void 0) { pagination = 1; }
    return Api + "/markets/" + corporationId + "/orders/?datasource=" + dataSource + "&order_type=all&page=" + pagination;
}
exports.getAllOrdersByCorporationUrl = getAllOrdersByCorporationUrl;
function logError(error) {
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log("error.response:" + error.response.status);
        console.log("" + JSON.stringify(error.response.headers));
        console.log("" + JSON.stringify(error.response.data));
    }
    else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log("error.request:" + error.request);
    }
    else {
        // Something happened in setting up the request that triggered an Error
        console.log('error.message', error.message);
    }
    console.log("error.config:" + JSON.stringify(error.config));
}
var getAllOrdersByCorporation = function (corporationId, dataSource, pagination) {
    if (dataSource === void 0) { dataSource = 'tranquility'; }
    if (pagination === void 0) { pagination = 1; }
    return __awaiter(void 0, void 0, void 0, function () {
        var url, result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = getAllOrdersByCorporationUrl(corporationId, dataSource, pagination);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios_1["default"].get(url)];
                case 2:
                    result = _a.sent();
                    return [2 /*return*/, result.data];
                case 3:
                    error_1 = _a.sent();
                    logError(error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
};
exports.getAllOrdersByCorporation = getAllOrdersByCorporation;
function sortNames(names, orderBy) {
    if (orderBy === void 0) { orderBy = 'ascending'; }
    return _.sortBy(names, [function (name) { return name.name.toLowerCase(); }], [orderBy]);
}
exports.sortNames = sortNames;
function sortByName(a, b) {
    if (a.name < b.name)
        return -1;
    if (a.name > b.name)
        return 1;
    return 0;
}
exports.sortByName = sortByName;
var getOrdersByCorporation = function (corporationId) { return __awaiter(void 0, void 0, void 0, function () {
    var orders, typeIds;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, httpHandler_1.httpWithRetry)(function () { return (0, exports.getAllOrdersByCorporation)(corporationId); }, 5)];
            case 1:
                orders = _a.sent();
                console.log("fetched: " + orders.length + " orders");
                typeIds = typeIdsFromOrders(orders);
                return [2 /*return*/, typeIds];
        }
    });
}); };
exports.getOrdersByCorporation = getOrdersByCorporation;
var getNames = function (type_ids) { return __awaiter(void 0, void 0, void 0, function () {
    var url, result, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (type_ids.length === 0)
                    return [2 /*return*/, []];
                if (type_ids.length >= 1000)
                    throw Error('Unable to handle request for 1000 or more orders');
                url = Api + "/universe/names/?datasource=tranquility";
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, axios_1["default"].post(url, type_ids)];
            case 2:
                result = _a.sent();
                return [2 /*return*/, result.data];
            case 3:
                error_2 = _a.sent();
                logError(error_2);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getNames = getNames;
