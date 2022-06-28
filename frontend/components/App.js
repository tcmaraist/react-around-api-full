import React from "react";
import { Route, Switch, Redirect, useHistory } from "react-router-dom";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import ProtectedRoute from "./ProtectedRoute";
import Login from "./Login";
import Register from "./Register";
import InfoTooltip from "./InfoTooltip";
import api from "../utils/api";
import auth from "../utils/auth";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import DeleteConfirmationPopup from "./PopupWithDelete";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import ImagePopup from "./ImagePopup";

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
    React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
    React.useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = React.useState(false);
  const [cardConfirmDelete, setCardConfirmDelete] = React.useState(null);
  const [selectedCard, setSelectedCard] = React.useState(null);
  const [cards, setCards] = React.useState([]);
  const [currentUser, setCurrentUser] = React.useState({});

  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = React.useState(false);
  const [tooltipStatus, setTooltipStatus] = React.useState("");
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [email, setEmail] = React.useState("");

  const history = useHistory();

  React.useEffect(() => {
    api
      .getAppInfo()
      .then(([cardData, userData]) => {
        setCurrentUser(userData);
        setCards(cardData);
      })
      .catch((err) => console.error(err));
  }, []);

  React.useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      auth
        .checkToken(token)
        .then((res) => {
          if (res) {
            setEmail(res.data.email);
            setIsLoggedIn(true);
            history.push("/");
          } else {
            localStorage.removeItem("jwt");
          }
        })
        .catch((err) => console.error(err));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history]);

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }
  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }
  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function onRegister({ email, password }) {
    auth
      .register({ email, password })
      .then((res) => {
        if (res.data._id) {
          setTooltipStatus("success");
          history.push("/signin");
        } else {
          setTooltipStatus("fail");
        }
      })
      .catch((err) => {
        setTooltipStatus("fail");
      })
      .finally((res) => {
        setIsInfoTooltipOpen(true);
      });
  }

  function onLogin({ email, password }) {
    auth
      .login({ email, password })
      .then((res) => {
        if (res.token) {
          setIsLoggedIn(true);
          setEmail(email);
          localStorage.setItem("jwt", res.token);
          history.push("/");
        } else {
          setTooltipStatus("fail");
          setIsInfoTooltipOpen(true);
        }
      })
      .catch((err) => {
        setTooltipStatus("fail");
        setIsInfoTooltipOpen(true);
      });
  }

  function onSignOut() {
    localStorage.removeItem("jwt");
    setIsLoggedIn(false);
    history.push("/signin");
  }

  function handleUpdateAvatar(avatar) {
    api
      .updateProfilePicture(avatar)
      .then((newUserData) => {
        setCurrentUser(newUserData);
        closeAllPopups();
      })
      .catch((err) => console.error(err));
  }

  function handleUpdateUser({ name, about }) {
    api
      .setUserInfo({ name, about })
      .then((newUserData) => {
        setCurrentUser(newUserData);
        closeAllPopups();
      })
      .catch((err) => console.error(err));
  }

  function handleAddPlaceSubmit(newCard) {
    api
      .addCard(newCard)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.error(err));
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((item) => item._id === currentUser._id);
    api
      .toggleLike(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((item) => (item._id === card._id ? newCard : item))
        );
      })
      .catch((err) => console.error(err));
  }

  function handleDeleteClick(card) {
    console.log("delete has been clicked");
    setIsConfirmDeleteOpen(true);
    setCardConfirmDelete(card);
  }

  function handleCardDelete(card) {
    api
      .removeCard(card._id)
      .then(() => {
        //compare item to card, or item._id to card._id?
        setCards((cards) => cards.filter((item) => item._id !== card._id));
        closeAllPopups();
      })
      .catch((err) => console.error(err));
  }

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsConfirmDeleteOpen(false);
    setSelectedCard(null);
    setIsInfoTooltipOpen(false);
  }

  React.useEffect(() => {
    const closeByEscape = (e) => {
      if (e.key === "Escape") {
        closeAllPopups();
      }
    };

    document.addEventListener("keydown", closeByEscape);

    return () => document.removeEventListener("keydown", closeByEscape);
  }, []);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header email={email} onSignOut={onSignOut} />
        <Switch>
          <ProtectedRoute exact path="/" loggedIn={isLoggedIn}>
            <Main
              onEditProfileClick={handleEditProfileClick}
              onAddPlaceClick={handleAddPlaceClick}
              onEditAvatarClick={handleEditAvatarClick}
              onCardClick={handleCardClick}
              onCardLike={handleCardLike}
              onCardDelete={handleDeleteClick}
              cards={cards}
            />
          </ProtectedRoute>
          <Route path="/signup">
            <Register onRegister={onRegister} />
          </Route>
          <Route path="/signin">
            <Login onLogin={onLogin} />
          </Route>
          <Route>
            {isLoggedIn ? <Redirect to="/" /> : <Redirect to="/signin" />}
          </Route>
        </Switch>

        <Footer />
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
        />

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />
        <DeleteConfirmationPopup
          isOpen={isConfirmDeleteOpen}
          onClose={closeAllPopups}
          onCardDelete={handleCardDelete}
          card={cardConfirmDelete}
        />

        <ImagePopup card={selectedCard} onClose={closeAllPopups} />
        <InfoTooltip
          isOpen={isInfoTooltipOpen}
          onClose={closeAllPopups}
          status={tooltipStatus}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
