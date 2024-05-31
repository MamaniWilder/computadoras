import { useState } from "react";
import { IoIosEyeOff } from "react-icons/io";
import { IoMdEye } from "react-icons/io";
import { Link } from "react-router-dom";
import { register } from "../services/authApi";

function Registro() {
  const [showPassword, setShowPassword] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const fullName = formData.get("fullName");
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const response = await register(fullName, email, password);
      setMensaje(response.message);
    } catch (error) {
      setMensaje("Error en el registro. Inténtalo nuevamente.");
    }
  };

  return (
    <section className="bg-gray-200 min-h-screen flex box-border justify-center items-center">
      <div className="bg-white shadow-lg rounded-xl flex max-w-3xl items-center ">
        <div className="w-[500px] px-8">
          <h2 className="font-bold text-3xl text-[#363a75]">Registrate</h2>
          <p className="text-sm mt-4 text-[#363a75]">Completa los campos</p>

          {mensaje && (
            <div className="mt-4 p-2 rounded bg-blue-200 text-blue-800">
              {mensaje}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              className="p-2 mt-4 rounded-xl border"
              type="text"
              name="fullName"
              placeholder="Nombre completo"
            />
            <input
              className="p-2 rounded-xl border"
              type="email"
              name="email"
              placeholder="Correo electrónico"
            />
            <div className="relative">
              <input
                className="p-2 rounded-xl border w-full"
                minLength="8"
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                placeholder="Contraseña"
              />
              {showPassword ? (
                <IoIosEyeOff
                  className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer z-20 opacity-100"
                  size={20}
                  onClick={togglePasswordVisibility}
                />
              ) : (
                <IoMdEye
                  className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer z-20 opacity-100"
                  size={20}
                  onClick={togglePasswordVisibility}
                />
              )}
            </div>
            <button
              className="bg-[#363a75] text-white py-2 rounded-xl hover:scale-105 duration-300 hover:bg-[#206ab1] font-medium"
              type="submit"
            >
              Registrarse
            </button>
          </form>
          <div className="mt-6 items-center text-gray-100">
            <hr className="border-gray-300" />
            <p className="text-center text-sm">O</p>
            <hr className="border-gray-300" />
          </div>

          <div className="mt-4 text-sm flex justify-between items-center container-mr">
            <p className="mr-3 md:mr-0">¿Ya tienes una cuenta?</p>
            <Link
              className="hover:border register text-[#363a75] hover:border-gray-400 rounded-xl py-2 px-5 hover:scale-110 hover:bg-[#002c7424] font-semibold duration-300"
              to="/login"
            >
              Iniciar sesión
            </Link>
          </div>
        </div>
        <div className="md:block hidden w-[500px]">
          <img
            className="rounded-2xl max-h-[600px] w-full"
            src="https://static.vecteezy.com/system/resources/previews/030/468/015/non_2x/from-a-computer-desk-view-financial-data-on-multiple-screens-in-an-office-vertical-mobile-wallpaper-ai-generated-free-photo.jpg"
            alt="Formulario de inicio de sesión"
          />
        </div>
      </div>
    </section>
  );
}

export default Registro;
