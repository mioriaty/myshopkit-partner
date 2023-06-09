"use strict";
const sectionCard = document.getElementById("section-card");
const checkboxGroup = Array.from(document.querySelectorAll(".checkbox-container input[type='checkbox']"));
const inputSearch = document.getElementById("search-input");
const clearButton = document.querySelector(".button-reset");
const appCount = document.querySelector(".app-count");
const listApps = Array.from(document.querySelectorAll("#section-card .card-app"));
function debounce(callback, waitFor) {
    let timeout = 0;
    return (...args) => {
        let result;
        clearTimeout(timeout);
        timeout = window.setTimeout(() => {
            result = callback(...args);
        }, waitFor);
        return result;
    };
}
function compareArrays(arr1, arr2) {
    // loop through the first array
    for (let i = 0; i < arr1.length; i++) {
        const element = arr1[i];
        // check if the element exists in the second array
        if (!arr2.includes(element)) {
            return false;
        }
    }
    return true;
}
function handleRedirect(link) {
    window.open(link, "_blank");
}
const checkValueIncudesInArray = (arrStr, str) => arrStr.some((item) => item.toLowerCase() === str.toLowerCase());
let searchValue = "";
let checkboxValues = [];
function filterCards(searchVal, categories) {
    listApps.forEach((card) => {
        var _a, _b;
        const cardSearchValue = ((_a = card.getAttribute("data-search")) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || "";
        const cardCategoryValue = ((_b = card.getAttribute("data-category")) === null || _b === void 0 ? void 0 : _b.toLowerCase()) || "";
        const _cardCategoryValue = cardCategoryValue
            .split(",")
            .map((c) => c.trim());
        const hasSearchMatch = searchVal
            ? cardSearchValue.includes(searchVal)
            : true;
        const hasCheckboxMatch = categories.length === 0 ||
            _cardCategoryValue.some((c) => categories.includes(c));
        if (hasSearchMatch && hasCheckboxMatch) {
            card.classList.remove("hide");
        }
        else {
            card.classList.add("hide");
        }
    });
    const quantity = listApps.filter((card) => !card.classList.contains("hide")).length;
    appCount.innerText = `${quantity}`;
}
inputSearch.addEventListener("input", debounce((event) => {
    const target = event.target;
    searchValue = target.value;
    filterCards(searchValue, checkboxValues);
}, 200));
checkboxGroup.forEach((item) => {
    item.addEventListener("change", (event) => {
        const inputElement = event.target;
        const checked = inputElement.checked;
        if (checked) {
            checkboxValues = [...checkboxValues, inputElement.value];
        }
        else {
            checkboxValues = checkboxValues.filter((value) => value !== inputElement.value);
        }
        filterCards(searchValue, checkboxValues);
    });
});
clearButton.addEventListener("click", () => {
    inputSearch.value = "";
    checkboxGroup.forEach((item) => (item.checked = false));
    filterCards("", []);
});
