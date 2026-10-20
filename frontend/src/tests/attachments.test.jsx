import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import AttachmentView from '../components/AttachmentView';
import AttachmentComposer from '../components/AttachmentComposer';
import {
  formatFileSize,
  formatDuration,
  documentFileToAttachment,
  audioBlobToAttachment,
  normalizeAttachment,
  MAX_ATTACHMENT_BYTES
} from '../utils/attachments';

describe('utils/attachments', () => {
  it('formata tamanho e duração', () => {
    expect(formatFileSize(512)).toBe('512 B');
    expect(formatFileSize(2048)).toBe('2 KB');
    expect(formatFileSize(5 * 1024 * 1024)).toBe('5 MB');
    expect(formatDuration(65)).toBe('01:05');
  });

  it('converte um PDF em anexo com data URL', async () => {
    const file = new File(['%PDF-1.4 teste'], 'trabalho.pdf', { type: 'application/pdf' });
    const att = await documentFileToAttachment(file);
    expect(att.type).toBe('application/pdf');
    expect(att.name).toBe('trabalho.pdf');
    expect(att.url.startsWith('data:application/pdf;base64,')).toBe(true);
  });

  it('resolve o tipo pela extensão quando o navegador não informa', async () => {
    const file = new File(['a,b'], 'dados.csv', { type: '' });
    const att = await documentFileToAttachment(file);
    expect(att.type).toBe('text/csv');
    expect(att.url.startsWith('data:text/csv;base64,')).toBe(true);
  });

  it('rejeita tipo não suportado e arquivo grande', async () => {
    await expect(documentFileToAttachment(new File(['x'], 'virus.exe', { type: 'application/x-msdownload' }))).rejects.toThrow(/não suportado/);
    const big = new File([new Uint8Array(MAX_ATTACHMENT_BYTES + 1)], 'grande.pdf', { type: 'application/pdf' });
    await expect(documentFileToAttachment(big)).rejects.toThrow(/5 MB/);
  });

  it('converte o áudio gravado e tira os codecs do tipo', async () => {
    const blob = new Blob([new Uint8Array(10)], { type: 'audio/webm;codecs=opus' });
    const att = await audioBlobToAttachment(blob);
    expect(att.type).toBe('audio/webm');
    expect(att.url.startsWith('data:audio/webm;base64,')).toBe(true);
    expect(att.name).toMatch(/^audio-.*\.webm$/);
  });

  it('normalizeAttachment aceita view-model dos directs e colunas das salas', () => {
    expect(normalizeAttachment(null)).toBeNull();
    expect(normalizeAttachment({ attachment: { url: 'u', kind: 'audio' } })).toEqual({ url: 'u', kind: 'audio' });
    expect(normalizeAttachment({ attachment_url: 'u', attachment_type: 'audio/webm', attachment_name: 'n', attachment_size: 3 }))
      .toEqual({ url: 'u', type: 'audio/webm', name: 'n', size: 3, kind: 'audio' });
    expect(normalizeAttachment({ attachment_url: 'u', attachment_type: 'application/pdf' }).kind).toBe('document');
  });
});

