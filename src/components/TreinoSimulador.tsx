import React, { useState } from 'react';
import { TreinoMensagem } from '../types/secoes';

interface TreinoSimuladorProps {
  questoes: TreinoMensagem[];
  onFinish?: () => void;
}

export const TreinoSimulador: React.FC<TreinoSimuladorProps> = ({ questoes }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<'golpe' | 'confiavel' | null>(null);
  const [score, setScore] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [userAnswersHistory, setUserAnswersHistory] = useState<
    { questaoId: number; userChoice: 'golpe' | 'confiavel'; isCorrect: boolean }[]
  >([]);

  const currentQ = questoes[currentIndex];

  const handleChoose = (choice: 'golpe' | 'confiavel') => {
    if (selectedAnswer !== null) return; // já respondeu

    setSelectedAnswer(choice);
    const isCorrect = choice === currentQ.tipoCorreto;
    if (isCorrect) {
      setScore((s) => s + 1);
    }

    setUserAnswersHistory((prev) => [
      ...prev,
      { questaoId: currentQ.id, userChoice: choice, isCorrect },
    ]);
  };

  const handleNext = () => {
    if (currentIndex < questoes.length - 1) {
      setCurrentIndex((idx) => idx + 1);
      setSelectedAnswer(null);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setIsFinished(false);
    setUserAnswersHistory([]);
  };

  // Tela final do simulador
  if (isFinished) {
    return (
      <div className="bg-[#FFFFFF] border border-[#E5DECD] rounded-2xl p-6 sm:p-8 text-center shadow-sm">
        <div className="w-16 h-16 rounded-full bg-[#EBF5ED] border border-[#CDE5D2] text-[#256334] mx-auto flex items-center justify-center text-2xl mb-4">
          🌱
        </div>

        <span className="text-xs uppercase tracking-wider font-mono font-semibold text-[#37693F] block mb-1">
          Treino Concluído
        </span>

        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E3022] tracking-tight">
          Você acertou {score} de {questoes.length}.
        </h3>

        <p className="mt-2 text-base text-[#566854] max-w-md mx-auto">
          Veja o que observar da próxima vez:
        </p>

        {/* Recomendações acolhedoras e sem punição */}
        <div className="mt-6 text-left bg-[#FAF7F0] border border-[#EBE1CF] rounded-xl p-5 sm:p-6 space-y-3.5">
          <div className="flex items-start gap-3">
            <span className="text-[#3B7247] font-bold text-lg leading-none">1.</span>
            <p className="text-sm text-[#44382C] leading-relaxed">
              <strong className="text-[#251D14]">A pressa é o gatilho da armadilha:</strong> mensagens legítimas nunca exigem dinheiro ou cliques urgentes com ameaça de cancelamento imediato.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-[#3B7247] font-bold text-lg leading-none">2.</span>
            <p className="text-sm text-[#44382C] leading-relaxed">
              <strong className="text-[#251D14]">Links encurtados ou estranhos (.xyz, .net):</strong> acesse sempre por conta própria abrindo o aplicativo oficial ou digitando o endereço na barra do navegador.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-[#3B7247] font-bold text-lg leading-none">3.</span>
            <p className="text-sm text-[#44382C] leading-relaxed">
              <strong className="text-[#251D14]">Ligue para ouvir a voz:</strong> quando um parente disser que mudou de número pedindo PIX, faça uma ligação de voz no número antigo antes de enviar qualquer centavo.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={handleRestart}
            type="button"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#2E5E37] hover:bg-[#254C2D] text-white font-medium text-sm transition-all cursor-pointer"
          >
            <span>↺ Repetir treino de mensagens</span>
          </button>
        </div>
      </div>
    );
  }

  const isAnswered = selectedAnswer !== null;
  const isCorrect = selectedAnswer === currentQ.tipoCorreto;

  return (
    <div className="bg-[#FFFFFF] border border-[#E5DECD] rounded-2xl p-5 sm:p-7 shadow-sm">
      {/* Indicador de progresso */}
      <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-[#F0EAE0]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#B87D38]" />
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#735A3A]">
            Treino de Percepção • Mensagem {currentIndex + 1} de {questoes.length}
          </span>
        </div>
        <span className="text-xs font-mono text-[#788876] bg-[#F7F4EC] px-2.5 py-0.5 rounded-full">
          Canal: {currentQ.canal}
        </span>
      </div>

      {/* Caixa simulando a mensagem recebida no aparelho */}
      <div className="my-3 bg-[#FAF8F2] border border-[#E8DFC9] rounded-2xl p-4 sm:p-5 relative shadow-inner">
        {/* Cabeçalho do Remetente */}
        <div className="flex items-center gap-2.5 mb-3 pb-2.5 border-b border-[#EDE5D3]">
          <div className="w-9 h-9 rounded-full bg-[#E5DBC7] text-[#5A4833] flex items-center justify-center font-bold text-sm">
            {currentQ.canal === 'WhatsApp' ? '💬' : currentQ.canal === 'SMS' ? '📩' : '📞'}
          </div>
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#8A7965] block">
              Remetente exibido
            </span>
            <span className="font-semibold text-sm sm:text-base text-[#2E2419]">
              {currentQ.remetente}
            </span>
          </div>
        </div>

        {/* Balão do texto */}
        <div className="bg-[#FFFFFF] border border-[#E3D9C4] rounded-xl p-4 text-[#282017] font-sans text-sm sm:text-base leading-relaxed shadow-sm">
          <p>{currentQ.mensagem}</p>
        </div>
      </div>

      {/* Ações de Escolha do Usuário */}
      {!isAnswered ? (
        <div className="mt-6 pt-2">
          <p className="text-center text-xs font-mono uppercase tracking-wider text-[#687865] mb-3">
            O que você avalia sobre esta mensagem?
          </p>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <button
              onClick={() => handleChoose('golpe')}
              type="button"
              className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-[#FAF1ED] hover:bg-[#F7E5DE] active:scale-95 border-2 border-[#E7C1B2] text-[#8F3521] font-semibold text-sm sm:text-base transition-all cursor-pointer"
            >
              <span>🚨</span>
              <span>É Golpe</span>
            </button>
            <button
              onClick={() => handleChoose('confiavel')}
              type="button"
              className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-[#F0F7F2] hover:bg-[#E3F2E7] active:scale-95 border-2 border-[#B9E0C4] text-[#226333] font-semibold text-sm sm:text-base transition-all cursor-pointer"
            >
              <span>🛡️</span>
              <span>É Confiável</span>
            </button>
          </div>
        </div>
      ) : (
        /* Explicação após a escolha */
        <div className="mt-5 pt-3 animate-fadeIn">
          <div
            className={`p-4 sm:p-5 rounded-xl border ${
              isCorrect
                ? 'bg-[#EBF5ED] border-[#C3E4C9] text-[#20572C]'
                : 'bg-[#FCF4EC] border-[#F2D7BF] text-[#7C481A]'
            }`}
          >
            <div className="flex items-center gap-2 mb-2 font-bold text-sm sm:text-base">
              <span>{isCorrect ? '✓ Muito bem!' : '💡 Olhar atento:'}</span>
              <span>
                Esta mensagem é{' '}
                <strong className="underline uppercase tracking-wide">
                  {currentQ.tipoCorreto === 'golpe' ? 'um golpe' : 'legítima e confiável'}
                </strong>
                .
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#3E3529] leading-relaxed mt-1">
              {currentQ.motivo}
            </p>

            {currentQ.sinaisDeAlerta && currentQ.sinaisDeAlerta.length > 0 && (
              <div className="mt-3 pt-2.5 border-t border-black/10">
                <span className="text-xs font-mono font-bold block mb-1.5 opacity-80">
                  Pontos a reparar:
                </span>
                <ul className="text-xs space-y-1 list-disc list-inside text-[#3E3529]">
                  {currentQ.sinaisDeAlerta.map((sinal, i) => (
                    <li key={i}>{sinal}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={handleNext}
              type="button"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2E5E37] hover:bg-[#254C2D] text-white font-medium text-sm transition-all cursor-pointer"
            >
              <span>
                {currentIndex < questoes.length - 1
                  ? 'Próxima mensagem →'
                  : 'Ver resultado final →'}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
