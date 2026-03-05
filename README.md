# Digital Std Exam Desktop

Birlashtirilgan TSUL imtihon ilovasi va anti-cheat (ExamCore Guard) — bitta Electron desktop ilovasi.

## Texnologiyalar

- **Electron** — desktop .exe
- **React 18 + TypeScript** — imtihon UI (exam_tsul)
- **Vite** — renderer build
- **Redux Toolkit, Ant Design, i18next** — state, UI, tarjimalar
- **@vladmandic/face-api** — yuz tekshiruvi
- **electron-builder** — Windows NSIS installer

## Ishga tushirish (development)

1. Renderer dev server:
   ```bash
   npm run dev
   ```
2. Yana bir terminalda Electron:
   ```bash
   $env:ELECTRON_DEV="1"; npm run start
   ```
   yoki (bash):
   ```bash
   ELECTRON_DEV=1 npm run start
   ```

## Build (.exe)

```bash
npm run build
```

Natija: `release/Digital Std Exam Setup 1.0.0.exe` (NSIS installer) va `release/win-unpacked/` (unpacked .exe).

## Proctoring (Electron)

- Imtihon sahifasida (exam_question yuklanganida) `window.electron.startProctoring()` chaqiriladi (test rejimida yoki `launchToken` bilan).
- Imtihon tugaganda yoki sahifadan chiqilganda `window.electron.stopProctoring()` chaqiriladi.
- Backend: `EXAMCORE_API_URL` (default: `http://localhost:8000/api/v1`) — handshake/event/heartbeat.

## API

- **Imtihon API:** `https://api-digital.tsul.uz` (renderer `config/_axios` da sozlangan).
- **Proctoring API:** `EXAMCORE_API_URL` (ixtiyoriy, test rejimida backend kerak emas).
