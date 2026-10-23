const { test, expect } = require('@playwright/test');
const { API, createUser, loginViaStorage, authHeaders } = require('./helpers');

test.describe('Directs com criptografia ponta a ponta', () => {
  test('o servidor guarda o texto cifrado e o destinatário lê o texto original', async ({ browser, request }) => {
    const a = await createUser(request, 'Alice');
    const b = await createUser(request, 'Bruno');

    const ctxA = await browser.newContext();
    const ctxB = await browser.newContext();
    await loginViaStorage(ctxA, a);
    await loginViaStorage(ctxB, b);
    const pageA = await ctxA.newPage();
    const pageB = await ctxB.newPage();

    await pageB.goto('/directs');
    await pageA.goto('/directs');
    await expect.poll(async () => {
      const r = await request.get(`${API}/directs/keys/${b.user.id}`, { headers: authHeaders(a.token) });
      return (await r.json()).publicKey;
    }).not.toBeNull();
    await expect.poll(async () => {
      const r = await request.get(`${API}/directs/keys/${a.user.id}`, { headers: authHeaders(b.token) });
      return (await r.json()).publicKey;
    }).not.toBeNull();

    const conv = await (await request.post(`${API}/directs/conversations`, {
      headers: authHeaders(a.token), data: { targetUserId: b.user.id }
    })).json();

    await pageA.goto('/directs');
    await pageA.getByText('Bruno').first().click();
    const segredo = `segredo-${Date.now()}`;
    await pageA.getByPlaceholder(/Mensagem para/).fill(segredo);
    await pageA.locator('button[type="submit"][aria-label="Enviar mensagem"]').click();
    await expect(pageA.getByText(segredo)).toBeVisible();

    await expect.poll(async () => {
      const r = await request.get(`${API}/directs/conversations/${conv.id}/messages`, { headers: authHeaders(a.token) });
      return (await r.json()).messages.length;
    }).toBeGreaterThan(0);
    const stored = await (await request.get(`${API}/directs/conversations/${conv.id}/messages`, { headers: authHeaders(a.token) })).json();
    expect(JSON.stringify(stored)).not.toContain(segredo);

    await pageB.goto('/directs');
    await expect(pageB.getByText(segredo)).toBeVisible();

    await ctxA.close();
    await ctxB.close();
  });
});
