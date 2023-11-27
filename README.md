# SGM

- [Description](#description)
- [Project structure](#project-structure)
- [Understanding the project](#understanding-the-project)
  - [API auto-generated client](#api-auto-generated-client)
  - [CLI commands](#cli-commands)
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
    ├── ui # Common UI components, hooks and utils
    ├── theme # Centralized Chakra-UI theme for all components
    ├── storybook # Storybook for components
    └── openapi # OpenAPI schema for API and auto-generated client services and typescript models
```

## Understanding the project

### API auto-generated client

The front-end http client is auto-generated from the API OpenAPI schema using [openapi-codegen](https://github.com/fabien0102/openapi-codegen).
The codegen is run in 3 different situations :
- Each time a `.py` file is modified and saved in the `api` app source code.
- Each time the `web` app is build.
- On demand with the `nx run openapi:generate` command.

This ensures that the client is always up to date with the API.

The output of the codegen is located in `libs/openapi/src/generated` and the openapi specification is located in `libs/openapi/src/openapi.yaml`.


Concretly, the codegen generates :
- `apiSchemas.ts`: all the typescript models synced on the request input and response data output of the api controllers.
- `apiComponents.ts`: `@tanstack/query` (previously `react-query`) hooks for each API endpoint their associated fetch functions for classic async/await calls.
- `apiFetcher.ts`: the `fetcher` function used by `@tanstack/query` to make the actual http calls, which is completely customizable and won't be overwritten by the codegen.

### CLI commands

In addition to classic `nx` generators commands, the project have additionnal commands to help with development by generating different type of files:
- `pnpm g:web`: Generate files for `apps/web`. It can generate following types of files dynamically:
    - `component`: Generate a component.
    - `page`: Generate a page.
- `pnpm g:ui`: Generate files for `libs/ui`. It can generate following types of files dynamically:
    - `component`: Generate a component with a storybook story.

## Requirements

- [Node.js](https://nodejs.org/en/) (>=18)
- [PNPM](https://pnpm.io/) (>=8)
- [Python](https://www.python.org/) (3.9)
- [Pango](https://pango.gnome.org/)
    ```bash
    sudo apt-get install libpangocairo-1.0-0
    ```
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

- [ ] Devops
    - [ ] Staging env