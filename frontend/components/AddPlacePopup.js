import React from "react";
import PopupWithForm from "./PopupWithForm";

function AddPlacePopup({ isOpen, onAddPlace, onClose }) {
  const [name, setName] = React.useState("");
  const [link, setLink] = React.useState("");

  React.useEffect(() => {
    setName("");
    setLink("");
  }, [isOpen]);

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleLinkChange(e) {
    setLink(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();

    onAddPlace({
      name,
      link,
    });
  }

  return (
    <PopupWithForm
      title="New Place"
      name="add"
      buttonText="Create"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <label>
        <input
          type="text"
          minLength="1"
          maxLength="30"
          name="name"
          id="title"
          className="form__input form__input_type_title"
          placeholder="Title"
          required
          value={name}
          onChange={handleNameChange}
        />
        <span className="form__error" id="title-error" />
        <input
          type="url"
          name="link"
          id="image-url"
          className="form__input form__input_type_image-url"
          placeholder="Image Link"
          required
          value={link}
          onChange={handleLinkChange}
        />
        <span className="form__error" id="image-url-error" />
      </label>
    </PopupWithForm>
  );
}

export default AddPlacePopup;
