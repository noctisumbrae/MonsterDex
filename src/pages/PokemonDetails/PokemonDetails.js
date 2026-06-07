import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getPokemonByName, getPokemonSpecies } from "../../api/pokeApi";
import Loading from "../../components/Loading/Loading";

import {
  cleanDescription,
  formatHeight,
  formatPokemonName,
  formatPokemonNumber,
  formatWeight
} from "../../utils/formatters";

import "./PokemonDetails.css";

function PokemonDetails() {
  const { name } = useParams();

  const [pokemon, setPokemon] = useState(null);
  const [species, setSpecies] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPokemonDetails() {
      try {
        setLoading(true);
        setError("");

        const pokemonData = await getPokemonByName(name);
        const speciesData = await getPokemonSpecies(pokemonData.species.name);

        setPokemon(pokemonData);
        setSpecies(speciesData);
      } catch (apiError) {
        setError("Não foi possível carregar os detalhes deste Pokémon.");
      } finally {
        setLoading(false);
      }
    }

    loadPokemonDetails();
  }, [name]);

  if (loading) {
    return <Loading text="Carregando detalhes..." />;
  }

  if (error) {
    return <p className="status-message">{error}</p>;
  }

  const imageUrl =
    pokemon.sprites?.other?.["official-artwork"]?.front_default ||
    pokemon.sprites?.front_default;

  const descriptionEntry = species.flavor_text_entries.find(
    (entry) => entry.language.name === "en"
  );

  const genusEntry = species.genera.find(
    (entry) => entry.language.name === "en"
  );

  const games = pokemon.game_indices.map((gameInfo) => gameInfo.version.name);

  return (
    <section className="details-page">
      <Link to="/" className="back-link">
        ← Voltar para o catálogo
      </Link>

      <div className="details-header-card">
        <div className="details-image-area">
          {imageUrl ? (
            <img src={imageUrl} alt={pokemon.name} />
          ) : (
            <p>Imagem não disponível</p>
          )}
        </div>

        <div className="details-main-info">
          <span className="details-number">
            Nº {formatPokemonNumber(pokemon.id)}
          </span>

          <h1>{formatPokemonName(pokemon.name)}</h1>

          {genusEntry && <p className="details-genus">{genusEntry.genus}</p>}

          <div className="details-types">
            {pokemon.types.map((typeInfo) => (
              <span key={typeInfo.type.name}>{typeInfo.type.name}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="details-section">
        <h2>Descrição</h2>
        <p>
          {descriptionEntry
            ? cleanDescription(descriptionEntry.flavor_text)
            : "Descrição não disponível."}
        </p>
      </div>

      <div className="details-section">
        <h2>Informações básicas</h2>

        <div className="basic-info-grid">
          <div>
            <strong>Altura</strong>
            <span>{formatHeight(pokemon.height)}</span>
          </div>

          <div>
            <strong>Peso</strong>
            <span>{formatWeight(pokemon.weight)}</span>
          </div>

          <div>
            <strong>Experiência base</strong>
            <span>{pokemon.base_experience || "Não informada"}</span>
          </div>
        </div>
      </div>

      <div className="details-section">
        <h2>Habilidades</h2>

        <ul className="simple-list">
          {pokemon.abilities.map((abilityInfo) => (
            <li key={abilityInfo.ability.name}>
              {formatPokemonName(abilityInfo.ability.name)}
              {abilityInfo.is_hidden && " (oculta)"}
            </li>
          ))}
        </ul>
      </div>

      <div className="details-section">
        <h2>Status</h2>

        <div className="stats-list">
          {pokemon.stats.map((statInfo) => (
            <div key={statInfo.stat.name} className="stat-item">
              <span>{formatPokemonName(statInfo.stat.name)}</span>
              <strong>{statInfo.base_stat}</strong>
            </div>
          ))}
        </div>
      </div>

      <div className="details-section">
        <h2>Jogos</h2>

        {games.length === 0 ? (
          <p>Não há jogos listados para este Pokémon.</p>
        ) : (
          <div className="games-list">
            {games.map((game) => (
              <span key={game}>{formatPokemonName(game)}</span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default PokemonDetails;
