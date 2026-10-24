Dannyboi Karaoke LG webOS v6.3

PeerJS is loaded locally from webos-app/peerjs.min.js. Due to unavailable network access in the build environment, this file must be downloaded on your Windows PC before packaging. Run BUILD_IPK.ps1 from PowerShell (or execute its commands manually). The script fetches the library from jsDelivr/unpkg and calls the official ares-package tool. Do NOT package before peerjs.min.js exists.

After packaging: ares-install.cmd --device "webOS TV" "$env:USERPROFILE\Downloads\com.dannyboi.karaoke.standalone_6.3.0_all.ipk"
Then: ares-launch.cmd --device "webOS TV" com.dannyboi.karaoke.standalone

This fixes loading the library from within the app but cannot guarantee that PeerJS WebRTC signaling works on LG webOS 5.6.
