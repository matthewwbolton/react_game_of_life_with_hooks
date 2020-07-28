import React, { useState, useCallback } from "react";
import "./App.css";
import produce from "immer";

const numRows = 50;
const numCols = 50;

function App() {
  const [grid, setGrid] = useState(() => {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      rows.push(Array.from(Array(numCols), () => 0));
    }

    return rows;
  });

  const [running, setRunning] = useState(false);

  const runSimulation = useCallback(() => {
    if (!running) {
      return;
    }
  }, []);

  return (
    <>
      <button
        onClick={() => {
          setRunning(!running);
        }}
      >
        {running ? "Start" : "Stop"}
      </button>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numCols}, 20px)`,
        }}
      >
        {grid.map((rows, i) =>
          rows.map((col, k) => (
            <div
              key={`${i}-${k}`}
              onClick={() => {
                const newGrid = produce(grid, (gridCopy) => {
                  gridCopy[i][k] = grid[i][k] ? 0 : 1;
                });
                setGrid(newGrid);
              }}
              style={{
                width: 20,
                height: 20,
                backgroundColor: grid[i][k] ? "pink" : undefined,
                border: "1px solid black",
              }}
            />
          ))
        )}
      </div>
    </>
  );
}

export default App;
