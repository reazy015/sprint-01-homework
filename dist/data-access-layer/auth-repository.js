"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRepository = void 0;
const authDb = {
    admin: {
        login: 'admin',
        password: 'qwerty',
    },
};
exports.authRepository = {
    isValidBasicAuth(basicAuthString) {
        const [authType, string] = basicAuthString === null || basicAuthString === void 0 ? void 0 : basicAuthString.split(' ');
        if (authType !== 'Basic') {
            return false;
        }
        const decodedString = Buffer.from(string, 'base64').toString('ascii');
        const [login, password] = decodedString.split(':');
        if (login in authDb && password === authDb[login].password) {
            return true;
        }
        return false;
    },
};
//# sourceMappingURL=auth-repository.js.map