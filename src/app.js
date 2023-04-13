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
const partner_url = "https://randomuser.me/api/?results=50";
const btn = document.querySelector("#test-button");
const body = document.body;
const loader = document.getElementById("loading-spinner");
const sectionCard = document.getElementById("section-card");
const checkboxGroup = Array.from(document.querySelectorAll(".checkbox-container input[type='checkbox']"));
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
                throw new Error("Failed");
            }
        });
    }
}
function handleRedirect(link) {
    window.open(link, "_blank");
}
class ViewController {
    constructor() {
        this.renderData = () => {
            return this.data.map((item) => {
                const card = this.renderItem(item);
                sectionCard.innerHTML += `${card}`;
            });
        };
        this.renderItem = (item) => {
            console.log(this.filters);
            return /* html */ `
      <div data-gender="${item.gender}" class="col-md-4">
        <div class="card">
          <!-- card head -->
          <div class="_card-header">
            <div class="_card-header__image">
              <img class="img-fluid" src="${item.picture.medium}" />
            </div>

            <div>
              <button 
                data-id="${item.name.first}-${item.name.last}" 
                type="button" 
                class="_card-header__button" 
                onclick="handleRedirect('${item.picture.large}')">
                  Explore More</button>
            </div>

          </div>

          <!-- card body -->
          <div class="_card-body">
            <div class="_card-body__title">
              ${item.gender}
            </div>
            <div class="_card-body__description">
              ${item.name.first} ${item.name.last}
            </div>
          </div>

          <!-- card footer -->
          <div class="_card-footer">
            ${item.email}
          </div>
        </div>
      </div>
    `;
        };
        this.handleCheckbox = () => {
            checkboxGroup.forEach((item) => {
                item.addEventListener("change", (event) => {
                    const inputElement = event.target;
                    const checked = inputElement.checked;
                    if (checked) {
                        this.filters.push(inputElement.name);
                    }
                    else {
                        this.filters.filter((name) => name !== inputElement.name);
                    }
                });
            });
        };
        this.data = [];
        this.filters = [];
    }
    init(data) {
        this.data = data;
        this.renderData();
        this.handleCheckbox();
    }
}
const store = new Store();
const view = new ViewController();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield store.getPartnerApps({
            onLoading() {
                loader.classList.add("display");
            },
            onSuccess() {
                loader.classList.remove("display");
            },
        });
        view.init(data.results);
    });
}
main();
