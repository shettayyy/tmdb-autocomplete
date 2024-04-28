# Deel Autocomplete

---

Deel Autocomplete is a React component that provides a dropdown list of suggestions based on the user's input.

<!-- TABLE OF CONTENTS -->

## Table of Contents

<details open>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#Design Decision">Design Decision</a></li>
    <li><a href="#deployment">Deployment</a></li>
    <li></li><a href="#contributor">Contributor</a></li>
  </ol>
</details>

## About The Project

Deel Autocomplete is a React component that provides a dropdown list of suggestions based on the user's input. The component is built using React and Typescript and is designed to be used as a controlled component. The project is built to be reviewed as an assignment for the Deel Frontend Engineer role. For the sake of this assignment, we'll be using the TMDB API to fetch movie suggestions based on the user's input.

Features:

- 🔍 Autocomplete suggestions based on user input from the TMDB API
- 🎬 List of suggestions with movie poster, title, and release date
- 📝 Controlled component
- 📱 Responsive design
- 🎨 Customizable styles
- 📦 Built with React and Typescript
- 🚀 Optimized for performance
- 📚 Well-documented code
- 📝 Linted code using ESLint and Prettier

DEMO: [Deel Autocomplete](https://deel-autocomplete.vercel.app/)

### Built With

<div>
  <a href="https://reactjs.org/"/>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  </a>

  <a href="https://vitejs.dev/"/>
    <img src="https://img.shields.io/badge/Vite-20232A?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  </a>

  <a href="https://www.w3.org/html/"/>
    <img src="https://img.shields.io/badge/HTML-20232A?style=for-the-badge&logo=html5&logoColor=E34F26" alt="HTML" />
  </a>

  <a href="https://www.w3.org/Style/CSS/Overview.en.html"/>
    <img src="https://img.shields.io/badge/CSS-20232A?style=for-the-badge&logo=css3&logoColor=1572B6" alt="CSS" />
  </a>

  <a href="https://yarnpkg.com/"/>
    <img src="https://img.shields.io/badge/Yarn-20232A?style=for-the-badge&logo=yarn&logoColor=2C8EBB" alt="Yarn" />
  </a>

  <a href="https://react-query.tanstack.com/"/>
    <img src="https://img.shields.io/badge/React_Query-20232A?style=for-the-badge&logo=react-query&logoColor=FF4154" alt="React Query" />
  </a>

  <a href="https://eslint.org/"/>
    <img src="https://img.shields.io/badge/ESLint-20232A?style=for-the-badge&logo=eslint&logoColor=4B32C3" alt="ESLint" />
  </a>

  <a href="https://prettier.io/"/>
    <img src="https://img.shields.io/badge/Prettier-20232A?style=for-the-badge&logo=prettier&logoColor=F7B93E" alt="Prettier" />
  </a>

  <!-- Typescript -->
  <a href="https://www.typescriptlang.org/"/>
    <img src="https://img.shields.io/badge/TypeScript-20232A?style=for-the-badge&logo=typescript&logoColor=3178C6" alt="TypeScript" />
  </a>

  <!-- Commitlint -->
  <a href="https://commitlint.js.org/"/>
    <img src="https://img.shields.io/badge/Commitlint-20232A?style=for-the-badge&logo=commitlint&logoColor=white" alt="Commitlint" />
  </a>
</div>

## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

- Node.js
- Yarn

### Installation

1. Download the repository shared with you on email

2. Install NPM packages

   ```bash
   yarn install
   ```

3. Make sure the `.env` file that has been shared with you is available in the root directory with the following environment variables:

   ```bash
   API_KEY=YOUR_TMDB_API_KEY
   API_URL=https://api.themoviedb.org/3
   ```

## Usage

Run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

To run the deployment build:

```bash
yarn build
yarn preview
```

## Linting

I am using ESLint, Typescript and Prettier to lint the code. The code is linted on every commit using husky and lint-staged.

## Contributor

- [Shettayyy](https://github.com/shettayyy)

Made with ❤️ for Deel
