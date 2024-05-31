import {
  AiOutlineLaptop,
  AiOutlineTool,
  AiOutlineAppstore,
  AiOutlineUser,
} from "react-icons/ai";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="hidden md:flex flex-col w-64 bg-[#012d75]">
      <div className="flex flex-col items-center justify-center  bg-[#171937]">
        <img src="/public\LogoCompuShop.png" className="w-40"></img>
      </div>
      <div className="flex flex-col flex-1 overflow-y-auto">
        <nav className="flex-1 px-2 py-4 bg-gradient-to-r from-[#363a75] to-[#262a61]">
          <Link
            to="/computadoras"
            className="flex items-center px-4 py-2 text-gray-100 hover:bg-gray-700"
          >
            <AiOutlineLaptop className="h-6 w-6 mr-2" />
            <span className="truncate">Computadoras</span>
          </Link>
          <Link
            to="/componentes"
            className="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-700"
          >
            <AiOutlineTool className="h-6 w-6 mr-2" />
            <span className="truncate">Componentes</span>
          </Link>
          <Link
            to="/categorias"
            className="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-700"
          >
            <AiOutlineAppstore className="h-6 w-6 mr-2" />
            <span className="truncate">Categorías</span>
          </Link>
          <a
            href="#"
            className="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-700"
          >
            <AiOutlineUser className="h-6 w-6 mr-2" />
            <span className="truncate">Accesos</span>
          </a>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
