import "./GameTags.css";

const games = [
  { label: "Red", value: "red" },
  { label: "Blue", value: "blue" },
  { label: "Yellow", value: "yellow" },
  { label: "Gold", value: "gold" },
  { label: "Silver", value: "silver" },
  { label: "Crystal", value: "crystal" },
  { label: "Ruby", value: "ruby" },
  { label: "Sapphire", value: "sapphire" },
  { label: "Emerald", value: "emerald" },
  { label: "FireRed", value: "firered" },
  { label: "LeafGreen", value: "leafgreen" }
];

function GameTags({ selectedGame, onGameChange }) {
  function handleClick(gameValue) {
    if (selectedGame === gameValue) {
      onGameChange("");
    } else {
      onGameChange(gameValue);
    }
  }

  return (
    <div className="game-tags">
      <p className="game-tags-title">Filtrar por jogo:</p>

      <div className="game-tags-list">
        {games.map((game) => (
          <button
            key={game.value}
            type="button"
            className={selectedGame === game.value ? "game-tag active" : "game-tag"}
            onClick={() => handleClick(game.value)}
          >
            {game.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default GameTags;
