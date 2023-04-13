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
const partner_url = "https://pokeapi.co/api/v2/pokemon";
const btn = document.querySelector("#test-button");
const body = document.body;
const loader = document.getElementById("loading-spinner");
class Store {
    getPartnerApps({ onFailure, onSuccess, onLoading }) {
        return __awaiter(this, void 0, void 0, function* () {
            onLoading === null || onLoading === void 0 ? void 0 : onLoading();
            try {
                const response = yield fetch(partner_url);
                const data = yield response.json();
                onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess();
                return data;
            }
            catch (error) {
                onFailure === null || onFailure === void 0 ? void 0 : onFailure(error);
            }
        });
    }
}
const store = new Store();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield store.getPartnerApps({
            onLoading() {
                loader.classList.add("display");
            },
            onSuccess() {
                loader.classList.remove("display");
            },
        });
    });
}
main();
