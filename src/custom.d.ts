// custom.d.ts

/** This declaration file tells TypeScript how to handle importing SVG files. */

declare module '*.svg' {
  import * as React from 'react'

  /** Exporting a React component type for SVGs. */
  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement>
  >

  /** Exporting the SVG's file path as the default export. */
  const src: string
  export default src
}
