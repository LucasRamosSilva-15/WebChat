
export function getAppTimeZone() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (!tz || tz === 'UTC' || tz === 'Etc/UTC' || tz.startsWith('Etc/GMT')) {
      return 'America/Sao_Paulo';
    }
    return tz;
  } catch {
    return 'America/Sao_Paulo';
  }
}

export function parseDateSafe(val) {
  if (!val) return null;
  if (val instanceof Date) {
    return isNaN(val.getTime()) ? null : val;
  }
  if (typeof val === 'number') {
    const d = new Date(val);
    return isNaN(d.getTime()) ? null : d;
  }
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (!trimmed) return null;

    if (/^\d{1,2}:\d{2}(:\d{2})?(\s*(AM|PM))?$/i.test(trimmed)) {
      return null;
    }

    if (/^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}/.test(trimmed)) {
      const d = new Date(trimmed.replace(' ', 'T') + 'Z');
      if (!isNaN(d.getTime())) return d;
    }

    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?$/.test(trimmed)) {
      const d = new Date(trimmed + 'Z');
      if (!isNaN(d.getTime())) return d;
    }

    const d = new Date(trimmed);
    if (!isNaN(d.getTime())) return d;
  }
  return null;
}

export function parseUtcTimeStr(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') return null;
  const trimmed = timeStr.trim();

  const match12 = trimmed.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)$/i);
  if (match12) {
    let hours = parseInt(match12[1], 10);
    const minutes = parseInt(match12[2], 10);
    const seconds = match12[3] ? parseInt(match12[3], 10) : 0;
    const meridiem = match12[4].toUpperCase();
    if (meridiem === 'PM' && hours < 12) hours += 12;
    if (meridiem === 'AM' && hours === 12) hours = 0;

    const now = new Date();
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), hours, minutes, seconds));
  }

  return null;
}

export function formatTimeInTz(date, tz = getAppTimeZone()) {
  if (!date) return '';
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: tz
  });
}

export function getDatePartsInTz(date, tz = getAppTimeZone()) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  return formatter.format(date);
}

export function getMessageDateKey(msgOrDate) {
  if (!msgOrDate) return 'Hoje';
  const candidate =
    typeof msgOrDate === 'object' && !(msgOrDate instanceof Date)
      ? msgOrDate.created_at || msgOrDate.timestamp || msgOrDate.time
      : msgOrDate;

  if (!candidate) return 'Hoje';
  let d = parseDateSafe(candidate);
  if (!d) {
    d = parseUtcTimeStr(candidate);
  }
  if (!d) return 'Hoje';

  const tz = getAppTimeZone();
  const dateStr = getDatePartsInTz(d, tz);
  const now = new Date();
  const todayStr = getDatePartsInTz(now, tz);

  if (dateStr === todayStr) return 'Hoje';

  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const yesterdayStr = getDatePartsInTz(yesterday, tz);
  if (dateStr === yesterdayStr) return 'Ontem';

  const dYear = parseInt(dateStr.split('-')[0], 10);
  const nowYear = parseInt(todayStr.split('-')[0], 10);

  if (dYear === nowYear) {
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', timeZone: tz });
  }
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric', timeZone: tz });
}

export const formatMessageDateDivider = getMessageDateKey;

export function formatMessageTime(timeStr, createdAt) {
  const candidate = createdAt || timeStr;
  const d = parseDateSafe(candidate);
  if (d) {
    return formatTimeInTz(d);
  }

  const utcD = parseUtcTimeStr(timeStr);
  if (utcD) {
    return formatTimeInTz(utcD);
  }

  if (typeof timeStr === 'string' && timeStr.trim()) {
    const trimmed = timeStr.trim();

    const match24 = trimmed.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
    if (match24) {
      return `${match24[1].padStart(2, '0')}:${match24[2]}`;
    }

    if (trimmed === 'Agora') return 'Agora';
    return trimmed;
  }

  return formatTimeInTz(new Date());
}

export function formatFullDateTime(timeStr, createdAt) {
  const candidate = createdAt || timeStr;
  if (!candidate) return '';
  let d = parseDateSafe(candidate);
  if (!d) {
    d = parseUtcTimeStr(timeStr);
  }
  if (d) {
    const tz = getAppTimeZone();
    return (
      d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: tz }) +
      ' às ' +
      formatTimeInTz(d, tz)
    );
  }
  return timeStr || '';
}

export function formatConversationTime(timeStr) {
  if (!timeStr) return '';
  if (timeStr === 'Agora' || timeStr === 'Hoje' || timeStr === 'Ontem') return timeStr;

  let d = parseDateSafe(timeStr);
  if (!d) {
    d = parseUtcTimeStr(timeStr);
  }

  if (!d) {
    if (typeof timeStr === 'string' && /^\d{1,2}:\d{2}$/.test(timeStr.trim())) {
      return timeStr.trim();
    }
    return timeStr;
  }

  const tz = getAppTimeZone();
  const dateStr = getDatePartsInTz(d, tz);
  const now = new Date();
  const todayStr = getDatePartsInTz(now, tz);

  if (dateStr === todayStr) {
    return formatTimeInTz(d, tz);
  }

  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const yesterdayStr = getDatePartsInTz(yesterday, tz);
  if (dateStr === yesterdayStr) {
    return 'Ontem';
  }

  const dYear = parseInt(dateStr.split('-')[0], 10);
  const nowYear = parseInt(todayStr.split('-')[0], 10);

  if (dYear === nowYear) {
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', timeZone: tz });
  }
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit', timeZone: tz });
}

export function isDifferentCalendarDay(dateA, dateB) {
  if (!dateA || !dateB) return true;
  return getMessageDateKey(dateA) !== getMessageDateKey(dateB);
}

export function formatMessageTimeWithDate(dateInput, rawFallbackTime = '') {
  return formatMessageTime(rawFallbackTime, dateInput);
}
