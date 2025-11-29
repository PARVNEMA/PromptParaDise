# Agent Guidelines for PromptParaDise/server

This document outlines the conventions and commands for agentic coding in this repository.

## 1. Build/Lint/Test Commands

*   **Start Development Server**: `npm run dev`
*   **Start Production Server**: `npm start`
*   **Linting**: No explicit linting script found. Adhere to the existing code style.
*   **Testing**: No explicit testing script found.

## 2. Code Style Guidelines

*   **Imports**: Use ES6 `import ... from "..."` syntax. Relative paths for local modules.
*   **Formatting**:
    *   Semicolons at the end of statements.
    *   Indentation: Use tabs (or 4 spaces, consistent with existing files).
    *   Curly braces for blocks on new lines.
*   **Naming Conventions**:
    *   Functions/Variables: `camelCase` (e.g., `createPrompt`, `imageUrl`).
    *   Mongoose Schemas: `PascalCase` with `Schema` suffix (e.g., `PromptSchema`).
    *   Mongoose Models: `PascalCase` (e.g., `Prompt`).
*   **Error Handling**: Utilize `catchAsync` middleware and throw `ApiError` for structured error responses.
*   **Asynchronous Operations**: Use `async/await` for asynchronous code.
*   **Response Handling**: Use the `sendResponse` utility function for consistent API responses.
*   **Comments**: Use `//` for single-line comments.

## 3. Cursor/Copilot Rules

No specific Cursor or Copilot rules files were found in the repository.
