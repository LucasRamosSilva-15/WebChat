const { test, expect } = require('@playwright/test');
const { API, createUser, loginViaStorage, createRoom, postMessage, authHeaders, joinIfPrompted } = require('./helpers');
const fs = require('fs');

test.describe('Histórico paginado', () => {
  test('API: before/since/limit paginam por cursor', async ({ request }) => {
    const u = await createUser(request, 'Api');
    const room = await createRoom(request, u.token, `Api ${Date.now()}`);
    for (let i = 1; i <= 7; i++) await postMessage(request, u.token, room.id, `m${i}`);

    const p1 = await (await request.get(`${API}/rooms/${room.id}/messages?limit=3`, { headers: authHeaders(u.token) })).json();
    expect(p1.messages.map((m) => m.content)).toEqual(['m5', 'm6', 'm7']);
    expect(p1.hasMore).toBe(true);

    const p2 = await (await request.get(`${API}/rooms/${room.id}/messages?limit=3&before=${encodeURIComponent(p1.nextCursor)}`, { headers: authHeaders(u.token) })).json();
    expect(p2.messages.map((m) => m.content)).toEqual(['m2', 'm3', 'm4']);
  });

  test('rolagem infinita carrega mensagens antigas e mostra o início do histórico', async ({ browser, request }) => {
    const u = await createUser(request, 'Scroll');
    const room = await createRoom(request, u.token, `Hist ${Date.now()}`);
    for (let i = 1; i <= 60; i++) await postMessage(request, u.token, room.id, `msg-${String(i).padStart(2, '0')}`);

    const ctx = await browser.newContext();
    await loginViaStorage(ctx, u);
    const page = await ctx.newPage();
    await page.goto(`/chat?room=${room.id}`);
    await joinIfPrompted(page);

    await expect(page.getByText('msg-60', { exact: true })).toBeVisible();
    await expect(page.getByText('msg-01', { exact: true })).toHaveCount(0); // só as 50 mais recentes

    const scroller = page.locator('.chat-container');
    // A rolagem suave inicial pode competir com o scroll programático: repete até carregar
    await expect.poll(async () => {
      await scroller.evaluate((el) => { el.scrollTop = 0; });
      return page.getByText('msg-01', { exact: true }).count();
    }, { timeout: 15000 }).toBeGreaterThan(0);
    await expect(page.getByText('msg-01', { exact: true })).toBeVisible();
    await expect(page.getByText(/Início do histórico da sala alcançado/)).toBeVisible();
    await expect(page.getByText('Hoje').first()).toBeVisible();
    await ctx.close();
  });

  test('exporta o histórico em .txt', async ({ browser, request }) => {
    const u = await createUser(request, 'Export');
    const room = await createRoom(request, u.token, `Exp ${Date.now()}`);
    await postMessage(request, u.token, room.id, 'conteudo-exportado');

    const ctx = await browser.newContext({ acceptDownloads: true });
    await loginViaStorage(ctx, u);
    const page = await ctx.newPage();
    await page.goto(`/chat?room=${room.id}`);
    await joinIfPrompted(page);
    await expect(page.getByText('conteudo-exportado')).toBeVisible();

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByTitle('Exportar histórico (.txt)').click()
    ]);
    expect(download.suggestedFilename()).toMatch(/\.txt$/);
    const text = fs.readFileSync(await download.path(), 'utf-8');
    expect(text).toContain('conteudo-exportado');
    await ctx.close();
  });
});
