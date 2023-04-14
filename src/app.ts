const sectionCard = document.getElementById("section-card") as HTMLElement;

const checkboxGroup = Array.from(
  document.querySelectorAll(".checkbox-container input[type='checkbox']")
) as HTMLInputElement[];
const inputSearch = document.getElementById("search-input") as HTMLInputElement;

const clearButton = document.querySelector(
  ".button-reset"
) as HTMLButtonElement;

const appCount = document.querySelector(".app-count") as HTMLSpanElement;

const listApps = Array.from(
  document.querySelectorAll("#section-card .card-app")
);

function debounce<T extends (...args: any[]) => any>(
  callback: T,
  waitFor: number
) {
  let timeout = 0;
  return (...args: Parameters<T>): ReturnType<T> => {
    let result: any;
    clearTimeout(timeout);
    timeout = window.setTimeout(() => {
      result = callback(...args);
    }, waitFor);

    return result;
  };
}

function handleRedirect(link: string) {
  window.open(link, "_blank");
}

const checkValueIncudesInArray = (arrStr: string[], str: string) =>
  arrStr.some((item) => item.toLowerCase() === str.toLowerCase());

let searchValue = "";
let checkboxValues: string[] = [];

function filterCards(searchVal: string, checkboxVal: string[]) {
  listApps.forEach((card) => {
    const cardSearchValue =
      card.getAttribute("data-search")?.toLowerCase() || "";
    const cardCategoryValue =
      card.getAttribute("data-category")?.toLowerCase() || "";

    const hasSearchMatch = searchVal
      ? cardSearchValue.includes(searchVal)
      : true;
    const hasCheckboxMatch =
      checkboxVal.length === 0 || checkboxVal.includes(cardCategoryValue);

    if (hasSearchMatch && hasCheckboxMatch) {
      card.classList.remove("hide");
    } else {
      card.classList.add("hide");
    }
  });

  const quantity = listApps.filter(
    (card) => !card.classList.contains("hide")
  ).length;
  appCount.innerText = `${quantity}`;
}

inputSearch.addEventListener(
  "input",
  debounce((event) => {
    const target = event.target as HTMLInputElement;
    searchValue = target.value;

    filterCards(searchValue, checkboxValues);
  }, 200)
);

checkboxGroup.forEach((item) => {
  item.addEventListener("change", (event) => {
    const inputElement = event.target as HTMLInputElement;
    const checked = inputElement.checked;

    if (checked) {
      checkboxValues = [...checkboxValues, inputElement.value];
    } else {
      checkboxValues = checkboxValues.filter(
        (value) => value !== inputElement.value
      );
    }

    filterCards(searchValue, checkboxValues);
  });
});

clearButton.addEventListener("click", () => {
  inputSearch.value = "";
  checkboxGroup.forEach((item) => (item.checked = false));

  filterCards("", []);
});
