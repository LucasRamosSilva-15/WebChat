import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mockIPC, clearMocks } from '@tauri-apps/api/mocks';
import { invoke } from '@tauri-apps/api/core';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const tauriConfPath = path.resolve(__dirname, '../src-tauri/tauri.conf.json');
const capabilityPath = path.resolve(__dirname, '../src-tauri/capabilities/default.json');

describe('Tauri v2 configuration and security schema', () => {
  const config = JSON.parse(fs.readFileSync(tauriConfPath, 'utf8'));
  const capability = JSON.parse(fs.readFileSync(capabilityPath, 'utf8'));

  test('defines product metadata and frontend build paths', () => {
    expect(config.productName).toBe('SkyRipple');
    expect(config.identifier).toBe('com.skyripple.desktop');
    expect(config.build.frontendDist).toBe('../../frontend/dist');
    expect(config.build.devUrl).toBe('http://localhost:5173');
    expect(config.build.beforeDevCommand).toContain('frontend');
    expect(config.build.beforeBuildCommand).toContain('frontend');
  });

  test('enforces main window dimensions and title', () => {
    expect(Array.isArray(config.app.windows)).toBe(true);
    expect(config.app.windows.length).toBeGreaterThanOrEqual(1);
    const mainWindow = config.app.windows[0];
    expect(mainWindow.title).toBe('SkyRipple');
    expect(mainWindow.width).toBe(1240);
    expect(mainWindow.height).toBe(800);
    expect(mainWindow.minWidth).toBe(900);
    expect(mainWindow.minHeight).toBe(600);
    expect(mainWindow.resizable).toBe(true);
  });

  test('configures restrictive CSP and default window capability', () => {
    const csp = config.app?.security?.csp;
    expect(typeof csp).toBe('string');
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("script-src 'self'");
    expect(csp).toContain('https:');
    expect(csp).toContain('wss:');
    expect(capability.identifier).toBe('default');
    expect(capability.windows).toContain('main');
    expect(capability.permissions).toContain('core:default');
  });

  test('declares required bundle icons', () => {
    expect(Array.isArray(config.bundle.icon)).toBe(true);
    expect(config.bundle.icon).toEqual(
      expect.arrayContaining([
        'icons/32x32.png',
        'icons/128x128.png',
        'icons/128x128@2x.png',
        'icons/icon.icns',
        'icons/icon.ico'
      ])
    );
  });
});

describe('Tauri API mocks integration', () => {
  beforeAll(() => {
    if (typeof globalThis.window === 'undefined') {
      globalThis.window = globalThis;
    }
  });

  afterEach(() => {
    clearMocks();
  });

  test('mocks invoke calls cleanly via @tauri-apps/api/mocks', async () => {
    mockIPC((cmd, args) => {
      if (cmd === 'ping_skyripple') {
        return { ok: true, echo: args?.message ?? '' };
      }
      return null;
    });

    const result = await invoke('ping_skyripple', { message: 'desktop-ready' });
    expect(result).toEqual({ ok: true, echo: 'desktop-ready' });
  });
});
