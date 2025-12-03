import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate

const BarraLateral = ({ seccionActiva, setSeccionActiva }) => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const navigate = useNavigate(); // Inicializa navigate

  return (
    <>
      {/* Botón hamburguesa para móvil */}
      <button
        onClick={() => setMenuAbierto(!menuAbierto)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg border border-neutral-200"
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6 text-neutral-900"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          {menuAbierto ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Overlay para móvil */}
      {menuAbierto && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setMenuAbierto(false)}
        />
      )}

      {/* Barra lateral fija */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 flex-shrink-0 bg-white border-r border-neutral-200 p-6 flex flex-col transition-transform duration-300 ease-in-out z-50 ${menuAbierto ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Título */}
        <div className="mb-8 pb-6 border-b border-neutral-200">
          <h2 className="text-2xl font-serif text-neutral-900 tracking-tight">Mi Cuenta</h2>
          <p className="text-xs text-neutral-500 mt-1 font-light">Panel de usuario</p>
        </div>

        {/* Navegación */}
        <nav className="flex flex-col gap-2">
          {/* Botón Perfil */}
          <button
            onClick={() => {
              setSeccionActiva('perfil');
              setMenuAbierto(false);
            }}
            className={`flex items-center gap-3 px-4 py-3 rounded transition-all duration-200 text-left ${seccionActiva === 'perfil' ? 'bg-neutral-900 text-white' : 'text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900'}`}
          >
            <svg
              className="w-5 h-5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.121 17.804A10 10 0 0112 15a10 10 0 016.879 2.804M12 12a4 4 0 100-8 4 4 0 000 8z"
              />
            </svg>
            <span className="text-sm font-light">Perfil</span>
          </button>

          {/* Botón Pedidos */}
          <button
            onClick={() => {
              setSeccionActiva('pedidos');
              setMenuAbierto(false);
            }}
            className={`flex items-center gap-3 px-4 py-3 rounded transition-all duration-200 text-left ${seccionActiva === 'pedidos' ? 'bg-neutral-900 text-white' : 'text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900'}`}
          >
            <svg
              className="w-5 h-5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <span className="text-sm font-light">Pedidos</span>
          </button>

          {/* Botón Configuración */}
          <button
            onClick={() => {
              setSeccionActiva('configuracion');
              setMenuAbierto(false);
            }}
            className={`flex items-center gap-3 px-4 py-3 rounded transition-all duration-200 text-left ${seccionActiva === 'configuracion' ? 'bg-neutral-900 text-white' : 'text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900'}`}
          >
            <svg
              className="w-5 h-5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="text-sm font-light">Configuración</span>
          </button>

          {/* Nuevo botón Volver a Mayle */}
          <button
            onClick={() => navigate('/')} // Esto navega a la página principal
            className="flex items-center gap-3 px-4 py-3 rounded transition-all duration-200 text-left text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 mt-auto"
          >
            <svg
              className="w-5 h-5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 19V6m-7 7l7-7 7 7"
              />
            </svg>
            <span className="text-sm font-light">Volver a Mayle</span>
          </button>
        </nav>

        {/* Pie */}
        <div className="mt-auto pt-6 border-t border-neutral-200">
          <p className="text-xs text-neutral-400 font-light text-center">
            Panel de Gestión Mayle
          </p>
        </div>
      </aside>
    </>
  );
};

export default BarraLateral;
