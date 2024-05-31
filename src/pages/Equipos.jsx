import { useState, useEffect } from "react";
import Sidebar from "../components/common/Sidebar";
import Header from "../components/common/Header";
import {
  eliminarMenu,
  editarMenu,
  obtenerEquipos,
  crearEquipo,
} from "../services/equiposApi";
import { IoLogoWindows } from "react-icons/io";
import { Link } from "react-router-dom";
import { BiPowerOff } from "react-icons/bi";
import { obtenerComponentes } from "../services/componentesApi";

const Menus = () => {
  const [menus, setMenus] = useState([]);
  const [componentes, setComponentes] = useState([]);

  const [error, setError] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [nuevoMenu, setNuevoMenu] = useState({
    nombre: "",
    descripcion: "",
    componentes: [],
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlatos, setSelectedPlatos] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  useEffect(() => {
    cargarEquipos();
    cargarPlatos();
  }, []);

  const cargarEquipos = async () => {
    try {
      const response = await obtenerEquipos();
      setMenus(response);
    } catch (error) {
      setError(error.message);
    }
  };

  const cargarPlatos = async () => {
    try {
      const response = await obtenerComponentes();
      setComponentes(response);
    } catch (error) {
      setError(error.message);
    }
  };

  const abrirModal = () => {
    setModalIsOpen(true);
  };

  const abrirModalEditar = (data) => {
    setNuevoMenu(data);
    setSelectedPlatos(data.componentes);
    console.log(data);

    setModalIsOpen(true);
  };

  const cerrarModal = () => {
    setModalIsOpen(false);
    setNuevoMenu({
      nombre: "",
      descripcion: "",
      componentes: [],
    });
  };

  const handleChangeNuevoMenu = (e) => {
    setNuevoMenu({
      ...nuevoMenu,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitNuevoMenu = async (e) => {
    e.preventDefault();
    try {
      const listaIds = selectedPlatos.map((objeto) => objeto._id);
      if (nuevoMenu._id == null) {
        await crearEquipo(nuevoMenu.nombre, nuevoMenu.descripcion, listaIds);
      } else {
        await editarMenu(
          nuevoMenu._id,
          nuevoMenu.nombre,
          nuevoMenu.descripcion,
          componentes
        );
      }

      setSelectedPlatos([]);
      cargarEquipos();
      cerrarModal();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEliminarMenu = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este menú?")) {
      try {
        await eliminarMenu(id);
        cargarEquipos();
      } catch (error) {
        setError(error.message);
      }
    }
  };

  const handlePlatoClick = (plato) => {
    if (!selectedPlatos.find((p) => p.id === plato.id)) {
      setSelectedPlatos([...selectedPlatos, plato]);
    }
    setSearchTerm("");
    setShowSuggestions(false);
  };

  const handleInputChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setShowSuggestions(term.trim().length > 0);
  };

  const handleRemovePlato = (platoId) => {
    const updatedPlatos = selectedPlatos.filter(
      (plato) => plato.id !== platoId
    );
    setSelectedPlatos(updatedPlatos);
  };

  const filteredPlatos = componentes.filter((plato) =>
    plato.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-y-auto">
        <Header />
        <div className="p-4">
          {error && <p className="text-red-500">Error: {error}</p>}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold animate-slide-in-left">
              Computadoras
            </h1>
            <button
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded focus:outline-none"
              onClick={abrirModal}
            >
              + Armar nueva computadora
            </button>
          </div>
          <div className="mt-4">
            {menus.length === 0 && (
              <div className="flex justify-center items-center">
                <img
                  src="https://previews.123rf.com/images/yupiramos/yupiramos1802/yupiramos180220479/95884510-computadora-port%C3%A1til-triste-emoji-icono-imagen-vector-ilustraci%C3%B3n-dise%C3%B1o.jpg"
                  className="h-[220px]"
                ></img>
                <p className="text-2xl font-bold">
                  No hay computadoras en la base de datos.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {menus.map((menu) => (
                <div key={menu._id} className="flex">
                  <div className="bg-black border-[10px] text-white border-gray-700 shadow-md rounded-lg p-4 mt-4 relative animate-fade-in">
                    <Link
                      to={`/detallecomponente/${menu._id}`}
                      className="block w-full "
                    >
                      <div className="flex justify-between items-center">
                        <div className="w-16 h-16 overflow-hidden rounded-md bg-gray-200">
                          <IoLogoWindows className="mx-auto text-4xl mt-3 text-gray-700" />
                        </div>
                        <h2 className="text-xl font-bold mb-2 ml-4">
                          {menu.nombre}
                        </h2>
                      </div>
                      <br />
                      <p className="text-gray-200">{menu.descripcion}</p>
                    </Link>
                    <div className="flex justify-end mt-2"></div>
                  </div>
                  <div className="bg-black w-[100px] rounded-md ml-2 flex flex-col items-center justify-center">
                    <button
                      className="text-red-500 hover:text-red-600 mr-2 focus:outline-none"
                      onClick={() => handleEliminarMenu(menu._id)}
                    >
                      <BiPowerOff className="text-2xl" />
                    </button>
                    <button
                      className="text-yellow-500 hover:text-orange-600 mr-2 focus:outline-none"
                      onClick={() => abrirModalEditar(menu)}
                    >
                      Editar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal para agregar nuevo menú */}
      {modalIsOpen && (
        <>
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-black opacity-50"></div>
            <div className="relative bg-white p-6 rounded-lg shadow-lg w-1/2">
              <h2 className="text-2xl font-bold mb-4">
                Armar nueva computadora
              </h2>
              <form onSubmit={handleSubmitNuevoMenu}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Nombre
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={nuevoMenu.nombre}
                    onChange={handleChangeNuevoMenu}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Descripción
                  </label>
                  <textarea
                    name="descripcion"
                    value={nuevoMenu.descripcion}
                    onChange={handleChangeNuevoMenu}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32 resize-none"
                    required
                  />
                </div>
                <div className="container mx-auto ">
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Componentes
                    </label>
                    {/* <input
                      type="text"
                      name="componentes"
                      value={selectedPlatos
                        .map((plato) => plato.nombre)
                        .join(", ")}
                      onChange={(e) => e.preventDefault()}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder="Platos seleccionados..."
                      readOnly
                    /> */}
                  </div>
                  <div className="relative mb-4">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={handleInputChange}
                      placeholder="Buscar componentes..."
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    {showSuggestions && (
                      <div className="absolute bg-white w-full mt-2 py-2 z-50 border rounded-b shadow-lg">
                        {filteredPlatos.map((plato) => (
                          <div
                            key={plato.id}
                            className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                            onClick={() => handlePlatoClick(plato)}
                          >
                            <p className="text-gray-900 font-medium">
                              {plato.nombre}
                            </p>
                            <p className="text-gray-600 text-sm">
                              {plato.descripcion}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    {selectedPlatos.length != 0 && (
                      <p className="text-gray-700 font-bold mb-2">
                        Componentes seleccionados:
                      </p>
                    )}

                    <ul className="border rounded p-2">
                      {selectedPlatos.map((plato, index) => (
                        <li key={index} className="mb-2">
                          <span className="font-medium px-5">
                            {plato.nombre}
                          </span>{" "}
                          -{" "}
                          <span className="text-gray-600">
                            {plato.descripcion}
                          </span>
                          <button
                            onClick={() => handleRemovePlato(plato.id)}
                            className="ml-2 text-sm text-red-500 focus:outline-none"
                          >
                            Eliminar de la lista
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="bg-white  text-black hover:bg-gray-300 px-4 py-2 rounded mr-2 focus:outline-none"
                    onClick={cerrarModal}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded focus:outline-none"
                  >
                    {nuevoMenu._id != null
                      ? "Editar Computadorar"
                      : "Armar computadora"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Menus;
