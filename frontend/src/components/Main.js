import React from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import Card from "./Card";

function Main({
  onEditProfileClick,
  onAddPlaceClick,
  onEditAvatarClick,
  onCardClick,
  onCardLike,
  onCardDelete,
  cards,
}) {
  const currentUser = React.useContext(CurrentUserContext);

  return (
    <main>
      <section className="profile">
        <div className="profile__image-container">
          <div className="profile__overlay">
            <button
              type="button"
              className="profile__avatar-button button"
              id="avatar-button"
              onClick={onEditAvatarClick}
            />
          </div>
          <img
            className="profile__image"
            src={currentUser.avatar}
            alt={currentUser.name}
          />
        </div>

        <div className="profile__info">
          <div className="profile__info-group">
            <h1 className="profile__name">{currentUser.name}</h1>
            <button
              aria-label="edit"
              className="profile__edit-button button"
              type="button"
              onClick={onEditProfileClick}
            />
          </div>
          <p className="profile__about">{currentUser.about}</p>
        </div>
        <button
          aria-label="add"
          className="profile__add-button button"
          type="button"
          onClick={onAddPlaceClick}
        />
      </section>

      <section>
        <ul className="cards">
          {cards.map((card) => (
            <Card
              key={card._id}
              card={card}
              onCardClick={onCardClick}
              onCardLike={onCardLike}
              onCardDelete={onCardDelete}
            />
          ))}
        </ul>
      </section>
    </main>
  );
}

export default Main;
