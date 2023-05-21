class Api {
  #url;
  #header;

  constructor(config) {
    this.#url = config.url;
    this.#header = config.headers;
  }

  #checkResponse(response) {
    if (response.ok) {
      return response.json();
    }
    return Promise.reject(response.status);
  }

  getUserInfo() {
    return fetch(`${this.#url}/users/me`, {
      headers: this.#header,
    }).then(this.#checkResponse);
  }

  editUserInfo(name, about) {
    return fetch(`${this.#url}/users/me`, {
      method: "PATCH",
      headers: this.#header,
      body: JSON.stringify({ name, about }),
    }).then(this.#checkResponse);
  }
}
const API_OPTIONS = {
  url: "https://mesto.nomoreparties.co/v1/cohort-52",
  headers: {
    authorization: "e157ce8e-c830-48fc-81a0-0ff04f7cdd6a",
    "Content-Type": "application/json",
  },
};

const api = new Api(API_OPTIONS);

export default api;
