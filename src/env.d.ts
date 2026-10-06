declare namespace App {
  interface Locals {
    /** Idioma de la interfaz (selector o navegador), elegido en src/middleware.ts. */
    lang: import('./i18n').Lang;
    /** Idioma de los metadatos (SEO, Open Graph), según el dominio. */
    seoLang: import('./i18n').Lang;
  }
}
