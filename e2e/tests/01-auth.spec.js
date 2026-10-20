const { test, expect } = require('@playwright/test');
const { uniq, createUser } = require('./helpers');

test.describe('Autenticação', () => {
  test('rota protegida redireciona visitante para o login', async ({ page }) => {
    await page.goto('/rooms');
    await expect(page).toHaveURL(/\/login/);
  });

  test('cadastro pela interface leva o usuário às salas', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('cookieConsent', 'accepted'));
    await page.goto('/register');
    await page.getByPlaceholder('Nome de usuário').fill(`Aluno${uniq()}`);
    await page.getByPlaceholder('E-mail').fill(`aluno.${uniq()}@e2e.test`);
    await page.getByPlaceholder('Senha').fill('Senha@12345');
    for (const box of await page.locator('input[type="checkbox"]').all()) await box.check();
    await page.getByRole('button', { name: 'Cadastrar' }).click();
    await expect(page).toHaveURL(/\/rooms/);
  });

  test('login pela interface com usuário existente', async ({ page, request }) => {
    const u = await createUser(request, 'Login');
    await page.addInitScript(() => localStorage.setItem('cookieConsent', 'accepted'));
    await page.goto('/login');
    await page.getByPlaceholder('E-mail').fill(u.email);
    await page.getByPlaceholder('Senha').fill(u.password);
    await page.getByRole('button', { name: 'Continuar', exact: true }).click();
    await expect(page).toHaveURL(/\/rooms/);
  });

  test('login com senha errada mostra erro e permanece na tela', async ({ page, request }) => {
    const u = await createUser(request, 'Erro');
    await page.addInitScript(() => localStorage.setItem('cookieConsent', 'accepted'));
    await page.goto('/login');
    await page.getByPlaceholder('E-mail').fill(u.email);
    await page.getByPlaceholder('Senha').fill('SenhaErrada@1');
    await page.getByRole('button', { name: 'Continuar', exact: true }).click();
    await expect(page).toHaveURL(/\/login/);
  });
});
