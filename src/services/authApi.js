import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Función para registrar un usuario
export const register = async (nombre, email, password) => {
  try {
    const response = await axiosInstance.post("/auth/registro", {
      nombre,
      email,
      password,
    });
    const { token } = response.data;
    localStorage.setItem("token", token);
    return { success: true, message: "Usuario registrado exitosamente" };
  } catch (error) {
    if (error.response) {
      return { success: false, message: error.response.data.mensaje };
    } else {
      console.error("Error en el registro:", error.message);
      throw error;
    }
  }
};

// Función para iniciar sesión
export const login = async (email, password) => {
  try {
    const response = await axiosInstance.post("/auth/login", {
      email,
      password,
    });
    const { token } = response.data;
    localStorage.setItem("token", token);
    return { success: true, message: "Inicio de sesión exitoso" };
  } catch (error) {
    if (error.response) {
      return { success: false, message: error.response.data.mensaje };
    } else {
      console.error("Error en el inicio de sesión:", error.message);
      throw error;
    }
  }
};

// Función para cerrar sesión
export const logout = async () => {
  try {
    await axiosInstance.post("/auth/logout");
    localStorage.removeItem("token");
    return { success: true, message: "Sesión cerrada exitosamente" };
  } catch (error) {
    console.error("Error al cerrar sesión:", error.response.data);
    throw error;
  }
};
