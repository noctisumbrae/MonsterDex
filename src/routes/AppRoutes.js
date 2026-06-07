import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home/Home";
import PokemonDetails from "../pages/PokemonDetails/PokemonDetails";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/pokemon/:name" element={<PokemonDetails />} />
    </Routes>
  );
}

export default AppRoutes;
