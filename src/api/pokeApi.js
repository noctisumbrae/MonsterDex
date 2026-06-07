const BASE_URL = "https://pokeapi.co/api/v2";

async function fetchJson(url, errorMessage) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(errorMessage);
  }

  return response.json();
}

export function extractIdFromUrl(url) {
  const parts = url.split("/").filter(Boolean);
  const id = Number(parts[parts.length - 1]);

  return Number.isNaN(id) ? 0 : id;
}

export async function getPokemonList(limit = 30, offset = 0) {
  return fetchJson(
    `${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`,
    "Erro ao buscar lista de Pokémon"
  );
}

export async function getAllPokemonNames() {
  const firstRequest = await getPokemonList(1, 0);
  const fullList = await getPokemonList(firstRequest.count, 0);

  return fullList.results.map((pokemon) => ({
    name: pokemon.name,
    url: pokemon.url,
    id: extractIdFromUrl(pokemon.url)
  }));
}

export async function getPokemonByName(name) {
  return fetchJson(
    `${BASE_URL}/pokemon/${name}`,
    "Pokémon não encontrado"
  );
}

export async function getPokemonPreview(name) {
  let pokemon;

  try {
    pokemon = await getPokemonByName(name);
  } catch (error) {
    const species = await getPokemonSpecies(name);
    const defaultVariety =
      species.varieties.find((variety) => variety.is_default) || species.varieties[0];

    pokemon = await fetchJson(
      defaultVariety.pokemon.url,
      "Erro ao buscar visualização do Pokémon"
    );
  }

  return {
    id: pokemon.id,
    name: pokemon.name,
    image:
      pokemon.sprites?.other?.["official-artwork"]?.front_default ||
      pokemon.sprites?.front_default,
    types: pokemon.types.map((typeInfo) => typeInfo.type.name)
  };
}

export async function getPokemonSpecies(name) {
  return fetchJson(
    `${BASE_URL}/pokemon-species/${name}`,
    "Erro ao buscar espécie do Pokémon"
  );
}

export async function getPokemonNamesByType(typeName) {
  const data = await fetchJson(
    `${BASE_URL}/type/${typeName}`,
    "Erro ao buscar tipo"
  );

  return data.pokemon.map((item) => ({
    name: item.pokemon.name,
    url: item.pokemon.url,
    id: extractIdFromUrl(item.pokemon.url)
  }));
}

export async function getPokemonNamesByGame(gameName) {
  const versionData = await fetchJson(
    `${BASE_URL}/version/${gameName}`,
    "Erro ao buscar jogo"
  );

  const versionGroupData = await fetchJson(
    versionData.version_group.url,
    "Erro ao buscar grupo de versão"
  );

  const firstPokedex = versionGroupData.pokedexes[0];

  if (!firstPokedex) {
    return [];
  }

  const pokedexData = await fetchJson(
    firstPokedex.url,
    "Erro ao buscar Pokédex do jogo"
  );

  return pokedexData.pokemon_entries.map((entry) => ({
    name: entry.pokemon_species.name,
    url: entry.pokemon_species.url,
    id: extractIdFromUrl(entry.pokemon_species.url)
  }));
}
