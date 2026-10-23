/**
 * Utilitários para formatação de datas, divisores de calendário e carimbo de data/hora completo
 * Alinhado estritamente com as convenções e implementação do frontend Web.
 */

export function getMessageDateKey(msgOrDate) {
  if (!msgOrDate) return 'Hoje';
  const candidate =
    typeof msgOrDate === 'object' && !(msgOrDate instanceof Date)
      ? msgOrDate.created_at || msgOrDate.timestamp || msgOrDate.time
      : msgOrDate;

  if (!candidate) return 'Hoje';
  const d = new Date(candidate);
  if (isNaN(d.getTime())) {
    return 'Hoje';
  }

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const isToday =
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear();

  if (isToday) return 'Hoje';

  const isYesterday =
    d.getDate() === yesterday.getDate() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getFullYear() === yesterday.getFullYear();

  if (isYesterday) return 'Ontem';

  const isSameYear = d.getFullYear() === today.getFullYear();
  if (isSameYear) {
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });
  }
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
}

export const formatMessageDateDivider = getMessageDateKey;

export function formatMessageTime(timeStr, createdAt) {
  const candidate = createdAt || timeStr;
  if (!candidate) {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  if (typeof candidate === 'string' && candidate.includes('T')) {
    const d = new Date(candidate);
    if (!isNaN(d.getTime())) {
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  }

  if (typeof timeStr === 'string' && timeStr.length <= 8 && timeStr.includes(':')) {
    const parts = timeStr.split(':');
    if (parts.length >= 2) {
      return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
    }
    return timeStr;
  }

  const d = new Date(candidate);
  if (!isNaN(d.getTime())) {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  return timeStr || '';
}

export function formatFullDateTime(timeStr, createdAt) {
  const candidate = createdAt || timeStr;
  if (!candidate) return '';
  const d = new Date(candidate);
  if (!isNaN(d.getTime())) {
    return (
      d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
      ' às ' +
      d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    );
  }
  return timeStr || '';
}

export function formatConversationTime(timeStr) {
  if (!timeStr) return '';
  if (timeStr === 'Agora' || timeStr === 'Hoje' || timeStr === 'Ontem') return timeStr;
  if (typeof timeStr === 'string' && timeStr.length <= 5 && timeStr.includes(':')) return timeStr;

  const d = new Date(timeStr);
  if (isNaN(d.getTime())) return timeStr;

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const isToday =
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear();

  if (isToday) {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  const isYesterday =
    d.getDate() === yesterday.getDate() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getFullYear() === yesterday.getFullYear();

  if (isYesterday) {
    return 'Ontem';
  }

  const isSameYear = d.getFullYear() === today.getFullYear();
  if (isSameYear) {
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  }
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
}

export function isDifferentCalendarDay(dateA, dateB) {
  if (!dateA || !dateB) return true;
  return getMessageDateKey(dateA) !== getMessageDateKey(dateB);
}

export function formatMessageTimeWithDate(dateInput, rawFallbackTime = '') {
  return formatMessageTime(rawFallbackTime, dateInput);
}
