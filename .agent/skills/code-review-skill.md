---
name: Code Review & Safety
description: Guidelines for safely modifying existing code without breaking the application logic or causing React hook errors.
---

# Code Modification Rules

When updating or refactoring code in this project, you MUST follow these directives strictly:

1. **Preserve Existing Logic (Loki Mode)**:
   - When adding a new feature to an existing component, do NOT delete or fundamentally alter the functional logic of the existing code unless explicitly requested.
   - Inject your code cleanly alongside the existing code.

2. **React Strict Rules**:
   - NEVER put React hooks (`useState`, `useEffect`, `useSortable`, `useDroppable`) inside of conditional blocks, loops, or mapping functions directly. ALWAYS extract mapped items into a separate Sub-Component to call hooks at the top level of that component.
   - Watch out for Invalid Hook Call errors. If a component is getting too large, break it down rather than forcing hooks into weird places.

3. **Performance & Edge Cases**:
   - Anticipate null/undefined values. E.g., if rendering user data from a database, ensure you have fallback states or loading skeletons.
   - Ensure imports are valid and dependencies match the current `package.json`. Run `npx tsc --noEmit` locally after major changes if TypeScript is configured to verify no types are broken.
