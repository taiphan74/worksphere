---
invokable: true
---

Review this code for potential issues, including:

- Type safety: Ensure proper TypeScript typing, avoid using `any` type unnecessarily, and properly handle nullable values
- Internationalization: Check that all user-facing strings are properly internationalized using next-intl
- Form validation: Verify proper Zod schema validation and React Hook Form integration
- API calls: Ensure proper error handling for API calls, especially with TanStack Query mutations/queries
- Feature-sliced design: Confirm components follow the established FSD architecture with proper separation of concerns
- Security: Validate authentication checks, prevent unauthorized access to protected routes/components
- Performance: Look for unnecessary re-renders, proper memoization of expensive computations
- Accessibility: Ensure proper ARIA attributes and semantic HTML usage
- State management: Verify proper usage of TanStack Query and Zustand stores
- Component structure: Check that components follow the established patterns in the codebase

Provide specific, actionable feedback for improvements.