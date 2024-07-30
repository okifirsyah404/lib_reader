export type TagObject = {
  name: string;
  description: string;
};

export abstract class DocsTag {
  static readonly auth = 'Auth';
  static readonly author = 'Author';
  static readonly book = 'Book';

  private static readonly authTagObject = {
    name: DocsTag.auth,
    description: 'Endpoints that require authentication',
  } as TagObject;

  private static readonly authorTagObject = {
    name: DocsTag.author,
    description: 'Endpoints for authors',
  } as TagObject;

  private static readonly bookTagObject = {
    name: DocsTag.book,
    description: 'Endpoints for books',
  } as TagObject;

  static readonly tags = [
    DocsTag.authTagObject,
    DocsTag.authorTagObject,
    DocsTag.bookTagObject,
  ];
}
