// Cyber Almanaque - Service Worker
// Cache offline para funcionamento total sem rede após a primeira visita.
// Sem telemetria, sem rastreamento, sem notificações intrusivas (filosofia anti-feed).

const CACHE_NAME = 'cyber-almanaque-v1';

// Recursos estáticos fundamentais para o shell offline
function getPrecacheAssets() {
  const scope = self.registration ? self.registration.scope : self.location.origin + '/';
  return [
    scope,
    new URL('index.html', scope).href,
    new URL('manifest.json', scope).href,
    new URL('icon.svg', scope).href,
    new URL('icon-192.png', scope).href,
    new URL('icon-512.png', scope).href,
    new URL('icon-maskable.png', scope).href,
    new URL('apple-touch-icon.png', scope).href,
    new URL('pacote-exemplo.json', scope).href,
  ];
}

// Instalação do Service Worker: guarda ativos essenciais em cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(getPrecacheAssets()).catch((err) => {
          // Em ambientes de desenvolvimento/preview alguns arquivos podem ser dinâmicos
          console.warn('[SW] Aviso ao pré-carregar alguns ativos:', err);
        });
      })
      .then(() => {
        // Ativa imediatamente a nova versão do Service Worker
        return self.skipWaiting();
      })
  );
});

// Ativação: limpa caches antigos de versões anteriores
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((name) => {
            if (name !== CACHE_NAME) {
              return caches.delete(name);
            }
            return null;
          })
        );
      })
      .then(() => {
        // Assume controle de todas as abas abertas imediatamente
        return self.clients.claim();
      })
  );
});

// Interceptação de requisições: estratégia Stale-While-Revalidate com fallback Offline
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Apenas intercepta requisições HTTP/HTTPS do método GET
  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);

  // Requisições para a própria origem ou CDN de fontes do Google
  const isSameOrigin = url.origin === self.location.origin;
  const isGoogleFonts = url.hostname.includes('fonts.googleapis.com') || url.hostname.includes('fonts.gstatic.com');

  if (!isSameOrigin && !isGoogleFonts) {
    return;
  }

  // Para navegação HTML de página: Network first com fallback para cache do index.html
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          }
          return networkResponse;
        })
        .catch(async () => {
          const scope = self.registration ? self.registration.scope : '/';
          const cached = await caches.match(request);
          if (cached) return cached;
          const fallback = (await caches.match(new URL('index.html', scope).href)) || (await caches.match(scope));
          if (fallback) return fallback;
          return new Response(
            '<!doctype html><html lang="pt-BR"><body style="font-family:serif;background:#F8F5EE;color:#242A24;padding:2rem;text-align:center;">' +
            '<h1>Cyber Almanaque</h1><p>Você está offline. O conteúdo salvo anteriormente no seu aparelho continua disponível.</p>' +
            `<p><a href="${scope}" style="color:#2E5E37;">Recarregar Almanaque</a></p></body></html>`,
            { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
          );
        })
    );
    return;
  }

  // Para outros ativos (JS, CSS, imagens, fontes, JSON): Cache First com fallback de rede
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Atualiza o cache em segundo plano (Stale-While-Revalidate)
        fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse));
            }
          })
          .catch(() => {
            // Offline - silencia erro de rede já que temos o cache
          });
        return cachedResponse;
      }

      // Se não está em cache, busca na rede e guarda para o futuro
      return fetch(request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === 'opaque' && !isGoogleFonts) {
            return networkResponse;
          }
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
          return networkResponse;
        })
        .catch(() => {
          // Se for imagem e falhar offline, pode retornar vazio seguro
          return new Response('', { status: 408, statusText: 'Offline' });
        });
    })
  );
});
