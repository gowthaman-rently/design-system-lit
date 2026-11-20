// Generates custom-elements.json from the JSDoc in src/ (@slot, @fires, @csspart, ...).
// Used by Storybook's docs, and by editors for autocompletion of <ds-*> tags.
export default {
  globs: ['src/**/*.ts'],
  exclude: ['src/react/**'],
  litelement: true,
  plugins: [
    {
      // Document only the public API: drop static, private and protected members
      // (e.g. `styles`, `shadowRootOptions`, `internals`).
      name: 'public-api-only',
      packageLinkPhase({ customElementsManifest }) {
        for (const module of customElementsManifest.modules) {
          for (const declaration of module.declarations ?? []) {
            declaration.members = declaration.members?.filter(
              (member) => !member.static && member.privacy !== 'private' && member.privacy !== 'protected',
            )
          }
        }
      },
    },
  ],
}
