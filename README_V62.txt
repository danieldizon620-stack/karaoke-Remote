dannyboi Karaoke LG TV Host v6.2 — Pairing diagnostics and retries

CHANGES
- TV ID only displayed after PeerJS signals an actual open event (no misleading unregistered ID).
- Detailed on-screen errors, 15-second signaling timeout, 8-second automatic retries.
- PIN remains visible while retrying; manual retry makes a fresh PIN.
- Tries unpkg and jsDelivr PeerJS CDN in sequence; no local bundled copy is included.
- Existing Android remote source and Home icon retained.

BUILD ON WINDOWS (LG CLI)
Extract this ZIP and locate webos-app/appinfo.json, then:
  ares-package.cmd "FULL_PATH_TO_webos-app" -o "$env:USERPROFILE\Downloads"
  ares-install.cmd --device "webOS TV" "$env:USERPROFILE\Downloads\com.dannyboi.karaoke.standalone_6.2.0_all.ipk"
  ares-launch.cmd --device "webOS TV" com.dannyboi.karaoke.standalone

IMPORTANT: This improves diagnostics and retries, but does not guarantee WebRTC support on LG webOS 5.6.
If PeerJS/WebSocket compatibility is absent, direct Android-to-TV pairing may require a different architecture.
Internet access is required for the PeerJS signaling server and YouTube.
