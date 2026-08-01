# Gritty Streets Scene

This folder adds a small React + TypeScript scene (canvas-based) and placeholder SVG assets that evoke gritty streets and back-alley fights.

Files added

- src/components/GrittyStreetsScene.tsx
- src/components/GrittyStreetsScene.css
- src/assets/backgrounds/gritty-street.svg
- src/assets/sprites/fighter-left.svg
- src/assets/sprites/fighter-right.svg
- src/types/svg.d.ts
- package.json
- tsconfig.json

Quick setup

1. Install dependencies:

   npm install

2. Start dev server:

   npm run dev

3. Import and use the component in your app (e.g., in `src/main.tsx`):

```tsx
import React from 'react'
import { createRoot } from 'react-dom/client'
import GrittyStreetsScene from './components/GrittyStreetsScene'

createRoot(document.getElementById('root')!).render(<GrittyStreetsScene />)
```

Notes

- SVGs are imported as strings (default Vite behavior). The canvas code creates Image objects from the SVG URLs.
- If your project already has a package.json/tsconfig, merge the scripts and configs as needed.
