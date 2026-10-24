Dannyboi LG TV Host v6.5 - PeerJS compatibility build

Extract this ZIP. Run BUILD_IPK.ps1 from its extracted folder using:
 powershell.exe -ExecutionPolicy Bypass -File "FULL_PATH_TO_BUILD_IPK.ps1"

The build downloads PeerJS 1.5.5 and transpiles it to Chrome 58-compatible JavaScript with esbuild before packaging using the LG webOS CLI. Internet and Node.js/npm are required on the BUILD PC only.

Install generated com.dannyboi.karaoke.standalone_6.5.0_all.ipk using:
 ares-install.cmd --device "webOS TV" "C:\Users\lein1\Downloads\com.dannyboi.karaoke.standalone_6.5.0_all.ipk"

This addresses unsupported modern JS syntax (Unexpected token .). It does not guarantee successful WebRTC signaling or YouTube playback. The LG TV must have internet for PeerJS signaling and YouTube.
