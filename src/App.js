import React, { useState, useCallback, useRef } from "react";
import "./App.css";
import produce from "immer";

const numRows = 75;
const numCols = 75;

const operations = [
  [-1, 1],
  [0, 1],
  [1, 1],
  [1, 0],
  [1, -1],
  [0, -1],
  [-1, -1],
  [-1, 0],
];

const generateEmptyGrid = () => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0));
  }

  return rows;
};

function App() {
  const [grid, setGrid] = useState(() => {
    return generateEmptyGrid();
  });

  const [running, setRunning] = useState(false);

  const runningRef = useRef(running);
  runningRef.current = running;

  let [generation, setGeneration] = useState(0);

  const [speed, setSpeed] = useState();

  const Slider = ({ speed, onSpeedChange }) => {
    const handleChange = (e) => onSpeedChange(e.target.value);

    return (
      <input
        type="range"
        min="50"
        max="1000"
        step="50"
        value={speed}
        onChange={handleChange}
      />
    );
  };

  const handleSpeedChange = (newSpeed) => {
    setSpeed(newSpeed);
  };

  console.log(speed);

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    // simulate
    setGrid((g) => {
      setGeneration(generation++);

      return produce(g, (gridCopy) => {
        for (let i = 0; i < numRows; i++) {
          for (let k = 0; k < numCols; k++) {
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newK = k + y;
              if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
                neighbors += g[newI][newK];
              }
            });

            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][k] = 0;
            } else if (g[i][k] === 0 && neighbors === 3) {
              gridCopy[i][k] = 1;
            }
          }
        }
      });
    });

    console.log("SPEED", speed);
    setTimeout(runSimulation, speed);
  }, [generation]);

  return (
    <>
      <h1>The Game of Life</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numCols}, 10px)`,
          justifyContent: "center",
        }}
      >
        {grid.map((rows, i) =>
          rows.map((col, k) => (
            <div
              id="td"
              key={`${i}-${k}`}
              onClick={() => {
                const newGrid = produce(grid, (gridCopy) => {
                  gridCopy[i][k] = grid[i][k] ? 0 : 1;
                });
                setGrid(newGrid);
              }}
              style={{
                width: 10,
                height: 10,
                backgroundColor: grid[i][k] ? "salmon" : undefined,
                border: "1px solid black",
                borderColor: "darkgrey",
              }}
            />
          ))
        )}
      </div>
      <div className="flexRow upperControls">
        <span>
          {"- "}
          <Slider speed={speed} onSpeedChange={handleSpeedChange} />
          {" +"}
        </span>
        {`Generation: ${generation}`}
      </div>
      <div className="flexRow lowerControls">
        <button
          onClick={() => {
            setRunning(!running);
            if (!running) {
              runningRef.current = true;
              runSimulation();
            }
          }}
        >
          {!running ? "Start" : "Stop"}
        </button>
        <button
          onClick={() => {
            setGrid(generateEmptyGrid());
          }}
        >
          Clear
        </button>
        <button
          onClick={() => {
            const rows = [];
            for (let i = 0; i < numRows; i++) {
              rows.push(
                Array.from(Array(numCols), () => (Math.random() > 0.75 ? 1 : 0))
              );
            }

            setGrid(rows);
          }}
        >
          Random
        </button>
      </div>
    </>
  );
}

export default App;
