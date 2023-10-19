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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
exports.mailService = {
    sendConfimationEmail(email, confirmationCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const transport = nodemailer_1.default.createTransport({
                service: 'gmail',
                auth: {
                    user: 'redshuhart015@gmail.com',
                    pass: 'wwhkbzjzhcwofwqj',
                },
            });
            try {
                yield transport.sendMail({
                    from: '"It-kamasutra 👻" <redshuhart015@gmail.com>',
                    to: email,
                    subject: 'Hello ✔',
                    text: 'Hello world?',
                    html: `<h1>Thank for your registration</h1>
        <p>To finish registration please follow the link below:
            <a href='https://somesite.com/confirm-email?code=${confirmationCode}'>complete registration</a>
        </p>`,
                });
            }
            catch (error) {
                console.log(error);
                return false;
            }
            return true;
        });
    },
};
//# sourceMappingURL=mail-service.js.map