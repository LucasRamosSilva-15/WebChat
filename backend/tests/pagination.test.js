// Testes unitários do helper de paginação por cursor
const { parseHistoryParams, DEFAULT_LIMIT, MAX_LIMIT } = require('../src/utils/pagination');

describe('parseHistoryParams', () => {
  it('usa os padrões quando nada é informado', () => {
    expect(parseHistoryParams()).toEqual({ limit: DEFAULT_LIMIT, before: null, since: null });
    expect(parseHistoryParams({})).toEqual({ limit: 50, before: null, since: null });
  });

  it('converte limit vindo como string da query string', () => {
    expect(parseHistoryParams({ limit: '20' }).limit).toBe(20);
  });

  it('trava o limit entre 1 e 100', () => {
    expect(parseHistoryParams({ limit: 9999999 }).limit).toBe(MAX_LIMIT);
    expect(parseHistoryParams({ limit: -3 }).limit).toBe(1);
    expect(parseHistoryParams({ limit: 0 }).limit).toBe(DEFAULT_LIMIT);
    expect(parseHistoryParams({ limit: 'abc' }).limit).toBe(DEFAULT_LIMIT);
  });

  it('normaliza uma data válida para ISO e descarta data inválida', () => {
    expect(parseHistoryParams({ before: '2026-10-15T14:20:00Z' }).before).toBe('2026-10-15T14:20:00.000Z');
    expect(parseHistoryParams({ before: 'lixo' }).before).toBeNull();
    expect(parseHistoryParams({ before: '' }).before).toBeNull();
  });
});

describe('parseHistoryParams - since', () => {
  it('normaliza since válido e descarta inválido', () => {
    expect(parseHistoryParams({ since: '2026-10-15T14:20:00Z' }).since).toBe('2026-10-15T14:20:00.000Z');
    expect(parseHistoryParams({ since: 'lixo' }).since).toBeNull();
  });

  it('since tem precedência sobre before', () => {
    const r = parseHistoryParams({ since: '2026-01-01T00:00:00Z', before: '2026-02-01T00:00:00Z' });
    expect(r.since).toBe('2026-01-01T00:00:00.000Z');
    expect(r.before).toBeNull();
  });
});
