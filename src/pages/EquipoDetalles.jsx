import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { obtenerEquipoPorId } from "../services/equiposApi";
import "./../style/neon.css";

const EquipoDetalle = () => {
  const { idMenu } = useParams();
  const [menu, setMenu] = useState(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const menuData = await obtenerEquipoPorId(idMenu);
        console.log(menuData);
        setMenu(menuData);
      } catch (error) {
        console.error("Error fetching menu:", error);
      }
    };
    fetchMenu();
  }, [idMenu]);

  if (!menu) {
    return null;
  }

  return (
    <div className="relative flex h-screen bg-white items-center">
      {/* Fondo con imagen */}
      <div className="bg-cover bg-center flex">
        <img
          src="https://iphoneate.com/wp-content/uploads/2018/08/GifMac.gif"
          className="h-[500px]"
        />
        <div className="card">
          <div className="content pt-5 px-5">
            <h2 className="text-3xl font-bold mb-4 relative text-white">
              {menu.nombre}
            </h2>
            <p className="text-gray-100 mb-2 relative">{menu.descripcion}</p>
            <div className="border-t border-gray-300 mt-4 pt-4 relative text-white">
              <h3 className="text-xl font-bold mb-2 ">Platos:</h3>
              <ul>
                {menu.componentes.map((plato) => (
                  <li key={plato._id} className="mb-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-lg font-medium">{plato.nombre}</h4>
                        <p className="text-white">{plato.descripcion}</p>
                        <p className="text-white">
                          caracteristicas: {plato.caracteristicas.join(", ")}
                        </p>
                        <p className="text-white">Precio: ${plato.precio}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipoDetalle;
