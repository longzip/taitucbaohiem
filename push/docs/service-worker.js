if(!self.define){let s,n={};const l=(l,e)=>(l=new URL(l+".js",e).href,n[l]||new Promise((n=>{if("document"in self){const s=document.createElement("script");s.src=l,s.onload=n,document.head.appendChild(s)}else s=l,importScripts(l),n()})).then((()=>{let s=n[l];if(!s)throw new Error(`Module ${l} didn’t register its module`);return s})));self.define=(e,i)=>{const r=s||("document"in self?document.currentScript.src:"")||location.href;if(n[r])return;let c={};const u=s=>l(s,r),o={module:{uri:r},exports:c,require:u};n[r]=Promise.all(e.map((s=>o[s]||u(s)))).then((s=>(i(...s),c)))}}define(["./workbox-a1e58f5e"],(function(s){"use strict";s.setCacheNameDetails({prefix:"todolist"}),self.addEventListener("message",(s=>{s.data&&"SKIP_WAITING"===s.data.type&&self.skipWaiting()})),s.precacheAndRoute([{url:"CNAME",revision:"0e219fadb83de280d8280b5f5177e63e"},{url:"css/14.5ae00156.css",revision:null},{url:"css/155.5ae00156.css",revision:null},{url:"css/158.5ae00156.css",revision:null},{url:"css/176.5ae00156.css",revision:null},{url:"css/223.5ae00156.css",revision:null},{url:"css/270.5ae00156.css",revision:null},{url:"css/406.5ae00156.css",revision:null},{url:"css/431.5ae00156.css",revision:null},{url:"css/532.5ae00156.css",revision:null},{url:"css/582.5ae00156.css",revision:null},{url:"css/619.5ae00156.css",revision:null},{url:"css/647.5ae00156.css",revision:null},{url:"css/661.5ae00156.css",revision:null},{url:"css/667.5ae00156.css",revision:null},{url:"css/668.5ae00156.css",revision:null},{url:"css/672.5ae00156.css",revision:null},{url:"css/703.5ae00156.css",revision:null},{url:"css/711.5ae00156.css",revision:null},{url:"css/750.5ae00156.css",revision:null},{url:"css/808.5ae00156.css",revision:null},{url:"css/884.5ae00156.css",revision:null},{url:"css/917.5ae00156.css",revision:null},{url:"css/983.5ae00156.css",revision:null},{url:"css/99.5ae00156.css",revision:null},{url:"css/app.31d6cfe0.css",revision:null},{url:"css/vendor.1088355d.css",revision:null},{url:"evn.js",revision:"333808d31de9672d38a6447b370b2d64"},{url:"evn1.js",revision:"333808d31de9672d38a6447b370b2d64"},{url:"favicon.ico",revision:"5d5b0d2528b25f31e1deb5732f3ab73c"},{url:"fonts/KFOkCnqEu92Fr1MmgVxIIzQ.68bb21d0.woff",revision:null},{url:"fonts/KFOlCnqEu92Fr1MmEU9fBBc-.48af7707.woff",revision:null},{url:"fonts/KFOlCnqEu92Fr1MmSU5fBBc-.c2f7ab22.woff",revision:null},{url:"fonts/KFOlCnqEu92Fr1MmWUlfBBc-.77ecb942.woff",revision:null},{url:"fonts/KFOlCnqEu92Fr1MmYUtfBBc-.f5677eb2.woff",revision:null},{url:"fonts/KFOmCnqEu92Fr1Mu4mxM.f1e2a767.woff",revision:null},{url:"fonts/flUhRq6tzZclQEJ-Vdg-IuiaDsNa.4d73cb90.woff",revision:null},{url:"fonts/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.c5371cfb.woff2",revision:null},{url:"hgd.js",revision:"931d178994bb77b071867348e31070f3"},{url:"icons/apple-icon-120x120.png",revision:"e7ffc92dc7ea7fd03966475279efcd1d"},{url:"icons/apple-icon-152x152.png",revision:"091be6d16fa24fa8fbc8c020d814209f"},{url:"icons/apple-icon-167x167.png",revision:"cf7a56c223db71e0f8a83f44ec59bfe3"},{url:"icons/apple-icon-180x180.png",revision:"4964e5d03ae80eb3bdeae8007aab5879"},{url:"icons/apple-launch-1080x2340.png",revision:"abe8ce0088fff11df0567bfe9e61ec10"},{url:"icons/apple-launch-1125x2436.png",revision:"559920128ff4600531fd2c5b3eca7a43"},{url:"icons/apple-launch-1170x2532.png",revision:"0ed4193cb1869f34ba798cb6bc8a90df"},{url:"icons/apple-launch-1179x2556.png",revision:"be17902054bbfd18bc4a998033988f24"},{url:"icons/apple-launch-1242x2208.png",revision:"cacdd052183849546d75da463568a9dc"},{url:"icons/apple-launch-1242x2688.png",revision:"a84797624e2c461841c53ed0432d4630"},{url:"icons/apple-launch-1284x2778.png",revision:"4422d8f8474f6abb8f7e6c8f3453f8e7"},{url:"icons/apple-launch-1290x2796.png",revision:"97514ef6745ef3df61728d1a7a5a29da"},{url:"icons/apple-launch-1536x2048.png",revision:"71991490a081b9b515e9dd311051fe6c"},{url:"icons/apple-launch-1620x2160.png",revision:"f027c46b9096127286dc2c11efc39d1c"},{url:"icons/apple-launch-1668x2224.png",revision:"e216c04baf2e274cbd5a8c1d3e35c641"},{url:"icons/apple-launch-1668x2388.png",revision:"73e288efcea24b9a671a89a516acb740"},{url:"icons/apple-launch-2048x2732.png",revision:"e494cfba3732eee8564f3f2fb7850b04"},{url:"icons/apple-launch-750x1334.png",revision:"57f039edf4fb7c1bbca88fc73ca46c27"},{url:"icons/apple-launch-828x1792.png",revision:"32fd825a18691c08a3af6c39c940f51a"},{url:"icons/favicon-128x128.png",revision:"230e6857acd8cc77adb5fcbace3b23b0"},{url:"icons/favicon-16x16.png",revision:"04ab2ec53a35909ae931218212acca02"},{url:"icons/favicon-32x32.png",revision:"e46a1a9cecf342d5dbc8c980785ffe90"},{url:"icons/favicon-96x96.png",revision:"ed09a68f4d8373ef74bfff721a91f69d"},{url:"icons/icon-128x128.png",revision:"230e6857acd8cc77adb5fcbace3b23b0"},{url:"icons/icon-192x192.png",revision:"f0733baeb25770dea466633c76ba124f"},{url:"icons/icon-256x256.png",revision:"74ce6fb0d06058974507f26678d493c3"},{url:"icons/icon-384x384.png",revision:"db3dd6429bcb33e0d516d06b62671002"},{url:"icons/icon-512x512.png",revision:"bb1a048fbb506691f3801171766f39d4"},{url:"icons/ms-icon-144x144.png",revision:"a1004ad2bb860d142fdffca2c88780a6"},{url:"icons/safari-pinned-tab.svg",revision:"d85d2b077eec458df061a4a8072f7fad"},{url:"index.html",revision:"69825b1a4719fe0c03ace8eb6f0e8632"},{url:"js/126.339da270.js",revision:null},{url:"js/14.a5bbdf45.js",revision:null},{url:"js/155.8e9ab371.js",revision:null},{url:"js/158.b12b4029.js",revision:null},{url:"js/176.438f1f26.js",revision:null},{url:"js/223.21d1c996.js",revision:null},{url:"js/270.8d8b6b87.js",revision:null},{url:"js/406.c85dd320.js",revision:null},{url:"js/431.a4a7ab7a.js",revision:null},{url:"js/532.ffe7d874.js",revision:null},{url:"js/582.9303fc2b.js",revision:null},{url:"js/619.dae835f5.js",revision:null},{url:"js/647.b4a51cf7.js",revision:null},{url:"js/661.fd721c4b.js",revision:null},{url:"js/667.af9ca32f.js",revision:null},{url:"js/668.54cafeec.js",revision:null},{url:"js/672.f771bc20.js",revision:null},{url:"js/676.502f22d2.js",revision:null},{url:"js/703.624198c8.js",revision:null},{url:"js/711.d072a093.js",revision:null},{url:"js/750.5aee8dfc.js",revision:null},{url:"js/808.57cd9621.js",revision:null},{url:"js/862.e70f811b.js",revision:null},{url:"js/884.48198ce9.js",revision:null},{url:"js/901.bb0fc188.js",revision:null},{url:"js/917.8c3d785d.js",revision:null},{url:"js/933.fdc0c4e9.js",revision:null},{url:"js/983.9046af73.js",revision:null},{url:"js/99.74a6cb4e.js",revision:null},{url:"js/app.f9c2ee75.js",revision:null},{url:"js/chunk-common.ce40bdcf.js",revision:null},{url:"js/vendor.db6699a8.js",revision:null},{url:"manifest.json",revision:"1722741da5dc4739e933135e00348453"},{url:"print.css",revision:"20c8532f778392c84c5ac4a59ba9ef96"},{url:"printv2.css",revision:"20c8532f778392c84c5ac4a59ba9ef96"},{url:"robots.txt",revision:"6978a616c585d03cb5b542a891995efb"},{url:"ssm.js",revision:"fa662a801e5253b3d62ea58b7639adcb"}],{}),s.registerRoute(new s.NavigationRoute(s.createHandlerBoundToURL("index.html"),{denylist:[/service-worker\.js$/,/workbox-(.)*\.js$/]}))}));
