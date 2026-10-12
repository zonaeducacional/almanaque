/**
 * Cálculos astronômicos em JavaScript puro (sem bibliotecas externas).
 * Padrão geográfico: Salvador, BA (Latitude: -12.9777°, Longitude: -38.5016°, Fuso UTC-3).
 */

import { MoonPhaseInfo, SolarInfo } from '../types/almanaque';

export const SALVADOR_COORDS = {
  nome: 'Salvador, BA',
  lat: -12.9777,
  lon: -38.5016,
  timezoneOffsetHours: -3, // UTC-3 sem horário de verão
};

/**
 * Converte graus para radianos
 */
function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Converte radianos para graus
 */
function radToDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

/**
 * Calcula o dia do ano (1 a 366)
 */
export function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime() + (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

/**
 * Calcula a fase da lua com base no mês sinódico e época de referência
 */
export function calculateMoonPhase(date: Date): MoonPhaseInfo {
  // Época de referência conhecida para Lua Nova: 11 de janeiro de 2024 às 11:57 UTC
  const epoch = new Date(Date.UTC(2024, 0, 11, 11, 57, 0)).getTime();
  const target = date.getTime();
  const synodicMonth = 29.53058867; // dias
  const dayMs = 1000 * 60 * 60 * 24;

  let daysSinceEpoch = (target - epoch) / dayMs;
  let phaseAge = daysSinceEpoch % synodicMonth;
  if (phaseAge < 0) {
    phaseAge += synodicMonth;
  }

  // Ângulo de fase (0 a 2*PI)
  const phaseAngle = (phaseAge / synodicMonth) * 2 * Math.PI;
  // Fração iluminada (0 a 1)
  const illuminationFraction = (1 - Math.cos(phaseAngle)) / 2;
  const iluminacaoPercent = Math.round(illuminationFraction * 100);

  let faseNome = 'Lua Nova';
  let iconeTipo: MoonPhaseInfo['iconeTipo'] = 'nova';
  let descricaoPoetica = 'Noite silenciosa sob a luz das estrelas.';

  if (phaseAge < 1.84 || phaseAge >= 27.68) {
    faseNome = 'Lua Nova';
    iconeTipo = 'nova';
    descricaoPoetica = 'Ciclo de renovação e plantio silencioso.';
  } else if (phaseAge < 5.53) {
    faseNome = 'Crescente Inicial';
    iconeTipo = 'crescente';
    descricaoPoetica = 'O tênue traço de prata se firma no céu poente.';
  } else if (phaseAge < 9.22) {
    faseNome = 'Quarto Crescente';
    iconeTipo = 'quarto_crescente';
    descricaoPoetica = 'Meia face acesa: o impulso da ação e da vitalidade.';
  } else if (phaseAge < 12.91) {
    faseNome = 'Gibosa Crescente';
    iconeTipo = 'gibosa_crescente';
    descricaoPoetica = 'Quase plena, iluminando as copas e os caminhos.';
  } else if (phaseAge < 16.61) {
    faseNome = 'Lua Cheia';
    iconeTipo = 'cheia';
    descricaoPoetica = 'A colheita e o ápice da luz noturna sobre a baía.';
  } else if (phaseAge < 20.30) {
    faseNome = 'Gibosa Minguante';
    iconeTipo = 'gibosa_minguante';
    descricaoPoetica = 'Tempo de partilha e contemplação do que amadureceu.';
  } else if (phaseAge < 23.99) {
    faseNome = 'Quarto Minguante';
    iconeTipo = 'quarto_minguante';
    descricaoPoetica = 'Balanço sereno: desapegar do supérfluo.';
  } else {
    faseNome = 'Minguante Final';
    iconeTipo = 'minguante';
    descricaoPoetica = 'O último suspiro de luz antes do descanso fértil.';
  }

  return {
    faseNome,
    iluminacaoPercent,
    idadeDias: Math.round(phaseAge * 10) / 10,
    iconeTipo,
    descricaoPoetica,
  };
}

/**
 * Formata minutos desde a meia-noite em formato "HH:MM"
 */
function minutesToTimeStr(totalMinutes: number): string {
  // Ajuste circular de 0 a 1440
  let norm = totalMinutes % 1440;
  if (norm < 0) norm += 1440;
  const h = Math.floor(norm / 60);
  const m = Math.floor(norm % 60);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/**
 * Calcula o horário do nascer e do pôr do sol usando o algoritmo solar padrão da NOAA
 * para Salvador, Bahia (ou coordenadas personalizadas).
 */
export function calculateSunTimes(
  date: Date,
  lat = SALVADOR_COORDS.lat,
  lon = SALVADOR_COORDS.lon,
  tzOffset = SALVADOR_COORDS.timezoneOffsetHours
): SolarInfo {
  const dayOfYear = getDayOfYear(date);
  const hour = 12; // cálculo no meio do dia
  const daysInYear = (date.getFullYear() % 4 === 0 && (date.getFullYear() % 100 !== 0 || date.getFullYear() % 400 === 0)) ? 366 : 365;

  // Ângulo fracionário do ano em radianos
  const gamma = ((2 * Math.PI) / daysInYear) * (dayOfYear - 1 + (hour - 12) / 24);

  // Equação do tempo (em minutos)
  const eqtime =
    229.18 *
    (0.000075 +
      0.001868 * Math.cos(gamma) -
      0.032077 * Math.sin(gamma) -
      0.014615 * Math.cos(2 * gamma) -
      0.040849 * Math.sin(2 * gamma));

  // Declinação solar (em radianos)
  const decl =
    0.006918 -
    0.399912 * Math.cos(gamma) +
    0.070257 * Math.sin(gamma) -
    0.006758 * Math.cos(2 * gamma) +
    0.000907 * Math.sin(2 * gamma) -
    0.002697 * Math.cos(3 * gamma) +
    0.00148 * Math.sin(3 * gamma);

  const latRad = degToRad(lat);
  // Ângulo zenital para nascer/pôr do sol: 90.833° (inclui refração e disco solar)
  const zenithRad = degToRad(90.833);

  // Ângulo horário (hour angle)
  const cosHa =
    (Math.cos(zenithRad) - Math.sin(latRad) * Math.sin(decl)) /
    (Math.cos(latRad) * Math.cos(decl));

  // Clampar para o caso extremo (não ocorre em Salvador, mas protege contra NaN)
  const clampedCosHa = Math.max(-1, Math.min(1, cosHa));
  const haRad = Math.acos(clampedCosHa);
  const haDeg = radToDeg(haRad);

  // Meio-dia solar em minutos UTC
  // Fórmula: 720 - 4 * longitude - eqtime
  const solarNoonUTC = 720 - 4 * lon - eqtime;

  // Nascer e pôr do sol em minutos UTC
  const sunriseUTC = solarNoonUTC - haDeg * 4;
  const sunsetUTC = solarNoonUTC + haDeg * 4;

  // Ajuste para o fuso horário local (ex: Salvador = UTC-3 -> -3 * 60 = -180 min)
  const tzMinutes = tzOffset * 60;
  const localSunrise = sunriseUTC + tzMinutes;
  const localSunset = sunsetUTC + tzMinutes;
  const localSolarNoon = solarNoonUTC + tzMinutes;

  // Duração do dia
  const durationMinutes = Math.round((haDeg * 8));
  const durH = Math.floor(durationMinutes / 60);
  const durM = durationMinutes % 60;

  return {
    nascerDoSol: minutesToTimeStr(localSunrise),
    porDoSol: minutesToTimeStr(localSunset),
    duracaoDia: `${durH}h ${durM}min`,
    cidade: SALVADOR_COORDS.nome,
    lat,
    lon,
    meioDiaSolar: minutesToTimeStr(localSolarNoon),
  };
}
