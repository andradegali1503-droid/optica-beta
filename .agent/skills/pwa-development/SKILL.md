---
name: pwa-development
description: >-
  Progressive Web App (PWA) guidelines: web manifest, service worker caching strategies,
  offline data persistence, standalone installation on tablets and desktop workstations.
---

# PWA Development Skill

## Architecture for Healthcare PWA
1. **Web App Manifest (`manifest.json`):**
   - Application name, short name, optical icon set (192x192, 512x512, maskable).
   - Display mode: `standalone` for native-like window chrome on doctor workstation.
   - Theme color: Medical Teal (`#0d9488`), background color (`#ffffff`).
2. **Offline Resilience:**
   - Cache shell assets (JS, CSS, fonts, SVG icons).
   - Store local pending transactions in indexedDB / localStorage when connection is severed.
   - Graceful reconnect sync banner ("Conexión reanudada - datos sincronizados").
