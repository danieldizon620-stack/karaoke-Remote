(function(){'use strict';
var $=function(id){return document.getElementById(id)}, queue=[], player=null, active=null, busy=false, scoring=false, timer=null, apiKey='';
try{queue=JSON.parse(localStorage.getItem('dk_queue')||'[]');apiKey=localStorage.getItem('dk_api_key')||'AIzaSyDWBXrmebCs6TMViQOVdvm14KE1zcgTFKA';}catch(e){queue=[];}
function status(s){$('status').textContent=s;}
function save(){try{localStorage.setItem('dk_queue',JSON.stringify(queue));}catch(e){} render();}
function render(){var ol=$('queue');ol.textContent='';queue.forEach(function(item,i){var li=document.createElement('li');li.textContent=item.title+' ';var b=document.createElement('button');b.className='secondary';b.textContent='Remove';b.onclick=function(){queue.splice(i,1);save();};li.appendChild(b);ol.appendChild(li);});$('count').textContent=queue.length;}
function videoId(s){s=(s||'').trim();var m=s.match(/(?:youtu\.be\/|[?&]v=|\/embed\/|\/shorts\/)([\w-]{11})/);return m?m[1]:/^[\w-]{11}$/.test(s)?s:null;}
function enqueue(id,title){if(!id){status('Invalid YouTube URL or video ID');return;}queue.push({id:id,title:title||id});save();status('Added: '+(title||id));if(!active&&!scoring)next();}
function next(){if(scoring)return;if(!queue.length){active=null;status('Queue empty');return;}active=queue.shift();save();status('Playing: '+active.title);if(player&&player.loadVideoById){player.loadVideoById(active.id);}else{status('Waiting for YouTube player…');}}
function complete(){if(scoring||!active)return;scoring=true;active=null;var overlay=$('score'),n=$('scoreNumber'),start=Date.now();overlay.style.display='flex';status('Song completed — roulette scoring');timer=setInterval(function(){n.textContent=String(70+Math.floor(Math.random()*31));if(Date.now()-start>=1400){clearInterval(timer);var finalScore=70+Math.floor(Math.random()*31);n.textContent=String(finalScore);$('scoreMessage').textContent='Next song in 2 seconds';setTimeout(function(){overlay.style.display='none';scoring=false;next();},2000);}},65);}
function skip(){if(timer)clearInterval(timer);scoring=false;$('score').style.display='none';active=null;next();}
window.onYouTubeIframeAPIReady=function(){player=new YT.Player('player',{width:'100%',height:'100%',playerVars:{playsinline:1,rel:0,autoplay:0},events:{onReady:function(){status('Player ready');if(queue.length)next();},onStateChange:function(e){if(e.data===YT.PlayerState.ENDED)complete();},onError:function(e){status('YouTube player error '+e.data+' (embedding, configuration or TV compatibility). Skipping…');setTimeout(skip,1500);}}});};
$('next').onclick=function(){if(active&&player&&player.playVideo)player.playVideo();else next();};$('skip').onclick=skip;
$('add').onclick=function(){enqueue(videoId($('videoId').value),$('videoTitle').value.trim());$('videoId').value='';$('videoTitle').value='';};$('clear').onclick=function(){queue=[];save();};
$('settingsBtn').onclick=function(){$('settings').classList.toggle('open');};$('saveKey').onclick=function(){apiKey=$('apiKey').value.trim();try{localStorage.setItem('dk_api_key',apiKey);}catch(e){}status('API key saved locally');};
$('search').onclick=function(){var q=$('query').value.trim();if(!q)return;if(!apiKey){$('settings').classList.add('open');status('Enter YouTube Data API key to search');return;}status('Searching embeddable videos…');var url='https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoEmbeddable=true&maxResults=12&q='+encodeURIComponent(q+' karaoke')+'&key='+encodeURIComponent(apiKey);var xhr=new XMLHttpRequest();xhr.open('GET',url,true);xhr.onload=function(){if(xhr.status!==200){status('Search error '+xhr.status+'; check API key/quota');return;}var data;try{data=JSON.parse(xhr.responseText);}catch(e){status('Invalid YouTube search response');return;}var out=$('searchResults');out.textContent='';(data.items||[]).forEach(function(it){if(!it.id||!it.id.videoId)return;var b=document.createElement('button'),img=document.createElement('img');var thumb=it.snippet.thumbnails&&it.snippet.thumbnails.default;img.src=thumb?thumb.url:'';img.alt='';b.appendChild(img);b.appendChild(document.createTextNode(it.snippet.title));b.onclick=function(){enqueue(it.id.videoId,it.snippet.title);};out.appendChild(b);});status((data.items||[]).length+' embeddable search results (playback not guaranteed)');};xhr.onerror=function(){status('Network error during search');};xhr.send();};

// WebRTC remote: TV owns playback and queue; signaling uses public PeerJS server.
var tvPeer=null, remoteConnections=[], pairPin='';
function notifyRemotes(){var payload={type:'state',queue:queue,active:active,status:$('status').textContent};remoteConnections.forEach(function(c){if(c.open){try{c.send(payload);}catch(e){}}});}
var oldSave=save;save=function(){oldSave();notifyRemotes();};
var oldStatus=status;status=function(msg){oldStatus(msg);notifyRemotes();};
var pairAttempt=0, retryHandle=null, connectionTimeout=null;
function remoteMessage(message){$('remoteStatus').textContent=message;}
function updatePeerDiagnostics(){
 var lines=['Peer script loaded: '+!!window.dkPeerScriptLoaded,'Peer script failed: '+!!window.dkPeerScriptFailed,
 'window.Peer type: '+typeof window.Peer,'WebSocket: '+typeof window.WebSocket,
 'RTCPeerConnection: '+typeof window.RTCPeerConnection,'Secure context: '+String(window.isSecureContext)];
 if(window.dkPeerErrors&&window.dkPeerErrors.length)lines=lines.concat(window.dkPeerErrors.slice(-3));
 $('peerDiagnostics').textContent=lines.join(' | ');
}

function clearPairTimers(){if(retryHandle){clearTimeout(retryHandle);retryHandle=null;}if(connectionTimeout){clearTimeout(connectionTimeout);connectionTimeout=null;}}
function scheduleRetry(message){
  remoteMessage(message+' — retrying in 8 seconds');
  if(!retryHandle)retryHandle=setTimeout(function(){retryHandle=null;startRemote(true);},8000);
}
function startRemote(isRetry){
  clearPairTimers();pairAttempt++;
  if(!isRetry || !pairPin){pairPin=String(Math.floor(100000+Math.random()*900000));}
  $('pairPin').textContent=pairPin;
  $('pairId').textContent='Connecting…';
  remoteMessage('Initializing pairing (attempt '+pairAttempt+')…');updatePeerDiagnostics();
  if(tvPeer){try{tvPeer.destroy();}catch(e){}}tvPeer=null;remoteConnections=[];
  updatePeerDiagnostics();if(typeof window.Peer!=='function'){$('pairId').textContent='Unavailable';scheduleRetry('PeerJS failed to initialize. Read diagnostics below for script/runtime error');return;}
  var requestedId='dannyboi-tv-'+Math.random().toString(36).slice(2,10);
  try{tvPeer=new Peer(requestedId,{host:'0.peerjs.com',secure:true,port:443,path:'/',debug:1});}
  catch(e){$('pairId').textContent='Unavailable';scheduleRetry('PeerJS constructor failed: '+String(e.message||e));return;}
  var thisPeer=tvPeer,registered=false;
  connectionTimeout=setTimeout(function(){if(thisPeer!==tvPeer||registered)return;
    $('pairId').textContent='Unavailable';
    scheduleRetry('Signaling timed out after 15s (WebSocket may be blocked or unsupported)');
  },15000);
  tvPeer.on('open',function(id){if(thisPeer!==tvPeer)return;registered=true;
    if(connectionTimeout){clearTimeout(connectionTimeout);connectionTimeout=null;}
    $('pairId').textContent=id;
    remoteMessage('Ready: enter this TV ID and PIN on Android');
  });
  tvPeer.on('connection',function(c){var authorized=false;
    c.on('data',function(msg){if(!msg||typeof msg!=='object')return;
      if(!authorized){if(msg.type==='pair'&&String(msg.pin)===pairPin){authorized=true;remoteConnections.push(c);c.send({type:'paired'});notifyRemotes();}else c.send({type:'error',message:'Incorrect PIN'});return;}
      if(msg.type==='enqueue'&&typeof msg.id==='string'&&/^[A-Za-z0-9_-]{11}$/.test(msg.id)){enqueue(msg.id,String(msg.title||msg.id).slice(0,180));}
      if(msg.type==='skip')skip();if(msg.type==='next')next();if(msg.type==='clear'){queue=[];save();}
      if(msg.type==='state')notifyRemotes();
    });c.on('close',function(){remoteConnections=remoteConnections.filter(function(x){return x!==c;});});
  });
  tvPeer.on('error',function(e){if(thisPeer!==tvPeer)return;
    var detail=(e&&e.type?e.type:'unknown')+(e&&e.message?' — '+e.message:'');
    if(!registered){$('pairId').textContent='Unavailable';scheduleRetry('Pairing error: '+detail);}
    else remoteMessage('Pairing warning: '+detail+'; press Retry if Android cannot connect');
  });
  tvPeer.on('disconnected',function(){if(thisPeer!==tvPeer)return;
    $('pairId').textContent='Unavailable';scheduleRetry('Signaling connection disconnected');
  });
}
$('restartRemote').onclick=function(){startRemote(false);};startRemote(false);
render();if(!window.YT){status('YouTube player did not load. Check TV browser compatibility and internet access.');}
})();
