import React, { useState, useCallback, useRef, useEffect } from "react";
import "./App.css";
import produce from "immer";
import styled from "styled-components";
const ExamplePatters = require("./components/ExamplePatterns");

const ContainerDiv = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;

const ButtonDiv = styled.div`
  display: flex;
  flex-direction: column;
`;

const numRows = 50;
const numCols = 60;

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
  const gridRef = useRef(grid);
  gridRef.current = grid;

  const [running, setRunning] = useState(false);

  const runningRef = useRef(running);
  runningRef.current = running;

  const [generation, setGeneration] = useState(1);

  const generationRef = useRef(generation);
  generationRef.current = generation;

  const [speed, setSpeed] = useState(500);

  const [gridCache, setGridCache] = useState({});

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

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }
    // run the game:

    setGrid((g) => {
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

    setGeneration((generationRef.current += 1));

    setTimeout(runSimulation, speed);
  }, [speed]);

  useEffect(() => {
    setGridCache({
      ...gridCache,
      [generationRef.current]: gridRef.current,
    });
  }, [gridRef.current]);

  const speedDown = () => {
    if (speed === 50) {
      return;
    } else {
      setSpeed(speed - 50);
    }
  };

  const speedUp = () => {
    if (speed === 1000) {
      return;
    } else {
      setSpeed(speed + 50);
    }
  };

  const generationUp = () => {
    if (generation > Object.keys(gridCache).length - 1) {
      return;
    } else {
      setGeneration(generation + 1);
      setGrid(gridCache[generation + 1]);
    }
  };

  const generationDown = () => {
    if (generation > 1) {
      setGeneration(generation - 1);
      setGrid(gridCache[generation - 1]);
    } else {
      return;
    }
  };

  return (
    <>
      <h1>The Game of Life</h1>
      <ContainerDiv>
        <ButtonDiv>
          <h3>Still Lifes</h3>
          <button
            onClick={() => {
              setGrid(generateEmptyGrid());
              setGeneration(1);
              setGrid(ExamplePatters.block);
            }}
          >
            Block
          </button>
          <button>Beehive</button>
          <button>Loaf</button>
          <button>Boat</button>
          <button>Tub</button>
        </ButtonDiv>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${numCols}, 10px)`,
            justifyContent: "center",
            borderCollapse: "collapse",
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
        <ButtonDiv>
          <h3>Oscillators</h3>
          <button className="sideButtons">Blinker</button>
          <button className="sideButtons">Toad</button>
          <button className="sideButtons">Beacon</button>
          <button className="sideButtons">Pulsar</button>
          <button className="sideButtons">Pentadecathalon</button>
        </ButtonDiv>
      </ContainerDiv>

      <div className="flexRow upperControls">
        <span>
          <button onClick={speedDown}>{"+ "}</button>
          <Slider speed={speed} onSpeedChange={handleSpeedChange} />
          <button onClick={speedUp}>{" -"}</button>
        </span>
        <span>
          <button onClick={generationDown}>{"- "}</button>
          {`Generation: ${generation}`}
          <button onClick={generationUp}>{" +"}</button>
        </span>
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
            setGeneration(1);
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
