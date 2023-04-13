const partner_url = "https://pokeapi.co/api/v2/pokemon";
const btn = document.querySelector("#test-button") as HTMLButtonElement;
const body = document.body;
const loader = document.getElementById("loading-spinner") as HTMLElement;

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
      const data = await response.json();
      onSuccess?.();
      return data;
    } catch (error) {
      onFailure?.(error as Error);
    }
  }
}
const store = new Store();

async function main() {
  await store.getPartnerApps({
    onLoading() {
      loader.classList.add("display");
    },
    onSuccess() {
      loader.classList.remove("display");
    },
  });
}

main();
