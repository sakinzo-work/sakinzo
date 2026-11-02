const CACHE_PREFIX = 'sakinzo-react-admin-shell-';
const CACHE_NAME = CACHE_PREFIX + '__REACT_BUILD_VERSION__';
const BUILD_ASSETS = __REACT_BUILD_ASSETS__;
const APP_SHELL = ['./index.html','./styles/admin.css','./admin.webmanifest','./admin-icon-192.png','./admin-icon-512.png','./favicon.svg',...BUILD_ASSETS];
const ownedUrls = new Set(APP_SHELL.map(file=>new URL(file,self.location.href).href));
const adminPath = new URL('./admin',self.location.href).pathname;
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(APP_SHELL)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith(CACHE_PREFIX)&&key!==CACHE_NAME).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{
 const request=event.request;if(request.method!=='GET')return;const url=new URL(request.url);if(url.origin!==self.location.origin)return;
 const adminNavigation=request.mode==='navigate'&&(url.pathname===adminPath||url.pathname.startsWith(adminPath+'/'));
 const identity=new URL(url.href);identity.search='';identity.hash='';
 if(!adminNavigation&&!ownedUrls.has(identity.href))return;
 event.respondWith(fetch(request).then(response=>{if(response.ok&&ownedUrls.has(identity.href)){const copy=response.clone();event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.put(identity.href,copy)));}return response;}).catch(async()=>adminNavigation?await caches.match(new URL('./index.html',self.location.href).href)||Response.error():await caches.match(identity.href)||Response.error()));
});
