import { useNavigate } from "react-router-dom";
import "./NotFound.css";
import Logo from "../../Logo/Logo";

function NotFound() {
  const navigate = useNavigate();

  return (
    <>
      <div className="content">
        <Logo/>
        <h2 className="content__title">404</h2>
        <p className="content__text">Страница не найдена</p>
      </div>
      <p onClick={() => navigate(-1)} className="content__link">
        Назад
      </p>
    </>
  );
}

export default NotFound;
