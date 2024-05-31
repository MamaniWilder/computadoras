import axios from "axios";

const baseURL = "http://127.0.0.1:8000/dispositivos";

const axiosInstance = axios.create({
  baseURL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Función para obtener el token del localStorage
const getToken = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No se encontró token en el almacenamiento local");
  }
  return token;
};

// Interceptor para agregar el token a las solicitudes
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
  console.error("Request failed:", error.config);

  if (error.response) {
    // Server responded with a status code that falls out of the range of 2xx
    console.error("Response status:", error.response.status);
    throw new Error(error.response.data.message || "Error de servidor");
  } else if (error.request) {
    // The request was made but no response was received
    console.error("No response received:", error.request);
    throw new Error("No se recibió respuesta del servidor");
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error("Request setup error:", error.message);
    throw new Error("Error al enviar la solicitud");
  }
};

// Función para obtener todos los menús
export const obtenerEquipos = async () => {
  try {
    const response = await axiosInstance.get(`${baseURL}/dispositivos`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Función para crear un nuevo menú
export const crearEquipo = async (nombre, descripcion, componentes) => {
  try {
    const response = await axiosInstance.post(`${baseURL}/crear`, {
      nombre,
      descripcion,
      componentes,
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Función para editar un menú
export const editarMenu = async (id, nombre, descripcion, componentes) => {
  try {
    const response = await axiosInstance.put(`${baseURL}/editar/${id}`, {
      nombre,
      descripcion,
      componentes,
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Función para eliminar un menú
export const eliminarMenu = async (id) => {
  try {
    const response = await axiosInstance.delete(`${baseURL}/eliminar/${id}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Función para obtener un menú por su ID
export const obtenerEquipoPorId = async (id) => {
  try {
    const response = await axiosInstance.get(`${baseURL}/dispositivo/${id}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Función para obtener todos los menús que contienen un plato con un nombre específico
export const obtenerMenusPorNombrePlato = async (nombrePlato) => {
  try {
    const response = await axiosInstance.get(
      `${baseURL}/menusPorNombrePlato/${nombrePlato}`
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Función para eliminar un plato de un menú
export const eliminarComponenteDeMenu = async (menuId, platoId) => {
  try {
    const response = await axiosInstance.put(
      `${baseURL}/eliminarComponente/${menuId}/${platoId}`
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const obtenerReporte = async () => {
  try {
    const response = await axiosInstance.get("/reporte/dispositivos", {
      responseType: "blob", // Indicar que la respuesta es un archivo
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
