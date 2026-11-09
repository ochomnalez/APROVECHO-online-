# Scripts del video

- `capturar-pantallas-base.js` y `capturar-pantallas-smart.js` (Playwright): recorren el prototipo de la app (servirlo con `python3 -m http.server 8765` desde la raíz del repo de la app) y sacan las capturas. **Borran del DOM antes de cada captura el texto de comisión (25%, 75%)**, por la decisión D-031.
- `voz-gemini-tts.py`: genera voz con Gemini TTS (`gemini-3.8-flash-tts`, voces en español argentino de la biblioteca de Google) usando la clave de Google guardada como secreto del entorno (encabezado `x-goog-api-key`). Cuesta centavos por minuto.
- `../01-onboarding/generar-clip-omni.py`: genera clips de video desde una foto con Gemini Omni 1.2.
