import React, { useEffect, useState } from "react";
import Footer from "../../Footer/Footer";
import MoviesCardList from "../../MoviesCardList/MoviesCardList";
import SearchForm from "../../SearchForm/SearchForm";
import moviesApi from "../../../utils/MoviesApi";
import "./Movies.css";
import Preloader from "../../Preloader/Preloader";
const { DURATION_SHORT_MOVIE } = require("../../../utils/constants");

function Movies({ countCards }) {
  const allMoviesLS = JSON.parse(localStorage.getItem("allMovies"));
  const moviesFoundLS = JSON.parse(localStorage.getItem("moviesFound"));
  const textSearchLS = localStorage.getItem("textSearch");
  const isShortsLS = localStorage.getItem("isShorts");
  const isCheckedLS = localStorage.getItem("isChecked");
  const savedMoviesLS = JSON.parse(localStorage.getItem("savedMovies"));
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState(textSearchLS ? textSearchLS : "");
  const [filteredMovies, setFilteredMovies] = useState(
    moviesFoundLS ? moviesFoundLS : []
  );
  const [currentMovies, setCurrentMovies] = useState([]);

  const [savedMovies, setSavedMovies] = useState(
    savedMoviesLS ? savedMoviesLS : []
  );

  const [isShorts, setIsShorts] = useState(false);
  const [onSuccess, setOnSuccess] = useState(false);
  const [searchMessage, setSearchMessage] = useState(" ");
  const [onMore, setOnMore] = useState(false);
  const [checked, setChecked] = useState(false);

  function getMovies() {
    setIsLoading(true);
    moviesApi
      .getInitialData()
      .then((data) => {
        localStorage.setItem("allMovies", JSON.stringify(data));
      })
      .catch((err) => {
        setSearchMessage(`Ошибка: ${err}`);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  useEffect(() => {
    if (allMoviesLS) {
      if (moviesFoundLS) {
        if (isShortsLS && isCheckedLS) {
          const shotsMoviesLS = moviesFoundLS.filter(
            (movie) => movie.duration <= DURATION_SHORT_MOVIE
          );
          renderMovies(shotsMoviesLS);
          setChecked(true);
          setIsShorts(true);
        }
        if (isShortsLS && !isCheckedLS) {
          setCurrentMovies(moviesFoundLS.slice(0, countCards.countRender));
          setChecked(false);
          setIsShorts(true);
        }
        if (!isShortsLS) {
          setCurrentMovies(moviesFoundLS.slice(0, countCards.countRender));
          setChecked(false);
          setIsShorts(false);
        }
      }
    } else {
      getMovies();
    }
  }, []);

  useEffect(() => {
    if (value.length === 0) {
      setCurrentMovies([]);
      setChecked(false);
      setIsShorts(false);
      setOnMore(false);
    }
  }, [value]);

  //проверка для визуализации кнопки "еще" при измении списка текущих фильмов
  useEffect(() => {
    if (currentMovies.length !== 0) {
      checkMore(currentMovies);
    }
  }, [currentMovies]);

  useEffect(() => {
    if (currentMovies.length !== 0) {
      localStorage.setItem("savedMovies", JSON.stringify(savedMovies));
      setCurrentMovies([...currentMovies]);
    }
  }, [savedMovies]);

  function handleChange(e) {
    setValue(e.target.value);
    setSearchMessage(" ");
  }

  //если найденных фильмов больше чем отрисовано на странице, то показываем кнопку "еще"
  //проверка для полнометражных и короткометражных фильмов
  function checkMore(movies) {
    if (!moviesFoundLS) {
      if (!checked) {
        if (movies.length < 100) {
          setOnMore(true);
        } else {
          setOnMore(false);
        }
      } else {
        if (
          10 <
          movies.filter((movie) => movie.duration <= DURATION_SHORT_MOVIE)
            .length
        ) {
          setOnMore(true);
        } else {
          setOnMore(false);
        }
      }
    } else {
      if (!checked) {
        if (movies.length < moviesFoundLS.length) {
          setOnMore(true);
        } else {
          setOnMore(false);
        }
      } else {
        if (
          movies.length <
          moviesFoundLS.filter(
            (movie) => movie.duration <= DURATION_SHORT_MOVIE
          ).length
        ) {
          setOnMore(true);
        } else {
          setOnMore(false);
        }
      }
    }
  }

  //проверка на наличие короткометражных фильмов
  function checkIsShortsMovies(movies) {
    if (movies.some((movie) => movie.duration <= DURATION_SHORT_MOVIE)) {
      localStorage.setItem("isShorts", true);
      setIsShorts(true);
    } else {
      localStorage.removeItem("isShorts");
      localStorage.removeItem("isChecked");
      setChecked(false);
      setIsShorts(false);
    }
  }

  function handleToggle() {
    if (isShorts && !checked) {
      const shotsMoviesLS = moviesFoundLS.filter(
        (movie) => movie.duration <= DURATION_SHORT_MOVIE
      );
      renderMovies(shotsMoviesLS);
      setChecked(true);
      localStorage.setItem("isChecked", true);
    }
    if (isShorts && checked) {
      renderMovies(moviesFoundLS);
      setChecked(false);
      localStorage.removeItem("isChecked");
    }
    if (!isShorts && !checked) {
      setSearchMessage("Короткометражки не найдены");
      setChecked(false);
    }
  }

  function renderMovies(movies) {
    setFilteredMovies(movies);
    setCurrentMovies(movies.slice(0, countCards.countRender));
  }

  function filterMovies(wordKey) {
    const filteredMovies = allMoviesLS.filter((movie) => {
      return (
        movie.nameRU.toLowerCase().includes(wordKey.toLowerCase()) ||
        movie.nameEN.toLowerCase().includes(wordKey.toLowerCase())
      );
    });
    if (filteredMovies.length > 0) {
      localStorage.setItem("textSearch", wordKey);
      localStorage.setItem("moviesFound", JSON.stringify(filteredMovies));
      renderMovies(filteredMovies);
      setOnSuccess(true);
      checkIsShortsMovies(filteredMovies);
    } else {
      setOnSuccess(false);
      setSearchMessage("Фильмы не найдены");
      setIsShorts(false);
      setCurrentMovies([]);
      setOnMore(false);
    }
  }

  function handleMore() {
    const nextMovies = filteredMovies.slice(
      currentMovies.length,
      currentMovies.length + countCards.moreFilms
    );
    setCurrentMovies([...currentMovies, ...nextMovies]);
  }

  function handleSubmit(e) {
    e.preventDefault(e);
    setChecked(false);
    if (value && value !== " ") {
      filterMovies(value);
    } else {
      setSearchMessage("Нужно ввести ключевое слово");
    }
  }
  function handleMovieSaveOrDelete(selectMovie) {
    const isSaved = savedMovies.some((i) => i.id === selectMovie.id);
    if (!isSaved) {
      setSavedMovies([selectMovie, ...savedMovies]);
    } else {
      setSavedMovies((state) => state.filter((c) => c.id !== selectMovie.id));
    }
  }

  return (
    <>
      <main className="movies">
        <SearchForm
          value={value}
          onChange={(e) => handleChange(e)}
          onSubmit={handleSubmit}
          onSuccess={onSuccess}
          isShorts={isShorts}
          chengeCheckbox={handleToggle}
          checked={checked}
          searchMessage={searchMessage}
        />
        <MoviesCardList
          onMore={onMore}
          movies={currentMovies}
          savedMovies={savedMovies}
          onClickMore={handleMore}
          onCardClick={handleMovieSaveOrDelete}
        />
      </main>
      <Footer />
      <Preloader isLoading={isLoading} />
    </>
  );
}

export default Movies;
