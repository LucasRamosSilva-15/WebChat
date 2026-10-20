const { test, expect } = require('@playwright/test');
const { createUser, loginViaStorage, createRoom, postMessage, joinIfPrompted } = require('./helpers');

test.describe('Sala de chat', () => {
  test('envia mensagem e outro usuário a recebe em tempo real', async ({ browser, request }) => {
    const a = await createUser(request, 'Ana');
    const b = await createUser(request, 'Beto');
    const room = await createRoom(request, a.token, `Sala ${Date.now()}`);

    const ctxA = await browser.newContext();
    const ctxB = await browser.newContext();
    await loginViaStorage(ctxA, a);
    await loginViaStorage(ctxB, b);
    const pageA = await ctxA.newPage();
    const pageB = await ctxB.newPage();

    await pageA.goto(`/chat?room=${room.id}`);
    await joinIfPrompted(pageA);
    await pageB.goto(`/chat?room=${room.id}`);
    await joinIfPrompted(pageB);

    const texto = `Olá do E2E ${Date.now()}`;
    await pageA.getByPlaceholder('Digite uma mensagem...').fill(texto);
    await pageA.locator('button[type="submit"][title="Enviar Mensagem"]').click();

    await expect(pageA.getByText(texto)).toBeVisible();
    await expect(pageB.getByText(texto)).toBeVisible();
    await ctxA.close();
    await ctxB.close();
  });

  test('mensagens salvas aparecem ao recarregar a página', async ({ browser, request }) => {
    const a = await createUser(request, 'Carla');
    const room = await createRoom(request, a.token, `Persist ${Date.now()}`);
    await postMessage(request, a.token, room.id, 'mensagem persistida');

    const ctx = await browser.newContext();
    await loginViaStorage(ctx, a);
    const page = await ctx.newPage();
    await page.goto(`/chat?room=${room.id}`);
    await joinIfPrompted(page);
    await expect(page.getByText('mensagem persistida')).toBeVisible();
    await page.reload();
    await joinIfPrompted(page);
    await expect(page.getByText('mensagem persistida')).toBeVisible();
    await ctx.close();
  });
});
