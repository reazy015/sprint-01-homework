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
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersQueryRepository = void 0;
const mongodb_1 = require("mongodb");
const db_1 = require("../../db/db");
const usersCollection = db_1.db.collection('users');
const noneConfirmedUsersCollection = db_1.db.collection('users');
exports.usersQueryRepository = {
    getUsers(queryParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const { pageNumber, pageSize, sortBy, sortDirection, searchEmailTerm, searchLoginTerm } = queryParams;
            const sort = sortDirection === 'asc' ? 1 : -1;
            const filter = {
                $or: [
                    { login: { $regex: searchLoginTerm, $options: 'i' } },
                    { email: { $regex: searchEmailTerm, $options: 'i' } },
                ],
            };
            const totalUsersCount = yield usersCollection.countDocuments(filter);
            const users = yield usersCollection
                .find(filter)
                .sort({ [sortBy]: sort })
                .skip(+pageSize * (+pageNumber - 1))
                .limit(+pageSize)
                .toArray();
            return {
                totalCount: totalUsersCount,
                pagesCount: Math.ceil(totalUsersCount / +pageSize),
                page: +pageNumber,
                pageSize: +pageSize,
                items: users.map((user) => ({
                    id: user._id.toString(),
                    login: user.login,
                    email: user.email,
                    createdAt: user.createdAt,
                })),
            };
        });
    },
    getSingleUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield usersCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
            if (!user) {
                return null;
            }
            return {
                id: user._id.toString(),
                login: user.login,
                email: user.email,
                createdAt: user.createdAt,
            };
        });
    },
    getUserHashAndSaltByEmailOrLogin(emailOrLogin) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield usersCollection.findOne({
                $or: [{ login: emailOrLogin }, { email: emailOrLogin }],
            });
            if (!user) {
                return null;
            }
            return {
                salt: user.salt,
                hash: user.hash,
            };
        });
    },
    getUserByEmailOrLogin(emailOrLogin) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield usersCollection.findOne({
                $or: [{ login: emailOrLogin }, { email: emailOrLogin }],
            });
            if (!user)
                return null;
            return {
                id: user._id.toString(),
                login: user.login,
                email: user.email,
                createdAt: user.createdAt,
                hash: user.hash,
            };
        });
    },
    getUserConfirmationCodeByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield noneConfirmedUsersCollection.findOne({ email });
            if (!user) {
                return null;
            }
            return user.confirmationCode;
        });
    },
    isConfirmedUser(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield noneConfirmedUsersCollection.findOne({ email });
            return user ? user.confirmed : false;
        });
    },
    isConfirmedUserByCode(confirmationCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield noneConfirmedUsersCollection.findOne({ confirmationCode });
            return user ? user.confirmed : false;
        });
    },
};
//# sourceMappingURL=users-query-repository.js.map