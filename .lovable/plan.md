# Light and dark theme toggle

## What will change
- Add a sun/moon icon button beside the language selector with an accessible label and tooltip.
- Use the saved theme when available; otherwise follow the device’s light/dark preference.
- Persist manual theme choices in local storage and apply a `dark` class to the root document element.
- Update the existing semantic dark palette to dark navy/charcoal surfaces, off-white text, teal accents, and contrast-safe red/amber/green states.
- Keep the current light appearance intact and let existing cards, controls, chat bubbles, and results inherit theme tokens.

## Technical details
- Initialize the theme after hydration to avoid server/client mismatch, then synchronize the root class and `color-scheme`.
- Use Lucide `Sun` and `Moon` icons in the existing header control.
- Verify the check screen and every available practice state at desktop and 360px widths in both themes, including contrast and console errors.
