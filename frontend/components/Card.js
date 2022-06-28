import React from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function Card({ card, onCardClick, onCardLike, onCardDelete }) {
  const currentUser = React.useContext(CurrentUserContext);
  const isOwn = card.owner._id === currentUser._id;
  const cardDeleteButtonClassName = `card__delete-button button ${
    isOwn ? "card__delete-button_visible" : "card__delete-button_hidden"
  }`;
  const isLiked = card.likes.some((i) => i._id === currentUser._id);
  const cardLikeButtonClassName = `card__like-button ${
    isLiked && "card__like-button_type_active"
  }`;

  function handleClick() {
    onCardClick(card);
  }

  function handleLikeClick() {
    onCardLike(card);
  }

  function handleDelete() {
    onCardDelete(card);
  }
  return (
    <li className="card">
      <button
        type="button"
        className={cardDeleteButtonClassName}
        onClick={handleDelete}
      />
      <img
        src={card.link}
        alt={card.name}
        onClick={handleClick}
        className="card__image"
      />
      <div className="card__info">
        <h2 className="card__title">{card.name}</h2>
        <div className="card__like-container">
          <button
            type="button"
            className={cardLikeButtonClassName}
            onClick={handleLikeClick}
          />
          <p className="card__like-button-counter">{card.likes.length}</p>
        </div>
      </div>
    </li>
  );
}

export default Card;
