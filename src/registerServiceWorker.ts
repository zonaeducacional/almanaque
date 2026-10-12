/**
 * Registro robusto do Service Worker para suporte PWA offline.
 * Trata graciosamente ambientes restritos (iFrames, preview sandboxes com SecurityError).
 */

export function registerServiceWorker(): void {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  // Detecta se está dentro de iframe restrito de preview
  const isInIframe = window.self !== window.top;

  window.addEventListener('load', () => {
    try {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((registration) => {
          // Service worker registrado com sucesso
          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker) {
              installingWorker.onstatechange = () => {
                if (installingWorker.state === 'installed') {
                  if (navigator.serviceWorker.controller) {
                    // Novo conteúdo disponível; pronto para próximas visitas
                  }
                }
              };
            }
          };
        })
        .catch((error) => {
          // Em ambientes de iframe/sandboxed preview (como AI Studio ou CodeSandbox),
          // navegadores como Chromium podem bloquear Service Workers por política de segurança de frame.
          // Isso é esperado e o app opera normalmente com IndexedDB/localStorage offline.
          if (isInIframe) {
            // Silencioso em iframe para não poluir o console
          } else {
            console.info('[PWA] Service Worker não pôde ser ativado neste ambiente:', error.message || error);
          }
        });
    } catch {
      // Falha silenciosa caso o navegador proíba a chamada síncrona
    }
  });
}