describe('AttachmentView', () => {
  it('não renderiza sem anexo', () => {
    const { container } = render(<AttachmentView attachment={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renderiza player para áudio', () => {
    render(<AttachmentView attachment={{ url: 'data:audio/webm;base64,AAAA', type: 'audio/webm', kind: 'audio' }} />);
    expect(screen.getByTestId('attachment-audio').querySelector('audio')).toBeInTheDocument();
  });

  it('renderiza cartão de download para documentos', () => {
    render(<AttachmentView attachment={{ url: 'data:application/pdf;base64,AAAA', type: 'application/pdf', name: 'relatorio.pdf', size: 2048 }} />);
    const link = screen.getByTestId('attachment-document');
    expect(link).toHaveAttribute('download', 'relatorio.pdf');
    expect(screen.getByText('relatorio.pdf')).toBeInTheDocument();
    expect(screen.getByText('2 KB')).toBeInTheDocument();
  });
});

describe('AttachmentComposer', () => {
  const originalMR = window.MediaRecorder;
  const originalMD = navigator.mediaDevices;

  afterEach(() => {
    window.MediaRecorder = originalMR;
    Object.defineProperty(navigator, 'mediaDevices', { value: originalMD, configurable: true });
  });

  it('anexa um documento válido', async () => {
    const onChange = vi.fn();
    render(<AttachmentComposer value={null} onChange={onChange} />);
    const file = new File(['conteudo'], 'notas.txt', { type: 'text/plain' });
    fireEvent.change(screen.getByTestId('document-input'), { target: { files: [file] } });
    await waitFor(() => expect(onChange).toHaveBeenCalled());
    expect(onChange.mock.calls[0][0]).toMatchObject({ type: 'text/plain', name: 'notas.txt' });
  });

  it('mostra erro para tipo inválido', async () => {
    const onChange = vi.fn();
    render(<AttachmentComposer value={null} onChange={onChange} />);
    const file = new File(['x'], 'a.exe', { type: 'application/x-msdownload' });
    fireEvent.change(screen.getByTestId('document-input'), { target: { files: [file] } });
    expect(await screen.findByRole('alert')).toHaveTextContent(/não suportado/);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('permite remover o anexo pendente', () => {
    const onChange = vi.fn();
    render(<AttachmentComposer value={{ url: 'data:application/pdf;base64,AAAA', type: 'application/pdf', name: 'a.pdf', size: 3 }} onChange={onChange} />);
    fireEvent.click(screen.getByLabelText('Remover anexo'));
    expect(onChange).toHaveBeenCalledWith(null);
  });

  it('avisa quando o navegador não suporta gravação', async () => {
    delete window.MediaRecorder;
    render(<AttachmentComposer value={null} onChange={vi.fn()} />);
    fireEvent.click(screen.getByLabelText('Gravar áudio'));
    expect(await screen.findByRole('alert')).toHaveTextContent(/não suporta gravação/);
  });

  it('grava, para e devolve o áudio como anexo', async () => {
    const stopTrack = vi.fn();
    Object.defineProperty(navigator, 'mediaDevices', {
      configurable: true,
      value: { getUserMedia: vi.fn().mockResolvedValue({ getTracks: () => [{ stop: stopTrack }] }) }
    });

    class FakeRecorder {
      constructor() { this.state = 'inactive'; this.mimeType = 'audio/webm;codecs=opus'; }
      start() { this.state = 'recording'; }
      stop() {
        this.state = 'inactive';
        this.ondataavailable?.({ data: new Blob([new Uint8Array(20)], { type: this.mimeType }) });
        this.onstop?.();
      }
    }
    window.MediaRecorder = FakeRecorder;

    const onChange = vi.fn();
    render(<AttachmentComposer value={null} onChange={onChange} />);

    fireEvent.click(screen.getByLabelText('Gravar áudio'));
    expect(await screen.findByText(/Gravando 00:00/)).toBeInTheDocument();

    await act(async () => { fireEvent.click(screen.getByLabelText('Parar gravação')); });
    await waitFor(() => expect(onChange).toHaveBeenCalled());
    expect(onChange.mock.calls[0][0]).toMatchObject({ type: 'audio/webm', size: 20 });
    expect(stopTrack).toHaveBeenCalled();
  });

  it('cancelar a gravação não gera anexo', async () => {
    Object.defineProperty(navigator, 'mediaDevices', {
      configurable: true,
      value: { getUserMedia: vi.fn().mockResolvedValue({ getTracks: () => [{ stop: vi.fn() }] }) }
    });
    class FakeRecorder {
      constructor() { this.state = 'inactive'; this.mimeType = 'audio/webm'; }
      start() { this.state = 'recording'; }
      stop() { this.state = 'inactive'; this.ondataavailable?.({ data: new Blob([new Uint8Array(5)]) }); this.onstop?.(); }
    }
    window.MediaRecorder = FakeRecorder;

    const onChange = vi.fn();
    render(<AttachmentComposer value={null} onChange={onChange} />);
    fireEvent.click(screen.getByLabelText('Gravar áudio'));
    await screen.findByText(/Gravando/);
    await act(async () => { fireEvent.click(screen.getByLabelText('Cancelar gravação')); });
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.queryByText(/Gravando/)).not.toBeInTheDocument();
  });
});
