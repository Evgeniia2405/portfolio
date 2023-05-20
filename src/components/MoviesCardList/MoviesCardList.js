import React from "react";
import { useLocation } from "react-router-dom";
import "./MoviesCardList.css";
import MoviesCard from "../MoviesCard/MoviesCard";

function MoviesCardList({
  movies,
  savedMovies,
  onMore,
  onClickMore,
  onCardClick,
}) {
  let location = useLocation();

  return (
    <div className="cards__wrapper">
      <>
        {movies.length!==0 ? (
          <ul className="cards__list">
            {movies.map((data) => (
              <MoviesCard
                key={data.id || data._id}
                card={data}
                onCardClick={onCardClick}
                isSaved={
                  savedMovies
                    ? savedMovies.some((i) => i.movieId === data.id)
                    : false
                }
              />
            ))}
          </ul>
        ) : ( location.pathname === "/movies"?
        <p className="cards__text">Начните поиск фильмов с ввода ключевого слово в поле "Фильм"</p> :<p className="cards__text">У вас пока нет сохраненных фильмов</p>
        )}
      </>

      <button
        onClick={onClickMore}
        type="button"
        className={onMore ? "cards__btn" : "cards__btn_disactive"}
      >
        Еще
      </button>
    </div>
  );
}

export default MoviesCardList;
