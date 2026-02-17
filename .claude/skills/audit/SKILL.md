# Design System Audit

1. Read the design system file at `docs/system.md`
2. Scan all components in `src/components/` for:
   - Inline styles (should use Tailwind classes)
   - Raw CSS (should use cva variants)
   - Missing accessibility attributes
   - Inconsistencies with the design system tokens
3. Produce a report with file, line, issue, and suggested fix
4. Ask if I want you to auto-fix all findings