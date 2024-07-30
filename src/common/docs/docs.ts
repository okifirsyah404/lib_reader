import { docsConfig } from '@/config/docs.config';
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DocsTag } from './docs-tag';

export default async function swaggerDocumentBuilder(
  app: INestApplication<any>,
) {
  const documentBuilder = new DocumentBuilder()
    .setTitle(docsConfig.title)
    .setDescription(docsConfig.description)
    .setVersion(docsConfig.version)
    .addBearerAuth()
    .setContact(
      docsConfig.contact?.name || '',
      docsConfig.contact?.url || 'https://example.com',
      docsConfig.contact?.email || '',
    )
    .build();

  documentBuilder.tags = DocsTag.tags;

  const document = SwaggerModule.createDocument(app, documentBuilder);

  SwaggerModule.setup(docsConfig.endpoint, app, document, {
    customSiteTitle: docsConfig.title,
    customCssUrl: docsConfig.customCss,
  });
}
