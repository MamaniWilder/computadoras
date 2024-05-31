import axios from "axios";

const baseURL = "http://127.0.0.1:8000/componentes";

const headers = {
  "Content-Type": "application/json",
};

const axiosInstance = axios.create({
  baseURL,
  timeout: 5000,
  headers,
});

const getToken = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No se encontró token en el almacenamiento local");
  }
  return token;
};

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Función para manejar errores de Axios
const handleError = (error) => {
  console.error("Request failed:", error);

  if (error.response) {
    console.error("Response status:", error.response.status);
    throw new Error(error.response.data.message || "Error de servidor");
  } else if (error.request) {
    console.error("No response received:", error.request);
    throw new Error("No se recibió respuesta del servidor");
  } else {
    console.error("Request setup error:", error.message);
    throw new Error("Error al enviar la solicitud");
  }
};

export const obtenerComponentes = async () => {
  try {
    const response = await axiosInstance.get("/componentes");
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const crearComponente = async (
  nombre,
  caracteristicas,
  descripcion,
  precio,
  categoria
) => {
  try {
    const response = await axiosInstance.post("/crear", {
      nombre,
      caracteristicas,
      descripcion,
      precio,
      categoria,
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const editarComponente = async (
  id,
  nombre,
  ingredientes,
  descripcion,
  precio,
  categoria
) => {
  try {
    const response = await axiosInstance.put(`/editar/${id}`, {
      nombre,
      ingredientes,
      descripcion,
      precio,
      categoria,
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const eliminarComponente = async (id) => {
  try {
    const response = await axiosInstance.delete(`/eliminar/${id}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const obtenerPlatoPorId = async (id) => {
  try {
    const response = await axiosInstance.get(`/plato/${id}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const obtenerPlatosPorCategoria = async (categoria) => {
  try {
    const response = await axiosInstance.get(`/porCategoria/${categoria}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
