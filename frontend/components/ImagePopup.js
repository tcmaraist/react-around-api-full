import React from "react";

function ImagePopup({ card, onClose }) {
  return (
    <div className={`modal modal_type_preview ${card ? "modal_is-open" : ""}`}>
      <div className="modal__body modal__body_type_preview">
        <button
          type="button"
          className="modal__close-button button"
          onClick={onClose}
        />
        <img
          alt={card ? card.name : ""}
          src={card ? card.link : ""}
          className="modal__image"
        />
        <h2 className="modal__title">{card ? card.name : ""}</h2>
      </div>
    </div>
  );
}

export default ImagePopup;
