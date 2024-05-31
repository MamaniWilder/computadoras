import { useState, useEffect } from "react";
import Sidebar from "../components/common/Sidebar";
import Header from "../components/common/Header";
import {
  crearCategoria,
  eliminarCategoria,
  editarCategoria,
  obtenerCategorias,
  obtenerCategoriaPorId,
} from "../services/categoriasApi"; // Rutas actualizadas
import { MdDelete, MdEdit } from "react-icons/md";

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [error, setError] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [nuevaCategoria, setNuevaCategoria] = useState({
    nombre: "",
  });

  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    try {
      const response = await obtenerCategorias();
      setCategorias(response);
    } catch (error) {
      setError(error.message);
    }
  };

  const abrirModal = () => {
    setModalIsOpen(true);
  };

  const abrirModalEditar = async (id) => {
    try {
      const categoria = await obtenerCategoriaPorId(id);
      setNuevaCategoria(categoria);
      setModalIsOpen(true);
    } catch (error) {
      setError(error.message);
    }
  };

  const cerrarModal = () => {
    setModalIsOpen(false);
    setNuevaCategoria({
      nombre: "",
    });
  };

  const handleChangeNuevaCategoria = (e) => {
    setNuevaCategoria({
      ...nuevaCategoria,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitNuevaCategoria = async (e) => {
    e.preventDefault();
    try {
      if (!nuevaCategoria._id) {
        console.log(nuevaCategoria);
        await crearCategoria(nuevaCategoria.nombre);
      } else {
        await editarCategoria(nuevaCategoria._id, nuevaCategoria.nombre);
      }
      cerrarModal();
      cargarCategorias();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEliminarCategoria = async (id) => {
    if (window.confirm("¿Desea eliminar esta categoria?")) {
      try {
        await eliminarCategoria(id);
        cargarCategorias();
      } catch (error) {
        setError(error.message);
      }
    }
  };

  const handleEditCategoria = async (id) => {
    abrirModalEditar(id);
  };

  const filteredCategorias = categorias.filter((categoria) => categoria.nombre);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-y-auto">
        <Header />
        <div className="p-4">
          {error && <p className="text-red-500">Error: {error}</p>}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold animate-slide-in-left">
              Categorías
            </h1>
            <button
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded focus:outline-none"
              onClick={abrirModal}
            >
              + Nueva Categoría
            </button>
          </div>
          <div className="mt-4">
            {categorias.length === 0 && <p>Cargando categorías...</p>}
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white shadow-md rounded-lg">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-2">Nombre</th>
                    <th className="px-4 py-2">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategorias.map((categoria) => (
                    <tr key={categoria._id} className="animate-fade-in">
                      <td className="border px-4 py-2">{categoria.nombre}</td>
                      <td className="border px-4 py-2 ">
                        <div className="flex justify-center text-xl">
                          <button
                            className="text-red-500 hover:text-red-600 mr-2 focus:outline-none"
                            onClick={() =>
                              handleEliminarCategoria(categoria._id)
                            }
                          >
                            <MdDelete />
                          </button>
                          <button
                            className="text-orange-500 hover:text-orange-600 mr-2 focus:outline-none"
                            onClick={() => handleEditCategoria(categoria._id)}
                          >
                            <MdEdit />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para agregar/editar categoría */}
      {modalIsOpen && (
        <>
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-black opacity-50"></div>
            <div className="relative bg-white p-6 rounded-lg shadow-lg w-1/2">
              <h2 className="text-2xl font-bold mb-4">
                {nuevaCategoria._id ? "Editar Categoría" : "Nueva Categoría"}
              </h2>
              <form onSubmit={handleSubmitNuevaCategoria}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Nombre
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={nuevaCategoria.nombre}
                    onChange={handleChangeNuevaCategoria}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
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
                    {nuevaCategoria._id
                      ? "Editar Categoría"
                      : "Crear Categoría"}
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

export default Categorias;
