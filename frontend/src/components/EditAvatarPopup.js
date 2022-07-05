import React from "react";
import PopupWithForm from "./PopupWithForm";

function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar }) {
  const inputRef = React.useRef();

  React.useEffect(() => {
    inputRef.current.value = "";
  }, [isOpen]);

  function handleSubmit(e) {
    e.preventDefault();

    onUpdateAvatar({
      avatar: inputRef.current.value,
    });
  }

  return (
    <PopupWithForm
      title="Change Profile Picture"
      name="avatar-edit"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <label>
        <input
          className="form__input form__input_type_image-url"
          type="url"
          id="avatar"
          name="avatar"
          placeholder="enter image link here"
          required
          ref={inputRef}
        />
        <span className="form__error" id="avatar-error" />
      </label>
    </PopupWithForm>
  );
}

export default EditAvatarPopup;
