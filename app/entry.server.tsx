import type {EntryContext, AppLoadContext} from '@shopify/remix-oxygen';
import {RemixServer} from '@remix-run/react';
import isbot from 'isbot';
import {renderToReadableStream} from 'react-dom/server';
import {createContentSecurityPolicy} from '@shopify/hydrogen';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  context: AppLoadContext,
) {
  const {nonce, header, NonceProvider} = createContentSecurityPolicy({
    defaultSrc: [
      "'self'",
      'cdn.shopify.com',
      'shopify.com',
    ],
    connectSrc: [
      "'self'",
      'https://cdn.shopify.com',
    ],
    scriptSrc: [
      "'self'",
      'https://cdn.shopify.com',
      'https://cdn.pbbl.co',
      'https://andreyshepelev.github.io',
    ],
    frameSrc: [
      "'self'",
      'https://cdn.pbbl.co',
      'https://andreyshepelev.github.io',
    ],
    imgSrc: [
      "'self'",
      'cdn.shopify.com',
      'shopify.com',
      'https://px0.pbbl.co',
      'https://aa.agkn.com',
    ],
    objectSrc: "'none'",
    childSrc: "'self'",
    fontSrc: [
      'fonts.googleapis.com',
      'fonts.gstatic.com',
    ],
    formAction: "'none'",
    manifestSrc: [
      "'self'",
      'cdn.shopify.com',
      'shopify.com',
    ],
    mediaSrc: "'none'",

    shop: {
      checkoutDomain: context.env.PUBLIC_CHECKOUT_DOMAIN,
      storeDomain: context.env.PUBLIC_STORE_DOMAIN,
    }
  });

  const body = await renderToReadableStream(
    <NonceProvider>
      <RemixServer context={remixContext} url={request.url} />
    </NonceProvider>,
    {
      nonce,
      signal: request.signal,
      onError(error) {
        // eslint-disable-next-line no-console
        console.error(error);
        responseStatusCode = 500;
      },
    },
  );

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');
  responseHeaders.set('Content-Security-Policy', header);

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
