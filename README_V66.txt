Dannyboi Karaoke LG TV Host v6.6 / Android Remote

Updated Android remote search with preconfigured YouTube Data API v3 key, Enter-to-search, useful API errors, embeddable video search and thumbnails. TV search also defaults to this key.

SECURITY: The provided key is embedded in client-side source and APK and is extractable. Restrict the key to YouTube Data API v3, set quotas and rotate it if necessary. Android application restrictions may prevent browser/WebView API calls; test with a restricted key suitable for the client.

TV pairing still depends on PeerJS and LG webOS compatibility. A TV ID must be displayed before Android can connect. BUILD_IPK.ps1 transpiles PeerJS before packaging; install the resulting 6.6.0 IPK. Build the Android APK with the included GitHub Actions workflow.

No Windows PC is required to run karaoke after successful installation, but internet is needed for YouTube and PeerJS signaling. Playback is limited to embeddable videos and device compatibility.
