import Sidebar from "../components/common/Sidebar";
import Header from "../components/common/Header";
import { obtenerReporte } from "../services/equiposApi";

function Home() {
  const descargarReporte = async () => {
    try {
      const blob = await obtenerReporte();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "reporte_dispositivos.pdf");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error al descargar el reporte:", error.message);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-y-auto">
        <Header />
        <div className="p-4">
          <h1 className="text-2xl font-bold">CompuShop tu tienda confiable</h1>
          <div className="flex">
            <img
              src="https://www.webcodeperu.com/wp-content/uploads/2023/06/ecommerce-prueba-1.gif"
              className="h-[500px]"
            ></img>
            <button
              className="bg-green-500 h-10 rounded-md text-white w-full hover:bg-green-200"
              onClick={descargarReporte}
            >
              Generar reportes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
