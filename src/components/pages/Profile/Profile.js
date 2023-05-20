import React, { useContext } from "react";
import { CurrentUserContext } from "../../../contexts/CurrentUserContext";
import "./Profile.css";
import { useInput } from "../../../hooks/useForm";
import Preloader from "../../Preloader/Preloader";

function Profile({ onEdit, onSignOut, serverMessage, isLoading }) {
  const currentUser = useContext(CurrentUserContext);
  const name = useInput(currentUser.name || "", {
    isEmpty: true,
    minLength: 2,
    maxLength: 30,
    isName: true,
  });
  const about = useInput(currentUser.about || "", {
    isEmpty: true,
    minLength: 2,
    maxLength: 30,
    isName: true,
  });

  function signOut() {
    onSignOut();
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    onEdit(name.value, about.value);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="profile__form">
        <h2 className="profile__title">Привет, {currentUser.name}!</h2>
        <div className="profile__inputs">
          <div className="profile__input">
            <label className="profile__label" htmlFor="name">
              Имя
            </label>
            <input
              value={name.value}
              onChange={(e) => name.onChange(e)}
              onBlur={(e) => name.onBlur(e)}
              dirty={name.isDirty ? 1 : 0}
              className={
                name.isDirty &&
                (name.isEmpty.state ||
                  name.minLengthError.state ||
                  name.nameError.state ||
                  name.maxLengthError.state)
                  ? "profile__placeholder profile__placeholder_invalid"
                  : "profile__placeholder"
              }
              name="name"
              type="text"
            />
            <span
              className={
                name.isDirty &&
                (name.isEmpty.state ||
                  name.minLengthError.state ||
                  name.nameError.state ||
                  name.maxLengthError.state)
                  ? "input__span input__span_visible"
                  : "input__span"
              }
            >
              {name.isEmpty.textError ||
                name.minLengthError.textError ||
                name.maxLengthError.textError ||
                name.nameError.textError ||
                " "}
            </span>
          </div>
          <div className="profile__input">
            <label className="profile__label" htmlFor="about">
              О себе
            </label>
            <input
              value={about.value}
              onChange={(e) => about.onChange(e)}
              onBlur={(e) => about.onBlur(e)}
              dirty={about.isDirty ? 1 : 0}
              className={
                about.isDirty && (about.isEmpty.state || about.nameError.state)
                  ? "profile__placeholder profile__placeholder_invalid profile__placeholder_noborder"
                  : "profile__placeholder profile__placeholder_noborder"
              }
              name="about"
              type="text"
            />
            <span
              className={
                about.isDirty && (about.isEmpty.state || about.nameError.state)
                  ? "profile__span profile__span_visible"
                  : "profile__span"
              }
            >
              {about.nameError.textError || about.isEmpty.textError || " "}
            </span>
          </div>
        </div>
        {(name.value === currentUser.name &&
          about.value === currentUser.about) ||
        !name.inputValid ||
        !about.inputValid ? (
          <p className="form__text">{serverMessage}</p>
        ) : (
          ""
        )}
        <button
          className={
            (name.value === currentUser.name &&
              about.value === currentUser.about) ||
            !name.inputValid ||
            !about.inputValid
              ? "profile__button profile__button_disabled"
              : "profile__button"
          }
          disabled={
            (name.value === currentUser.name &&
              about.value === currentUser.about) ||
            !name.inputValid ||
            !about.inputValid
          }
          type="submit"
        >
          Редактировать
        </button>
      </form>
      <button onClick={signOut} className="profile__out">
        Выйти из аккаунта
      </button>
      <Preloader isLoading={isLoading} />
    </>
  );
}

export default Profile;
