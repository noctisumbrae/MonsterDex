import "./FilterBar.css";

const pokemonTypes = [
  "normal",
  "fire",
  "water",
  "grass",
  "electric",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy"
];

function FilterBar({ selectedType, onTypeChange, sortOption, onSortChange }) {
  return (
    <div className="filter-bar">
      <div className="filter-field">
        <label htmlFor="type-filter">Tipo</label>

        <select
          id="type-filter"
          value={selectedType}
          onChange={(event) => onTypeChange(event.target.value)}
        >
          <option value="">Todos</option>

          {pokemonTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-field">
        <label htmlFor="sort-filter">Ordenar por</label>

        <select
          id="sort-filter"
          value={sortOption}
          onChange={(event) => onSortChange(event.target.value)}
        >
          <option value="number-asc">Número crescente</option>
          <option value="number-desc">Número decrescente</option>
          <option value="name-asc">Nome A-Z</option>
          <option value="name-desc">Nome Z-A</option>
        </select>
      </div>
    </div>
  );
}

export default FilterBar;
