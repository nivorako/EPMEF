import { createGlobalStyle, type DefaultTheme } from "styled-components";

const GlobalStyle = createGlobalStyle`
  :root {
    --background: ${({ theme }) => (theme as DefaultTheme).colors.background};
    --foreground: ${({ theme }) => (theme as DefaultTheme).colors.foreground};
    --muted: #666666;
    --border: #eaeaea;
    --card: #ffffff;
    --radius: 12px;
    --container: 1000px;
  }

  html,
  body {
    max-width: 100vw;
    overflow-x: hidden;
  }

  body {
    color: var(--foreground);
    background: var(--background);
    font-family: ${({ theme }) => (theme as DefaultTheme).fonts.body};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  .container {
    max-width: var(--container);
    margin: 0 auto;
    padding: 24px;
  }

  .site-header,
  .site-footer {
    border-color: var(--border);
    background: var(--background);
  }

  .site-header {
    border-bottom: 1px solid var(--border);
  }

  .site-footer {
    border-top: 1px solid var(--border);
  }

  .nav a {
    padding: 8px 10px;
    border-radius: 8px;
    display: inline-block;
  }

  .nav a:hover {
    background: rgba(0, 0, 0, 0.04);
  }

  .prose {
    line-height: 1.7;
    font-size: 16px;
  }

  .prose p {
    margin: 12px 0;
  }

  .prose h1,
  .prose h2,
  .prose h3 {
    line-height: 1.2;
    margin: 18px 0 10px;
  }

  .prose img {
    max-width: 100%;
    height: auto;
    border-radius: 10px;
  }

  .prose a {
    text-decoration: underline;
  }

  .muted {
    color: var(--muted);
  }

  @media (prefers-color-scheme: dark) {
    html {
      color-scheme: dark;
    }
  }
`;

export default GlobalStyle;
