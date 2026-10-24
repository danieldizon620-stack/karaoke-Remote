Dannyboi LG TV Host v6.1 - targeted diagnostic/UI update

Changes: larger pairing display; PIN now appears even if PeerJS fails to load; clearer pairing and YouTube error messages; updated version 6.1.0. Existing Android remote project retained unchanged.

IMPORTANT: This does NOT fix underlying PeerJS CDN/TLS/WebRTC failures or YouTube iframe player configuration failures. PeerJS is still loaded from unpkg.com. The TV ID will remain unavailable if PeerJS fails. This source package is not a compiled IPK.

On Windows after extracting ZIP:
1. Locate the folder containing webos-app/appinfo.json.
2. ares-package.cmd "FULL_PATH_TO_EXTRACTED_FOLDER\dannyboi_tv_host_v6\webos-app" -o "$env:USERPROFILE\Downloads"
3. ares-install.cmd --device "webOS TV" "$env:USERPROFILE\Downloads\com.dannyboi.karaoke.standalone_6.1.0_all.ipk"
4. ares-launch.cmd --device "webOS TV" com.dannyboi.karaoke.standalone

If the old app remains visible, relaunch the installed application. If errors persist, inspect TV browser console via webOS CLI remote inspector and test internet connectivity and TLS.
