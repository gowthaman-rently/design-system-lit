"use client";

import { useEffect } from "react";

/**
 * Registers the @design-system-poc/ui custom elements (<my-element>, ...) in
 * the browser.
 *
 * Lit components can't be defined during server rendering, so the package is
 * loaded after hydration. Server-rendered tags such as <my-element> are plain
 * HTML until then, and upgrade in place once the definitions load.
 */
export function RegisterDesignSystem() {
  useEffect(() => {
    void import("@design-system-poc/ui");
  }, []);

  return null;
}
