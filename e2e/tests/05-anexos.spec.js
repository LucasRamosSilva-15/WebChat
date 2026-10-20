const { test, expect } = require('@playwright/test');
const path = require('path');
const { createUser, loginViaStorage, createRoom, joinIfPrompted } = require('./helpers');

test.describe('Anexos', () => {
  test('envia um documento PDF e mostra o link de download', async ({ browser, request }) => {
    const u = await createUser(request, 'Doc');
    const room = await createRoom(request, u.token, `Docs ${Date.now()}`);
    const ctx = await browser.newContext();
    await loginViaStorage(ctx, u);
    const page = await ctx.newPage();
    await page.goto(`/chat?room=${room.id}`);
    await joinIfPrompted(page);

    await page.getByTestId('document-input').setInputFiles(path.join(__dirname, '..', 'fixtures', 'relatorio.pdf'));
    await page.locator('button[type="submit"][title="Enviar Mensagem"]').click();
    await expect(page.getByTitle('Baixar relatorio.pdf')).toBeVisible();
    await ctx.close();
  });

  test('grava áudio com microfone falso e exibe o player', async ({ browser, request }) => {
    const u = await createUser(request, 'Voz');
    const room = await createRoom(request, u.token, `Voz ${Date.now()}`);
    const ctx = await browser.newContext({ permissions: ['microphone'] });
    await loginViaStorage(ctx, u);
    const page = await ctx.newPage();
    await page.goto(`/chat?room=${room.id}`);
    await joinIfPrompted(page);

    await page.getByLabel('Gravar áudio').click();
    await page.waitForTimeout(1200);
    await page.getByLabel('Parar gravação').click();
    await page.locator('button[type="submit"][title="Enviar Mensagem"]').click();
    await expect(page.getByLabel('Mensagem de voz')).toBeVisible();
    await ctx.close();
  });
});
