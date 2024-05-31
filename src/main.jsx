/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login.jsx";
import Registro from "./pages/Registro.jsx";
import Home from "./pages/Home.jsx";
import Equipos from "./pages/Equipos.jsx";
import Categorias from "./pages/Categorias.jsx";
import Componentes from "./pages/Componentes.jsx";
import EquipoDetalle from "./pages/EquipoDetalles.jsx";

const isAuthenticated = () => {
  // Verificar si hay un token en el localStorage
  const token = localStorage.getItem("token");
  return token ? true : false;
};

const PrivateRoute = ({ element, path }) => {
  return isAuthenticated() ? element : <Navigate to="/login" />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <PrivateRoute path="/menus" element={<Home />} />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Registro />,
  },
  {
    path: "/computadoras",
    element: <PrivateRoute path="/computadoras" element={<Equipos />} />,
  },
  {
    path: "/detallecomponente/:idMenu",
    element: (
      <PrivateRoute
        path="/detallecomponente"
        element={<EquipoDetalle />}
      ></PrivateRoute>
    ),
  },
  {
    path: "/categorias",
    element: <PrivateRoute path="/categorias" element={<Categorias />} />,
  },
  {
    path: "/componentes",
    element: <PrivateRoute path="/componentes" element={<Componentes />} />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
