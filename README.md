Conway’s Game of Life

This is an implementation of John Horton Conway’s Game of Life written in React.

Intro

    -   This project is current being hosted at: https://react-game-of-life-with-hooks-nozd4pevu.vercel.app/

    -   This adaptation of Conway’s Game of Life is implemented with Create React App utilizing its built-in       state  management to handle state for the game.

    -   This project also utilizes the Immer package’s built-in default function, “produce”, to handle the “double-buffering” for the game board as it cycles from one generation to the next.

    -   This implementation utilizes a cache in order to save the board state for each generation so that the user can step backwards and forwards through each generation.

Core Technical/Inspiration

    -   This project was initially written using Vanilla JavaScript and utilizing direct DOM manipulation. This implementation is also included in the repo in a separate branch entitled Vanilla JavaScript Game of Life as a reference.

    - The second iteration of this build was implemented utilizing the React framework in order to take advantage of its built in state management and flexibility.

ToDo

    -   The user currently has to pause the game in order to adjust the speed at which each subsequent generation is calculated and rendered.

    -   I would like to add functionality that would allow the user to predict future generations by calculating the configuration of cells at a user specified point in time, based on the current generation of the board.

    -   I would like to include functionality to import and export board configurations.

    -   Need to include controls to allow the user the ability to change the dimension of the game board.

Contact

    -   Email: matthew.bolton.dev@gmail.com
    -   Slack: matthewwbolton
