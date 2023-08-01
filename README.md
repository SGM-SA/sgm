# SGM

- [Description](#description)
- [Project structure](#project-structure)
- [Understanding the project](#understanding-the-project)
  - [API auto-generated client](#api-auto-generated-client)
- [Requirements](#requirements)
  - [Initialize the project](#initialize-the-project)
- [Usage](#usage)
  - [API](#api)
    - [Start the server in dev mode](#start-the-server-in-dev-mode)
    - [Start the server in production mode](#start-the-server-in-production-mode)
  - [Web](#web)
    - [Start in dev mode](#start-in-dev-mode)
    - [Build](#build)
    - [Serve the build](#serve-the-build)
  - [Storybook](#storybook)
    - [Start storybook locally](#start-storybook-locally)
  - [OpenApi](#openapi)
    - [Generate client](#generate-client)
- [Todo](#todo)

## Description

Monorepo for the SGM project.

## Project structure

``` bash
/
├── apps 
│   ├── api # Django API
│   └── web # React web app powered by vite
└── libs
    ├── components # React UI components library
    ├── theme # Centralized Chakra-UI theme for all components
    ├── storybook # Storybook for components
    └── openapi # OpenAPI schema for API and auto-generated client services and typescript models
```

## Understanding the project

### API auto-generated client

The API client is auto-generated from the OpenAPI schema using [openapi-typescript-codegen](https://github.com/ferdikoomen/openapi-typescript-codegen).
The codegen is run in 3 different situations :
- Each time a `.py` file is modified and saved in the `api` app source code.
- Each time the `web` app is build.
- On demand with the `nx run openapi:generate` command.

This ensures that the client is always up to date with the API.

The output of the codegen is located in `libs/openapi/src/generated` and the openapi specification is located in `libs/openapi/src/openapi.yaml`.

Concretly, the codegen generates :
- A `services` folder containing all the API client services, which are full typesafe functions that calls the different endpoints of the API (kind of like RPC).
- A `models` folder containing all the typescript models synced on the request input and response data output of the api controllers.

## Requirements

- [Node.js](https://nodejs.org/en/) (>=18)
- [PNPM](https://pnpm.io/) (>=8)
- [Python](https://www.python.org/) (3.9)
- [Poetry](https://python-poetry.org/)

### Initialize the project

1. Install Node dependencies
    ```bash
    pnpm install
    ```
2. Install `nx` globally
    ```bash
    pnpm install -g nx
    ```
3. Install Python dependencies for the API
    ```bash
    nx run api:install 
    ```
4. Run the API migrations
    ```bash
    nx run api:migrate
    ```

## Usage

### API

#### Start the server in dev mode
```bash
nx run api:dev
```

#### Start the server in production mode
```bash
nx run api:start
```

### Web

#### Start in dev mode
```bash
nx run web:dev
```

#### Build
```bash
nx run web:build
```

#### Serve the build
```bash
nx run web:preview
```

### Storybook

#### Start storybook locally
```bash
nx run storybook:start
```

### OpenApi

#### Generate client
```bash
nx run openapi:generate
```

## Todo

- [ ] Tester `generouted` (qui permet d'auto-gen les routes à partir du file system)
- [ ] Devops
    - [ ] Docker
    - [ ] Github actions
- [ ] Tester `xstate`
- [ ] Tester `@tanstack/query`
- [ ] Tester `@tanstack/table`
- [ ] Tester `react-hook-form`