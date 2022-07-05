import React from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import PopupWithForm from "./PopupWithForm";

function EditProfilePopup({ isOpen, onClose, onUpdateUser }) {
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const currentUser = React.useContext(CurrentUserContext);

  React.useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setDescription(currentUser.about);
    }
  }, [currentUser, isOpen]);

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleDescriptionChange(e) {
    setDescription(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    onUpdateUser({
      name,
      about: description,
    });
  }

  return (
    <PopupWithForm
      title="Edit Profile"
      name="edit"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <label>
        <input
          type="text"
          minLength="2"
          maxLength="40"
          name="name"
          id="form-name"
          className="form__input form__input_type_name"
          placeholder="Name"
          required
          value={name || ""}
          onChange={handleNameChange}
        />
        <span className="form__error" id="form-name-error" />
        <input
          type="text"
          minLength="2"
          maxLength="200"
          name="about"
          id="form-about"
          className="form__input form__input_type_about"
          placeholder="About Me"
          required
          value={description || ""}
          onChange={handleDescriptionChange}
        />
        <span className="form__error" id="form-about-error" />
      </label>
    </PopupWithForm>
  );
}

export default EditProfilePopup;
