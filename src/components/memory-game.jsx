import React, { useEffect, useState } from "react";

const Memorygame = () => {
  const [gridSize, setGridsize] = useState(4);
  const [cards, setCards] = useState([]);

  const [flipped, setFlipped] = useState([]);
  const [solved, setSloved] = useState([]);
  const [disabled, setDisabled] = useState(false);

  const [won, setWon] = useState(false);

  const handleGridChangeSize = (e) => {
    const size = e.target.value;
    if (size >= 2 && size <= 10) {
      console.log("Grid size set to:", size); // Debugging line
      setGridsize(size);
    }
    setGridsize(e.target.value);
  };

  const initializeGame = () => {
    const totalCards = gridSize * gridSize;
    const pairCount = Math.floor(totalCards / 2);
    const number = [...Array(pairCount).keys()].map((n) => n + 1);
    const shuffledCards = [...number, ...number]
      .sort(() => Math.random() - 0.5)
      .slice(0, totalCards)
      .map((number, index) => ({ id: index, number }));
    console.log(shuffledCards);
    setCards(shuffledCards);
    setFlipped([]);
    setSloved([]);
    setWon(false);
  };

  const checkMatch = (secondId) => {
    const [firstId] = flipped;
    if (cards[firstId].number === cards[secondId].number) {
      setSloved([...solved, firstId, secondId]);
      setDisabled(false);
      setFlipped([]);
    } else {
      setTimeout(() => {
        setDisabled(false);
        setFlipped([]);
      }, 1000);
    }
  };

  useEffect(() => {
    initializeGame();
  }, [gridSize]);

  const handleClick = (id) => {
    if (disabled || won) return;
    if (flipped.length === 0) {
      setFlipped([id]);
      return;
    }
    if (flipped.length === 1) {
      setDisabled(true);
      if (id !== flipped[0]) {
        setFlipped([...flipped, id]);
        checkMatch(id);
      } else {
        setFlipped([]);
        setDisabled(false);
      }
    }
  };

  console.log(flipped);

  const isFlipped = (id) => flipped.includes(id) || solved.includes(id);
  const isSolved = (id) => solved.includes(id);

  useEffect(() => {
    if (cards.length === solved.length && solved.length > 0) {
      setWon(true);
    }
  }, [cards, solved]);

  return (
    <div>
      <div className="flex justify-center flex-col items-center min-h-screen bg-gray-100 p-4">
        <p className="text-3xl font-bold mb-6">MEMORY GAME</p>
        <div className="mb-4">
          <label htmlFor="gridSize">Grid size: max(10)</label>
          <input
            type="number"
            id="gridSize"
            min="2"
            max="10"
            value={gridSize}
            onChange={handleGridChangeSize}
            className="border-2 border-gray-300 rounded px-2 py-1"
          />
        </div>
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
            width: `min(100%, ${gridSize * 5.5}rem)`,
          }}
        >
          {cards.map((card) => (
            <div
              key={card.id}
              onClick={() => handleClick(card.id)}
              className={`border flex items-center justify-center rounded-lg text-xl font-bold bg-gray-300 text-gray-400 text-center aspect-square cursor-pointer transition-all duration-300 ${
                isFlipped(card.id)
                  ? isSolved(card.id)
                    ? "bg-green-400 text-white"
                    : "bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-400"
              }`}
            >
              {isFlipped(card.id) ? card.number : "?"}
            </div>
          ))}
        </div>
        <div>
          {won && (
            <div className="mt-4 text-4xl font-bold text-green-600 animate-bounce">
              YOU WON!!
            </div>
          )}
        </div>
        <div
          onClick={initializeGame}
          className="mt-4 p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          <button>{won ? "Play again" : "Reset"}</button>
        </div>
      </div>
    </div>
  );
};

export default Memorygame;
