class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  _handleServerResponse(res) {
    return res.ok ? res.json() : Promise.reject(`Error: ${res.status}`);
  }

  getAppInfo(token) {
    return Promise.all([this.getInitialCards(token), this.getUserInfo(token)]);
  }

  getUserInfo(token) {
    return fetch(`${this._baseUrl}/users/me`, {
      headers: {
        authorization: `Bearer ${token}`,
        ...this._headers,
      },
    }).then(this._handleServerResponse);
  }

  setUserInfo({ name, about }, token) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: {
        authorization: `Bearer ${token}`,
        ...this._headers,
      },
      body: JSON.stringify({
        name,
        about,
      }),
    }).then(this._handleServerResponse);
  }

  updateProfilePicture({ avatar }, token) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: {
        authorization: `Bearer ${token}`,
        ...this._headers,
      },
      body: JSON.stringify({
        avatar,
      }),
    }).then(this._handleServerResponse);
  }

  getInitialCards(token) {
    return fetch(`${this._baseUrl}/cards`, {
      headers: {
        authorization: `Bearer ${token}`,
        ...this._headers,
      },
    }).then(this._handleServerResponse);
  }

  addCard({ name, link }, token) {
    return fetch(`${this._baseUrl}/cards`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        ...this._headers,
      },
      body: JSON.stringify({
        name,
        link,
      }),
    }).then(this._handleServerResponse);
  }

  removeCard(cardID, token) {
    return fetch(`${this._baseUrl}/cards/${cardID}`, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${token}`,
        ...this._headers,
      },
    }).then(this._handleServerResponse);
  }

  toggleLike(cardId, like, token) {
    return fetch(`${this._baseUrl}/cards/likes/${cardId}`, {
      method: like ? "PUT" : "DELETE",
      headers: {
        authorization: `Bearer ${token}`,
        ...this._headers,
      },
    }).then(this._handleServerResponse);
  }

  addLike(cardId, token) {
    return fetch(`${this._baseUrl}/cards/likes/${cardId}`, {
      method: "PUT",
      headers: {
        authorization: `Bearer ${token}`,
        ...this._headers,
      },
    }).then(this._handleServerResponse);
  }

  removeLike(cardId, token) {
    return fetch(`${this._baseUrl}/cards/likes/${cardId}`, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${token}`,
        ...this._headers,
      },
    }).then(this._handleServerResponse);
  }
}

const BASE_URL =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:3000";

const api = new Api({
  baseUrl: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
