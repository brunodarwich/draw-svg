/**
 * DrawSVG Studio - Local Telemetry & Analytics Engine
 * Registra eventos reais de uso no navegador (IndexedDB / localStorage) em conformidade com PRD Seção 5.
 */

const STORAGE_KEY = 'drawsvg_local_analytics_v1';

/**
 * Recupera o estado atual dos eventos locais.
 */
export function getLocalMetrics() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }

  return {
    events_count: 0,
    strokes_drawn: 0,
    svg_copies: 0,
    artworks_saved: 0,
    exports_count: 0,
    last_event_at: null,
    recent_events: [],
  };
}

/**
 * Dispara e armazena um evento de telemetria local.
 * 
 * @param {string} eventName - Nome do evento catalogado no PRD.
 * @param {object} properties - Propriedades do evento.
 */
export function trackEvent(eventName, properties = {}) {
  const metrics = getLocalMetrics();
  const eventRecord = {
    name: eventName,
    properties,
    timestamp: Date.now(),
    iso: new Date().toISOString(),
  };

  metrics.events_count += 1;
  metrics.last_event_at = eventRecord.iso;

  if (eventName === 'stroke_completed') metrics.strokes_drawn += 1;
  if (eventName === 'svg_copied_clipboard') metrics.svg_copies += 1;
  if (eventName === 'artwork_saved_gallery') metrics.artworks_saved += 1;
  if (eventName === 'artwork_exported') metrics.exports_count += 1;

  metrics.recent_events.unshift(eventRecord);
  if (metrics.recent_events.length > 50) {
    metrics.recent_events.pop();
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(metrics));
    window.dispatchEvent(new CustomEvent('drawsvg:telemetry', { detail: eventRecord }));
  } catch {
    // quota exceeded or private mode
  }

  return eventRecord;
}
