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
var readline = require("readline");
// 서로 다른 세자리 수 생성 함수 (랜던값)
function generateRandomNumbers() {
    var randomNumbers = [];
    while (randomNumbers.length < 3) {
        var num = Math.floor(Math.random() * 9 + 1);
        var checkDuplicate = false;
        var i = 0;
        while (i < randomNumbers.length) {
            if (randomNumbers[i] === num) {
                checkDuplicate = true;
                break;
            }
            i++;
        }
        if (checkDuplicate === false) {
            randomNumbers.push(num);
        }
    }
    return randomNumbers;
}
function getHint(computerNumber, userNumber) {
    var strikes = 0;
    var balls = 0;
    var i = 0;
    while (i < 3) {
        if (computerNumber[i] === userNumber[i]) {
            strikes++;
        }
        else {
            var j = 0;
            while (j < 3) {
                if (computerNumber[j] === userNumber[i]) {
                    balls++;
                    break;
                }
                j++;
            }
        }
        i++;
    }
    if (strikes === 0 && balls === 0) {
        return '낫싱';
    }
    else if (strikes === 0 && balls !== 0) {
        return "".concat(balls, "\uBCFC");
    }
    else if (strikes !== 0 && balls === 0) {
        return "".concat(strikes, "\uC2A4\uD2B8\uB77C\uC774\uD06C");
    }
    else {
        return "".concat(balls, "\uBCFC ").concat(strikes, "\uC2A4\uD2B8\uB77C\uC774\uD06C");
    }
}
function getNumber(rl) {
    return __awaiter(this, void 0, void 0, function () {
        var computerNumber, userInput, userNumber, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('\n');
                    console.log('컴퓨터가 숫자를 뽑았습니다.\n');
                    computerNumber = generateRandomNumbers();
                    _a.label = 1;
                case 1:
                    if (!true) return [3 /*break*/, 3];
                    return [4 /*yield*/, new Promise(function (resolve) {
                            return rl.question('숫자를 입력해주세요: ', resolve);
                        })];
                case 2:
                    userInput = _a.sent();
                    userNumber = userInput.split('').map(Number);
                    if (userNumber.length !== 3 ||
                        userNumber.includes(0) ||
                        new Set(userNumber).size !== 3) {
                        console.log('1~9까지의 숫자 중에서 서로 다른 세자리 수를 입력하세요.\n');
                        return [3 /*break*/, 1];
                    }
                    result = getHint(computerNumber, userNumber);
                    console.log(result);
                    if (result === '3스트라이크') {
                        console.log('\n');
                        console.log('3개의 숫자를 모두 맞히셨습니다.');
                        console.log('-------게임 종료-------');
                        return [3 /*break*/, 3];
                    }
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function gameStart() {
    return __awaiter(this, void 0, void 0, function () {
        var rl, input;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    rl = readline.createInterface({
                        input: process.stdin,
                        output: process.stdout,
                    });
                    _a.label = 1;
                case 1:
                    if (!true) return [3 /*break*/, 6];
                    return [4 /*yield*/, new Promise(function (resolve) {
                            return rl.question('게임을 새로 시작하려면 1, 종료하려면 9를 입력하세요.\n', resolve);
                        })];
                case 2:
                    input = _a.sent();
                    if (!(input === '1')) return [3 /*break*/, 4];
                    return [4 /*yield*/, getNumber(rl)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    if (input === '9') {
                        // console.log('\n');
                        console.log('\n애플리케이션이 종료되었습니다.');
                        rl.close();
                        return [3 /*break*/, 6];
                    }
                    else {
                        console.log('잘못된 입력입니다. 1 또는 9를 입력해주세요.');
                    }
                    _a.label = 5;
                case 5:
                    console.log('\n');
                    return [3 /*break*/, 1];
                case 6: return [2 /*return*/];
            }
        });
    });
}
gameStart();
