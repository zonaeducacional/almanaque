import React, { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const PwaInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('cyber_pwa_dismissed') === 'true';
    } catch {
      return false;
    }
  });
  const [isInstalled, setIsInstalled] = useState<boolean>(false);

  useEffect(() => {
    // Detecta se já está rodando em modo standalone (PWA instalado)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as any).standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    const handler = (e: Event) => {
      // Impede o mini-infobar padrão do Chromium
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
      }
    } catch {
      // Ignora erro
    } finally {
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      localStorage.setItem('cyber_pwa_dismissed', 'true');
    } catch {
      // Ignora erro de storage
    }
  };

  if (isInstalled || isDismissed || !deferredPrompt) {
    return null;
  }

  return (
    <aside
      aria-label="Instalação do Cyber Almanaque"
      className="w-full max-w-2xl mx-auto px-4 pt-3"
    >
      <div className="bg-[#EBF3ED] dark:bg-[#18291D] border border-[#C6DCB9] dark:border-[#2B4B32] rounded-2xl p-3.5 sm:p-4 flex items-center justify-between gap-3 shadow-sm animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2E5E37] flex items-center justify-center text-white text-lg shrink-0 shadow-sm">
            🌱
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-serif font-bold text-[#1E3022] dark:text-[#EAE5D9]">
              Instalar o Cyber Almanaque no aparelho
            </h2>
            <p className="text-[11px] sm:text-xs text-[#5B6D58] dark:text-[#9FB19E] font-sans">
              Leia sem internet, com abertura rápida e sem distrações.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleDismiss}
            type="button"
            className="touch-target text-xs text-[#7A8A77] dark:text-[#8D9F8A] hover:text-[#242A24] dark:hover:text-white px-2 py-1 rounded-lg"
            title="Ignorar por enquanto"
            aria-label="Ignorar instalação"
          >
            Depois
          </button>
          <button
            onClick={handleInstallClick}
            type="button"
            className="touch-target px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold bg-[#2E5E37] text-white hover:bg-[#234C2C] shadow-sm transition-all cursor-pointer"
          >
            Instalar
          </button>
        </div>
      </div>
    </aside>
  );
};
