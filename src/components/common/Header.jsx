import { useNavigate } from "react-router-dom";

const Header = () => {
  const nav = useNavigate();
  const cerrarSesion = () => {
    localStorage.clear();
    nav("/");
  };
  return (
    <div className="flex items-center justify-between h-16 bg-[#363a75] border-b border-gray-200">
      <div className="flex items-center px-4"></div>
      <div className="flex items-center pr-4">
        <button
          className="ml-4 flex items-center text-gray-200 hover:text-gray-300 focus:outline-none focus:text-gray-700"
          onClick={cerrarSesion}
        >
          Cerrar sesion
        </button>
      </div>
    </div>
  );
};

export default Header;
