---
name: Frontend Design Mastery
description: Strict guidelines for implementing UI/UX features, maintaining the premium glassmorphism dark theme.
---

# Frontend Design Rules

When implementing frontend components in this project, you MUST adhere to the following rules:

1. **Aesthetic Constraints**: 
   - ALWAYS maintain the dark theme. The background should be `#050505` or similar pitch-black tones.
   - Use Glassmorphism heavily: leverage `bg-white/5` or `bg-white/10` combined with `backdrop-blur-md` or `backdrop-blur-xl` and `border border-white/10`.
   - Never use solid, flat generic colors like default HTML blue or red. Use tailored gradients or low-opacity tinted backgrounds.

2. **Typography**:
   - Use modern, high-contrast typography. Subtitles and tags should be `uppercase tracking-widest text-[10px]` or `text-xs` with reduced opacity (`text-white/40`).
   - Use `font-display` for major headings to maintain the cinematic feel.

3. **Micro-Interactions**:
   - Every button must have a hover state (e.g., `hover:bg-white/10`, `hover:text-white`).
   - Use `Framer Motion` for any structural DOM changes. Elements entering the screen must fade in and scale up slightly (`initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}`).

4. **Tailwind CSS Rules**:
   - Do not write custom CSS in `index.css` unless completely unavoidable (e.g., hiding scrollbars). Rely entirely on Tailwind utility classes.
