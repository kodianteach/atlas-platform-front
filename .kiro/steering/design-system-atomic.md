# UI Architecture: Atomic Design

From now on, organize and build the UI following Atomic Design (Atoms, Molecules, Organisms, Templates, Pages).

## Required Structure
- src/app/ui/atoms/
- src/app/ui/molecules/
- src/app/ui/organisms/
- src/app/ui/templates/
- src/app/pages/

## Rules
1) Atoms: highly reusable components with no business logic (buttons, inputs, icons).
2) Molecules: small combinations of atoms (e.g., form field with label + input + error).
3) Organisms: full sections of the UI (header, sidebar, complex forms).
4) Templates: page layout/structure (composition and placement), no direct data access.
5) Pages: orchestrate data (services/store), routing, and compose templates/organisms.

## Conventions
- Keep components as “presentational” as possible (Inputs/Outputs).
- Data logic (HTTP/store) lives in Pages (or in services/domain layers), not in Atoms/Molecules.
- When creating a new component, place it according to its level (atom/molecule/organism/template/page).

## When Proposing Changes
- Specify the exact folder where each new component should go.
- If a screen grows, refactor into molecules/organisms to preserve the hierarchy.
