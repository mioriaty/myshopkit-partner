const partner_url = "https://randomuser.me/api/?results=50";
const btn = document.querySelector("#test-button") as HTMLButtonElement;
const body = document.body;
const loader = document.getElementById("loading-spinner") as HTMLElement;
const sectionCard = document.getElementById("section-card") as HTMLElement;
const checkboxGroup = Array.from(
  document.querySelectorAll(".checkbox-container input[type='checkbox']")
) as HTMLInputElement[];

interface ResponseData {
  results: Result[];
}

interface Result {
  id: {
    name: string;
    value?: string;
  };
  gender: string;
  name: {
    title: string;
    first: string;
    last: string;
  };
  email: string;
  picture: {
    large: string;
    medium: string;
    thumbnail: string;
  };
}

interface AsyncListener {
  onLoading?: () => void;
  onSuccess?: () => void;
  onFailure?: (error: Error) => void;
}

class Store {
  async getPartnerApps({ onFailure, onSuccess, onLoading }: AsyncListener) {
    onLoading?.();
    try {
      const response: Response = await fetch(partner_url);
      const data: ResponseData = await response.json();
      onSuccess?.();
      return data;
    } catch (error) {
      onFailure?.(error as Error);
      throw new Error("Failed");
    }
  }
}

function handleRedirect(link: string) {
  window.open(link, "_blank");
}

class ViewController {
  private data: Result[];
  private filters: string[];

  constructor() {
    this.data = [];
    this.filters = [];
  }

  renderData = () => {
    return this.data.map((item) => {
      const card = this.renderItem(item);
      sectionCard.innerHTML += `${card}`;
    });
  };

  renderItem = (item: Result) => {
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

  handleCheckbox = () => {
    checkboxGroup.forEach((item) => {
      item.addEventListener("change", (event) => {
        const inputElement = event.target as HTMLInputElement;
        const checked = inputElement.checked;

        if (checked) {
          this.filters.push(inputElement.name);
        } else {
          this.filters.filter((name) => name !== inputElement.name);
        }
      });
    });
  };

  init(data: Result[]) {
    this.data = data;
    this.renderData();
    this.handleCheckbox();
  }
}

const store = new Store();
const view = new ViewController();

async function main() {
  const data = await store.getPartnerApps({
    onLoading() {
      loader.classList.add("display");
    },
    onSuccess() {
      loader.classList.remove("display");
    },
  });
  view.init(data.results);
}

main();
