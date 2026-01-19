# Scrollbar Aesthetics & UX (Optimal + Incrementally Extended Spec)
## Custom Next.js + Tailwind UI — SINGLE SOURCE OF TRUTH

---

## Context
This codebase uses fully custom UI components (no Radix / Headless UI / component libraries):
- Manual modal + backdrop handling
- Manual Escape key listener
- Manual body scroll lock (`document.body.style.overflow = 'hidden'`)
- Tailwind CSS for styling
- Raw React state for interactive patterns
- Dynamic Labs SDK provides its own wallet connection modal (MUST NOT be modified)

This spec must integrate cleanly with the above architecture.

---

## Goal
Deliver **premium, app-grade scrolling UX** with zero regressions:
- No ugly system scrollbars at rest
- Clear visual indication when content is scrollable
- Works with mouse, trackpad, touch, and keyboard
- No scroll chaining (modals must never scroll the page behind them)
- Fully scoped styling (no global scrollbar hacks)

---

## Non-Negotiable Rules
1. Do NOT disable scrolling anywhere.
2. Do NOT hide scrollbars globally on `body`, `html`, or `*`.
3. Do NOT apply scrollbar styles globally.
4. Scrollbar styling must be applied ONLY via explicit utility classes.
5. Existing body scroll locking logic MUST remain unchanged.
6. Do NOT modify or override the Dynamic Labs modal in any way.
7. Use native scrolling only (no JS scrolling libraries).

---

## Implementation Overview
You must implement the following, in order:
1. A scoped “premium scrollbar” CSS utility.
2. Scroll affordance fades (bottom required, top optional).
3. Correct scroll containment for custom modals.
4. Keyboard + accessibility support for scroll containers.
5. Apply changes ONLY to intended scroll containers.

NO refactors into external libraries.  
NO architectural rewrites.  
NO speculative behavior.

---

## 1) Global CSS Utilities (globals.css)

Add the following CSS to `globals.css` (or equivalent).  
This is the ONLY global CSS change allowed.

```css
/* Premium Scrollbar (Scoped) */

.scrollbar-premium {
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
}

.scrollbar-premium::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.scrollbar-premium::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-premium::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0);
  border-radius: 999px;
  border: 2px solid transparent;
  background-clip: content-box;
}

.scrollbar-premium:hover::-webkit-scrollbar-thumb,
.scrollbar-premium:focus-within::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.22);
}

.scrollbar-premium:hover,
.scrollbar-premium:focus-within {
  scrollbar-color: rgba(255, 255, 255, 0.22) transparent;
}

.scrollbar-premium:active::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.30);
}

/* Scroll Affordance Fades */

.scroll-fade-bottom {
  pointer-events: none;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 40px;
  background: linear-gradient(to top, rgba(0,0,0,0.60), rgba(0,0,0,0));
}

.scroll-fade-top {
  pointer-events: none;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 32px;
  background: linear-gradient(to bottom, rgba(0,0,0,0.45), rgba(0,0,0,0));
}
```

---

## 2) Scroll Container Usage Rules

Any element intended to scroll MUST include:
- `overflow-y-auto`
- `scrollbar-premium`
- `overscroll-contain`

Example:
```tsx
<div className="overflow-y-auto scrollbar-premium overscroll-contain">
  {/* scrollable content */}
</div>
```

---

## 3) Modal-Specific Scroll Behavior

Applies to all custom modals (e.g. NFTDetailModal).

- Header: fixed / non-scrolling
- Footer: fixed / non-scrolling
- Content: ONLY scrollable area

Required constraints:
- Parent flex child uses `min-h-0`
- Scroll container uses `tabIndex={0}`

Example structure:
```tsx
<div className="flex flex-col h-full">
  <Header />
  <div className="flex-1 min-h-0 relative">
    <div className="h-full overflow-y-auto scrollbar-premium overscroll-contain" tabIndex={0}>
      {/* modal content */}
    </div>
    <div className="scroll-fade-bottom" />
  </div>
  <Footer />
</div>
```

---

## 4) Accessibility & Keyboard Support
- Keyboard scrolling must work when focused
- Arrow keys, Page Up / Page Down, Space
- Close button always reachable
- Focus outlines preserved or replaced accessibly

---

## 5) Where to Apply / Where NOT

Apply to:
- NFTDetailModal content
- Custom drawers / panels
- Long lists

Do NOT apply to:
- body / html
- global layout wrappers
- Dynamic Labs modal
- non-scroll elements

---

## Acceptance Criteria
- No global scrollbar hiding
- Scrollbars hidden at rest, visible on hover/focus
- Modal scroll isolated from page
- Bottom fade indicates overflow
- Keyboard scrolling works
- No regressions

---

END OF SPEC — THIS FILE IS INTENTIONALLY ATOMIC.
IMPLEMENT EXACTLY AS WRITTEN.
