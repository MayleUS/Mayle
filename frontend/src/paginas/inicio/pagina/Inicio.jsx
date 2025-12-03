import GaleriaInicio from "../componentes/GaleriaInicio";
import BloquePromocional from "../componentes/BloquePromocional";
import ExploraCatalogo from "../componentes/ExplorarCatalogo";

export default function Inicio() {
  
  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <GaleriaInicio />
      <BloquePromocional />
      <ExploraCatalogo />
    </div>
  );
}