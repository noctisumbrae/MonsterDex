import { useEffect, useState } from "react";

import {
  getAllPokemonNames,
  getPokemonNamesByGame,
  getPokemonNamesByType,
  getPokemonPreview
} from "../../api/pokeApi";

import SearchBar from "../../components/SearchBar/SearchBar";
import GameTags from "../../components/GameTags/GameTags";
import FilterBar from "../../components/FilterBar/FilterBar";
import PokemonCard from "../../components/PokemonCard/PokemonCard";
import Pagination from "../../components/Pagination/Pagination";
import Loading from "../../components/Loading/Loading";

import { formatPokemonNumber } from "../../utils/formatters";
import "./Home.css";

const POKEMON_PER_PAGE = 30;

function Home() {
  const [allPokemonNames, setAllPokemonNames] = useState([]);
  const [pokemonNames, setPokemonNames] = useState([]);
  const [filteredPokemonNames, setFilteredPokemonNames] = useState([]);
  const [pokemonPreviews, setPokemonPreviews] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGame, setSelectedGame] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [sortOption, setSortOption] = useState("number-asc");
  const [currentPage, setCurrentPage] = useState(1);

  const [listLoading, setListLoading] = useState(true);
  const [cardsLoading, setCardsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAllPokemon() {
      try {
        setListLoading(true);
        setError("");

        const data = await getAllPokemonNames();

        setAllPokemonNames(data);
        setPokemonNames(data);
      } catch (apiError) {
        setError("Não foi possível carregar o catálogo de Pokémon.");
      } finally {
        setListLoading(false);
      }
    }

    loadAllPokemon();
  }, []);

  useEffect(() => {
    async function loadFilteredBaseList() {
      if (allPokemonNames.length === 0) {
        return;
      }

      try {
        setListLoading(true);
        setError("");

        let baseList = selectedGame
          ? await getPokemonNamesByGame(selectedGame)
          : allPokemonNames;

        if (selectedType) {
          const typeList = await getPokemonNamesByType(selectedType);
          const typeNames = new Set(typeList.map((pokemon) => pokemon.name));

          baseList = baseList.filter((pokemon) => typeNames.has(pokemon.name));
        }

        setPokemonNames(baseList);
      } catch (apiError) {
        setError("Não foi possível aplicar os filtros escolhidos.");
      } finally {
        setListLoading(false);
      }
    }

    loadFilteredBaseList();
  }, [allPokemonNames, selectedGame, selectedType]);

  useEffect(() => {
    let result = [...pokemonNames];
    const search = searchTerm.trim().toLowerCase();

    if (search !== "") {
      result = result.filter((pokemon) => {
        const pokemonNumber = String(pokemon.id);
        const formattedNumber = formatPokemonNumber(pokemon.id);

        return (
          pokemon.name.toLowerCase().includes(search) ||
          pokemonNumber.includes(search) ||
          formattedNumber.includes(search)
        );
      });
    }

    if (sortOption === "number-asc") {
      result.sort((a, b) => a.id - b.id);
    }

    if (sortOption === "number-desc") {
      result.sort((a, b) => b.id - a.id);
    }

    if (sortOption === "name-asc") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (sortOption === "name-desc") {
      result.sort((a, b) => b.name.localeCompare(a.name));
    }

    setFilteredPokemonNames(result);
  }, [pokemonNames, searchTerm, sortOption]);

  useEffect(() => {
    let isActive = true;

    async function loadPokemonPreviews() {
      const startIndex = (currentPage - 1) * POKEMON_PER_PAGE;
      const endIndex = startIndex + POKEMON_PER_PAGE;
      const pagePokemon = filteredPokemonNames.slice(startIndex, endIndex);

      if (pagePokemon.length === 0) {
        setPokemonPreviews([]);
        return;
      }

      try {
        setCardsLoading(true);
        setError("");

        const previews = await Promise.all(
          pagePokemon.map((pokemon) => getPokemonPreview(pokemon.name))
        );

        if (isActive) {
          setPokemonPreviews(previews);
        }
      } catch (apiError) {
        if (isActive) {
          setError("Não foi possível carregar os cards dos Pokémon.");
        }
      } finally {
        if (isActive) {
          setCardsLoading(false);
        }
      }
    }

    loadPokemonPreviews();

    return () => {
      isActive = false;
    };
  }, [filteredPokemonNames, currentPage]);

  function handleSearchChange(value) {
    setSearchTerm(value);
    setCurrentPage(1);
  }

  function handleGameChange(game) {
    setSelectedGame(game);
    setCurrentPage(1);
  }

  function handleTypeChange(type) {
    setSelectedType(type);
    setCurrentPage(1);
  }

  function handleSortChange(option) {
    setSortOption(option);
    setCurrentPage(1);
  }

  function handlePreviousPage() {
    setCurrentPage((page) => page - 1);
  }

  function handleNextPage() {
    setCurrentPage((page) => page + 1);
  }

  const totalPages = Math.ceil(filteredPokemonNames.length / POKEMON_PER_PAGE) || 1;

  return (
    <section className="home-page">
      <div className="home-intro">
        <h1>Catálogo MonsterDex</h1>
        <p>
          Pesquise por nome ou número, filtre por jogo ou tipo e abra o card
          para ver mais detalhes.
        </p>
      </div>

      <SearchBar searchTerm={searchTerm} onSearchChange={handleSearchChange} />

      <GameTags selectedGame={selectedGame} onGameChange={handleGameChange} />

      <FilterBar
        selectedType={selectedType}
        onTypeChange={handleTypeChange}
        sortOption={sortOption}
        onSortChange={handleSortChange}
      />

      {listLoading ? (
        <Loading text="Carregando catálogo..." />
      ) : error ? (
        <p className="status-message">{error}</p>
      ) : (
        <>
          <div className="home-results-info">
            <p>{filteredPokemonNames.length} Pokémon encontrados</p>
          </div>

          {cardsLoading ? (
            <Loading text="Carregando cards..." />
          ) : filteredPokemonNames.length === 0 ? (
            <p className="status-message">
              Nenhum Pokémon encontrado com esses filtros.
            </p>
          ) : (
            <>
              <div className="pokemon-grid">
                {pokemonPreviews.map((pokemon) => (
                  <PokemonCard key={pokemon.id} pokemon={pokemon} />
                ))}
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPrevious={handlePreviousPage}
                onNext={handleNextPage}
              />
            </>
          )}
        </>
      )}
    </section>
  );
}

export default Home;
