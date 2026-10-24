dannyboi's Karaoke v6.0 — LG TV host + Android remote SOURCE

WHAT THIS IS
- LG TV runs the karaoke queue and YouTube embedded player, with its own Home-screen microphone icon.
- Android remote connects to TV via a WebRTC data channel using public PeerJS signaling (0.peerjs.com). Windows PC is NOT required during karaoke use.
- Both devices require internet for signaling and YouTube; connection is peer-to-peer when WebRTC works.
- This is an experimental design. LG webOS 5.6's WebRTC/data-channel support and YouTube iframe playback have NOT been tested on your TV. Certain NAT/firewall environments will fail. This is NOT a guaranteed working native TV server on TCP port 8877.
- The old Android APK cannot connect: its protocol targets a Windows HTTP server at port 8877. Build and install the included NEW Android remote instead.
- The public PeerJS service is not controlled by this project and may be unavailable. Pairing uses a displayed six-digit PIN; don't treat it as strong authentication for an internet-facing service.

LG INSTALL (on Windows, with LG CLI and TV Developer Mode already set up)
1. Extract this ZIP to Downloads.
2. Find webos-app folder in extracted package; it must contain appinfo.json, index.html, app.js, icon.png.
3. PowerShell:
   ares-package.cmd "FULL_PATH_TO_EXTRACTED_FOLDER\\webos-app" -o "$env:USERPROFILE\\Downloads"
4. Install the generated IPK (verify actual name using Get-ChildItem "$env:USERPROFILE\\Downloads\\*.ipk"):
   ares-install.cmd --device "webOS TV" "$env:USERPROFILE\\Downloads\\com.dannyboi.karaoke.standalone_6.0.0_all.ipk"
5. Launch:
   ares-launch.cmd --device "webOS TV" com.dannyboi.karaoke.standalone
6. Find dannyboi's Karaoke icon in TV Home app launcher. TV shows its ID and six-digit PIN.

ANDROID BUILD
Upload extracted project to GitHub; run Actions -> Build Android TV Remote APK -> Run workflow.
Download APK from workflow artifacts and install it on Android (Android may warn about sideloading).
On Android enter TV ID and PIN. TV/phone need internet. Android YouTube searches require a YouTube Data API v3 key.

LIMITATIONS
- YouTube search filters for videoEmbeddable=true, but this does NOT guarantee playback on LG TV.
- Roulette score is entertainment-only, not voice analysis.
- 2-second wait occurs after the score animation completes.
- The app does not bypass YouTube embedding restrictions.
- TV pairing ID changes each time app is restarted or pairing is reset.
- LG TV cannot act as a TCP 8877 host using this simple packaged web app. This version uses peer-to-peer WebRTC instead.
