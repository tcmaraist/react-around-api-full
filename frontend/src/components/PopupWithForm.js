import React from "react";

function PopupWithForm({
  title,
  name,
  onClose,
  children,
  buttonText = "Save",
  isOpen,
  onSubmit,
}) {
  return (
    <div className={`modal modal_type_${name} ${isOpen && "modal_is-open"}`}>
      <div className="modal__body">
        <button
          type="button"
          className="modal__close-button button"
          onClick={onClose}
        />
        <form className="form" name={name} onSubmit={onSubmit}>
          <h2 className="form__title">{title}</h2>
          {children}
          <button type="submit" className="button form__save-button">
            {buttonText}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PopupWithForm;
