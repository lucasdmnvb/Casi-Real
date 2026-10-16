/// <reference path="../.astro/types.d.ts" />

declare module 'astro/runtime/server' {
  export class HTMLString {
    constructor(html: string);
  }
  export function renderTemplate(
    strings: TemplateStringsArray,
    ...values: unknown[]
  ): { html: string; toString(): string };
}