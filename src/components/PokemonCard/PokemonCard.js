import { Link } from "react-router-dom";

import { formatPokemonName, formatPokemonNumber } from "../../utils/formatters";
import "./PokemonCard.css";

function PokemonCard({ pokemon }) {
  return (
    <Link to={`/pokemon/${pokemon.name}`} className="pokemon-card">
      <div className="pokemon-card-image-area">
        {pokemon.image ? (
          <img src={pokemon.image} alt={pokemon.name} />
        ) : (
          <div className="pokemon-card-no-image">Sem imagem</div>
        )}
      </div>

      <div className="pokemon-card-info">
        <span className="pokemon-number">
          Nº {formatPokemonNumber(pokemon.id)}
        </span>

        <h3>{formatPokemonName(pokemon.name)}</h3>

        <div className="pokemon-types">
          {pokemon.types.map((type) => (
            <span key={type} className="pokemon-type">
              {type}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

export default PokemonCard;
