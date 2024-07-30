// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require(process.cwd() + '/package.json');

export type DocsConfig = {
  endpoint: string;
  title: string;
  description: string;
  version: string;
  contact?: {
    name?: string;
    url?: string;
    email?: string;
  };
  license?: {
    name?: string;
    url?: string;
  };
  customCss?: string[];
};

export const docsConfig: DocsConfig = {
  endpoint: 'docs',
  title: 'API Documentation',
  description: 'API Documentation',
  version: packageJson.version,
  contact: {
    name: packageJson.author,
    url: packageJson.contributors[0].url,
    email: packageJson.contributors[0].email,
  },
  customCss: process.env.DOCS_CUSTOM_CSS_URL?.split(',') || [],
} as const;
