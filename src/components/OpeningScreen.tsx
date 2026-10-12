import React, { useEffect, useRef, useState } from 'react';

interface OpeningScreenProps {
  onEnter: () => void;
  desativarDissolucao?: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  decay: number;
}

export const OpeningScreen: React.FC<OpeningScreenProps> = ({
  onEnter,
  desativarDissolucao = false,
}) => {
  const [isDissolving, setIsDissolving] = useState(false);
  const textRef = useRef<HTMLHeadingElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameId = useRef<number | null>(null);

  // Verifica preferência de redução de movimento do usuário
  const checkReducedMotion = () => {
    return (
      desativarDissolucao ||
      (typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    );
  };

  const handleStart = () => {
    if (isDissolving) return;

    if (checkReducedMotion()) {
      // Respeita prefers-reduced-motion ou configuração de desativação: transição imediata
      onEnter();
      return;
    }

    startDissolve();
  };

  const startDissolve = () => {
    setIsDissolving(true);
    const canvas = canvasRef.current;
    const textEl = textRef.current;

    if (!canvas || !textEl) {
      onEnter();
      return;
    }

    const rect = textEl.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      onEnter();
      return;
    }

    ctx.scale(dpr, dpr);

    // Renderiza o texto no canvas temporário para extrair os pixels
    const offscreen = document.createElement('canvas');
    offscreen.width = window.innerWidth;
    offscreen.height = window.innerHeight;
    const offCtx = offscreen.getContext('2d');

    if (!offCtx) {
      onEnter();
      return;
    }

    // Estilo correspondente ao texto exibido
    const computedStyle = window.getComputedStyle(textEl);
    offCtx.fillStyle = '#E8E5DD';
    offCtx.font = `${computedStyle.fontStyle} ${computedStyle.fontWeight} ${computedStyle.fontSize} ${computedStyle.fontFamily}`;
    offCtx.textAlign = 'center';
    offCtx.textBaseline = 'middle';

    const textX = rect.left + rect.width / 2;
    const textY = rect.top + rect.height / 2;

    // Quebra o texto em linhas para desenhar fielmente
    const textToDraw = 'Tudo que é sólido desmancha no ar.';
    offCtx.fillText(textToDraw, textX, textY);

    const imgData = offCtx.getImageData(
      Math.max(0, Math.floor(rect.left - 20)),
      Math.max(0, Math.floor(rect.top - 20)),
      Math.min(window.innerWidth, Math.ceil(rect.width + 40)),
      Math.min(window.innerHeight, Math.ceil(rect.height + 40))
    );

    const particles: Particle[] = [];
    const step = 4; // Amostragem para suavidade e performance
    const palette = ['#EAE4D7', '#D1C8B4', '#D4A373', '#A9B89E', '#E9C46A'];

    const startX = Math.max(0, Math.floor(rect.left - 20));
    const startY = Math.max(0, Math.floor(rect.top - 20));

    for (let y = 0; y < imgData.height; y += step) {
      for (let x = 0; x < imgData.width; x += step) {
        const index = (y * imgData.width + x) * 4;
        const alpha = imgData.data[index + 3];

        if (alpha > 80) {
          const posX = startX + x;
          const posY = startY + y;
          const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.4; // Sobe em leque
          const speed = 0.8 + Math.random() * 2.8;

          particles.push({
            x: posX,
            y: posY,
            vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 0.5,
            vy: Math.sin(angle) * speed - (0.5 + Math.random() * 1.2),
            size: 1.2 + Math.random() * 2.2,
            alpha: 1,
            color: palette[Math.floor(Math.random() * palette.length)],
            decay: 0.012 + Math.random() * 0.016,
          });
        }
      }
    }

    // Se houver poucos pixels capturados (ex: fonte não renderizada no canvas), cria partículas no retângulo
    if (particles.length === 0) {
      for (let i = 0; i < 400; i++) {
        particles.push({
          x: rect.left + Math.random() * rect.width,
          y: rect.top + Math.random() * rect.height,
          vx: (Math.random() - 0.5) * 2,
          vy: -1.5 - Math.random() * 2,
          size: 1.5 + Math.random() * 2,
          alpha: 1,
          color: palette[Math.floor(Math.random() * palette.length)],
          decay: 0.015 + Math.random() * 0.02,
        });
      }
    }

    // Animação de dissolução das partículas
    let aliveCount = particles.length;
    const animate = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      aliveCount = 0;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (p.alpha > 0.01) {
          aliveCount++;
          p.x += p.vx;
          p.y += p.vy;
          // Leve resistência do ar e vento lateral
          p.vx += (Math.random() - 0.5) * 0.06;
          p.vy -= 0.015; // flutuabilidade suave para cima
          p.alpha -= p.decay;

          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (aliveCount > 10) {
        animFrameId.current = requestAnimationFrame(animate);
      } else {
        onEnter();
      }
    };

    animFrameId.current = requestAnimationFrame(animate);

    // Fallback de segurança para nunca travar
    setTimeout(() => {
      onEnter();
    }, 1800);
  };

  useEffect(() => {
    return () => {
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-[#111812] text-[#F0EBE0] flex flex-col items-center justify-between p-6 sm:p-12 overflow-hidden selection:bg-[#D4A373] selection:text-[#111812]">
      {/* Canvas para partículas da dissolução */}
      <canvas
        ref={canvasRef}
        className={`pointer-events-none absolute inset-0 z-30 transition-opacity duration-300 ${
          isDissolving ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Marca / Identidade no topo */}
      <header className="w-full max-w-2xl pt-4 sm:pt-8 flex items-center justify-between z-10">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#D4A373] animate-pulse" />
          <span className="text-xs uppercase tracking-[0.25em] text-[#A6B29D] font-mono font-medium">
            Cyber Almanaque
          </span>
        </div>
        <span className="text-xs text-[#8A9682] font-mono">
          Edição Século XXI
        </span>
      </header>

      {/* Conteúdo Central: O lema em destaque */}
      <main className="w-full max-w-3xl my-auto py-12 flex flex-col items-center text-center z-10">
        <div className="mb-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1A261C] border border-[#2B3E2F] text-[#C4D1BD] text-xs font-mono">
          <svg className="w-3.5 h-3.5 text-[#D4A373]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
          <span>Princípio Solarpunk • Anti-feed</span>
        </div>

        {/* Lema central */}
        <h1
          ref={textRef}
          className={`font-serif text-3xl sm:text-5xl md:text-6xl font-normal tracking-tight leading-[1.25] max-w-2xl px-2 transition-opacity duration-200 ${
            isDissolving ? 'opacity-0' : 'opacity-100'
          }`}
        >
          Tudo que é sólido desmancha no ar.
        </h1>

        <p className={`mt-6 text-base sm:text-lg text-[#9AA793] max-w-lg font-sans leading-relaxed transition-opacity duration-300 ${
          isDissolving ? 'opacity-0' : 'opacity-100'
        }`}>
          Uma página finita por dia. Sem rolagem sem fim, sem algoritmos predatórios, sem notificações. Sabedoria para ler e voltar a viver.
        </p>

        {/* Botão de Entrar */}
        <div className="mt-10 sm:mt-12">
          <button
            onClick={handleStart}
            disabled={isDissolving}
            type="button"
            className={`group relative inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-[#D4A373] hover:bg-[#E0B589] active:scale-95 text-[#141C15] font-semibold text-base sm:text-lg shadow-lg shadow-[#D4A373]/10 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#D4A373] focus:ring-offset-2 focus:ring-offset-[#111812] ${
              isDissolving ? 'opacity-40 scale-95 pointer-events-none' : ''
            }`}
          >
            <span>{isDissolving ? 'Desmanchando...' : 'Entrar no Almanaque'}</span>
            <svg
              className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </main>

      {/* Rodapé da tela de abertura */}
      <footer className="w-full max-w-2xl pb-4 sm:pb-6 text-center text-xs text-[#6F7B68] font-mono z-10 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-[#1C281F] pt-4">
        <span>Humano • Otimista • Finito</span>
        <span className="text-[#8A9682]">
          Cálculos solares para Salvador, BA
        </span>
      </footer>
    </div>
  );
};
