/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import Sidebar from "../components/common/Sidebar";
import Header from "../components/common/Header";
import {
  obtenerComponentes,
  crearComponente,
  editarComponente,
  eliminarComponente,
} from "../services/componentesApi";
import { MdDelete, MdEdit } from "react-icons/md";
import { BiSolidDish } from "react-icons/bi";

import { obtenerCategorias } from "../services/categoriasApi";

const Platos = () => {
  const [platos, setPlatos] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const [error, setError] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [nuevoPlato, setNuevoPlato] = useState({
    nombre: "",
    caracteristicas: "",
    descripcion: "",
    precio: 0,
    categoria: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

  useEffect(() => {
    cargarPlatos();
    cargarCategorias();
  }, []);

  const handleChangeCategoria = (event) => {
    const categoriaSeleccionada = categorias.find(
      (categoria) => categoria._id === event.target.value
    );
    setCategoriaSeleccionada(categoriaSeleccionada);
  };

  const cargarPlatos = async () => {
    try {
      console.log("LLego");
      const response = await obtenerComponentes();
      console.log("Resultado");
      console.log(response);
      console.log("Resultado");

      setPlatos(response);
    } catch (error) {
      setError(error.message);
    }
  };
  const cargarCategorias = async () => {
    try {
      const response = await obtenerCategorias();
      console.log(response);
      setCategorias(response);
    } catch (error) {
      setError(error.message);
    }
  };

  const abrirModal = () => {
    setModalIsOpen(true);
  };

  const abrirModalEditar = (plato) => {
    setNuevoPlato({
      ...plato,
      caracteristicas: plato.caracteristicas.join(", "),
    });
    console.log(plato);
    setCategoriaSeleccionada(plato.categoria);
    setModalIsOpen(true);
  };

  const cerrarModal = () => {
    setModalIsOpen(false);
    setNuevoPlato({
      nombre: "",
      caracteristicas: "",
      descripcion: "",
      precio: 0,
      categoria: "",
    });
  };

  const handleChangeNuevoPlato = (e) => {
    setNuevoPlato({
      ...nuevoPlato,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitNuevoPlato = async (e) => {
    e.preventDefault();
    try {
      const ingredientesArray = nuevoPlato.caracteristicas
        .split(",")
        .map((ingrediente) => ingrediente.trim());

      if (!nuevoPlato._id) {
        console.log(nuevoPlato);
        console.log(categoriaSeleccionada);
        await crearComponente(
          nuevoPlato.nombre,
          ingredientesArray,
          nuevoPlato.descripcion,
          nuevoPlato.precio,
          categoriaSeleccionada._id
        );
        setCategoriaSeleccionada(null);
      } else {
        await editarComponente(
          nuevoPlato._id,
          nuevoPlato.nombre,
          ingredientesArray,
          nuevoPlato.descripcion,
          nuevoPlato.precio,
          categoriaSeleccionada._id
            ? categoriaSeleccionada._id
            : categoriaSeleccionada.id
        );
        setCategoriaSeleccionada(null);
      }
      cerrarModal();
      cargarPlatos();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEliminarComponente = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este plato?")) {
      try {
        await eliminarComponente(id);
        cargarPlatos();
      } catch (error) {
        setError(error.message);
      }
    }
  };

  const handleEditPlato = (plato) => {
    abrirModalEditar(plato);
  };

  const filteredPlatos = platos.filter((plato) =>
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
              Componentes
            </h1>
            <button
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded focus:outline-none"
              onClick={abrirModal}
            >
              + Nuevo Componentes
            </button>
          </div>
          <div className="mt-4">
            {platos.length === 0 && <p>Cargando...</p>}
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left py-2 px-4">Nombre</th>
                    <th className="text-left py-2 px-4">Descripción</th>
                    <th className="text-center py-2 px-4">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredPlatos.map((plato) => (
                    <tr key={plato._id}>
                      <td className="py-4 px-6">{plato.nombre}</td>
                      <td className="py-4 px-6">{plato.descripcion}</td>
                      <td className="py-4 px-6 flex justify-center">
                        <button
                          className="text-red-500 hover:text-red-600 mr-2 focus:outline-none"
                          onClick={() => handleEliminarComponente(plato._id)}
                        >
                          <MdDelete />
                        </button>
                        <button
                          className="text-orange-500 hover:text-orange-600 mr-2 focus:outline-none"
                          onClick={() => handleEditPlato(plato)}
                        >
                          <MdEdit />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {modalIsOpen && (
        <>
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-black opacity-50"></div>
            <div className="relative bg-white p-6 rounded-lg shadow-lg w-1/2">
              <h2 className="text-2xl font-bold mb-4">
                {nuevoPlato._id ? "Editar Componente" : "Nuevo Componente"}
              </h2>
              <form onSubmit={handleSubmitNuevoPlato}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Nombre
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={nuevoPlato.nombre}
                    onChange={handleChangeNuevoPlato}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Caracteristicas( separelos por comas )
                  </label>
                  <input
                    type="text"
                    name="caracteristicas"
                    value={nuevoPlato.caracteristicas}
                    onChange={handleChangeNuevoPlato}
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
                    value={nuevoPlato.descripcion}
                    onChange={handleChangeNuevoPlato}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32 resize-none"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Precio
                  </label>
                  <input
                    type="number"
                    name="precio"
                    value={nuevoPlato.precio}
                    onChange={handleChangeNuevoPlato}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Categoría
                  </label>
                  <select
                    name="categoria"
                    value={
                      categoriaSeleccionada
                        ? categoriaSeleccionada._id
                          ? categoriaSeleccionada._id
                          : categoriaSeleccionada.id
                        : ""
                    }
                    onChange={handleChangeCategoria}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  >
                    <option value="">Seleccione una categoría</option>
                    {categorias.map((categoria) => (
                      <option key={categoria._id} value={categoria._id}>
                        {categoria.nombre}
                      </option>
                    ))}
                  </select>
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
                    {nuevoPlato._id ? "Editar Componente" : "Crear Componente"}
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

export default Platos;
