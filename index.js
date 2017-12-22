var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
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
define("types", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
});
define("index", ["require", "exports", "xml2js", "isomorphic-fetch"], function (require, exports, xml2js, fetch) {
    "use strict";
    var _this = this;
    exports.__esModule = true;
    var parser = new xml2js.Parser({
        trim: true
    });
    var parsePromise = function (text) {
        return new Promise(function (resolve, reject) {
            parser.parseString(text, function (error, result) {
                if (error)
                    reject(error);
                resolve(result);
            });
        });
    };
    exports.getPodcast = function (feedUrl) { return __awaiter(_this, void 0, void 0, function () {
        var feedResponse, channel, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, exports.fetchFeed(feedUrl)];
                case 1:
                    feedResponse = _a.sent();
                    channel = feedResponse.rss.channel[0];
                    return [2 /*return*/, {
                            meta: exports.getPodcastMeta(channel),
                            episodes: exports.getPodcastEpisodes(channel)
                        }];
                case 2:
                    e_1 = _a.sent();
                    throw new Error(e_1);
                case 3: return [2 /*return*/];
            }
        });
    }); };
    exports.fetchFeed = function (url) { return __awaiter(_this, void 0, void 0, function () {
        var feedResponse, feedText, feedObject, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, fetch(url)];
                case 1:
                    feedResponse = _a.sent();
                    return [4 /*yield*/, feedResponse.text()];
                case 2:
                    feedText = _a.sent();
                    return [4 /*yield*/, parsePromise(feedText)];
                case 3:
                    feedObject = _a.sent();
                    return [2 /*return*/, feedObject];
                case 4:
                    e_2 = _a.sent();
                    throw new Error(e_2);
                case 5: return [2 /*return*/];
            }
        });
    }); };
    exports.getPodcastMeta = function (rssChannel) {
        return {
            title: rssChannel.title[0],
            description: rssChannel.description[0],
            image: rssChannel.image[0].link[0]
        };
    };
    exports.getPodcastEpisodes = function (rssChannel) {
        var episodes = [];
        rssChannel.item.forEach(function (item) {
            episodes.push({
                title: item.title[0],
                publicationDate: new Date(item.pubDate[0]),
                link: item.link[0],
                description: item.description[0]
            });
        });
        return episodes;
    };
});
