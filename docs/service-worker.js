if(!self.define){let s,n={};const i=(i,e)=>(i=new URL(i+".js",e).href,n[i]||new Promise((n=>{if("document"in self){const s=document.createElement("script");s.src=i,s.onload=n,document.head.appendChild(s)}else s=i,importScripts(i),n()})).then((()=>{let s=n[i];if(!s)throw new Error(`Module ${i} didn’t register its module`);return s})));self.define=(e,l)=>{const r=s||("document"in self?document.currentScript.src:"")||location.href;if(n[r])return;let o={};const u=s=>i(s,r),c={module:{uri:r},exports:o,require:u};n[r]=Promise.all(e.map((s=>c[s]||u(s)))).then((s=>(l(...s),o)))}}define(["./workbox-8a99996d"],(function(s){"use strict";s.setCacheNameDetails({prefix:"todo-buudienxatulap"}),self.addEventListener("message",(s=>{s.data&&"SKIP_WAITING"===s.data.type&&self.skipWaiting()})),s.precacheAndRoute([{url:"css/226.5ae00156.css",revision:null},{url:"css/365.5ae00156.css",revision:null},{url:"css/454.5ae00156.css",revision:null},{url:"css/565.5ae00156.css",revision:null},{url:"css/661.5ae00156.css",revision:null},{url:"css/694.5ae00156.css",revision:null},{url:"css/739.5ae00156.css",revision:null},{url:"css/768.5ae00156.css",revision:null},{url:"css/846.5ae00156.css",revision:null},{url:"css/884.5ae00156.css",revision:null},{url:"css/905.5ae00156.css",revision:null},{url:"css/911.5ae00156.css",revision:null},{url:"css/929.5ae00156.css",revision:null},{url:"css/993.5ae00156.css",revision:null},{url:"css/995.5ae00156.css",revision:null},{url:"css/app.31d6cfe0.css",revision:null},{url:"css/vendor.76a71318.css",revision:null},{url:"favicon.ico",revision:"f4facfeaed834544d622544acfbb7722"},{url:"fonts/KFOkCnqEu92Fr1MmgVxIIzQ.9391e6e2.woff",revision:null},{url:"fonts/KFOlCnqEu92Fr1MmEU9fBBc-.ddd11dab.woff",revision:null},{url:"fonts/KFOlCnqEu92Fr1MmSU5fBBc-.877b9231.woff",revision:null},{url:"fonts/KFOlCnqEu92Fr1MmWUlfBBc-.0344cc3c.woff",revision:null},{url:"fonts/KFOlCnqEu92Fr1MmYUtfBBc-.b555d228.woff",revision:null},{url:"fonts/KFOmCnqEu92Fr1Mu4mxM.9b78ea3b.woff",revision:null},{url:"fonts/flUhRq6tzZclQEJ-Vdg-IuiaDsNa.824b570f.woff",revision:null},{url:"fonts/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.97b9b185.woff2",revision:null},{url:"icons/apple-icon-120x120.png",revision:"d082235f6e6d2109e84e397f66fa868d"},{url:"icons/apple-icon-152x152.png",revision:"3c728ce3e709b7395be487becf76283a"},{url:"icons/apple-icon-167x167.png",revision:"3fec89672a18e4b402ede58646917c2d"},{url:"icons/apple-icon-180x180.png",revision:"aa47843bd47f34b7ca4b99f65dd25955"},{url:"icons/favicon-128x128.png",revision:"ab92df0270f054ca388127c9703a4911"},{url:"icons/favicon-16x16.png",revision:"e4b046d41e08e6fa06626d6410ab381d"},{url:"icons/favicon-32x32.png",revision:"410858b01fa6d3d66b7bf21447c5f1fc"},{url:"icons/favicon-96x96.png",revision:"db2bde7f824fb4057ffd1c42f6ed756e"},{url:"icons/icon-128x128.png",revision:"ab92df0270f054ca388127c9703a4911"},{url:"icons/icon-192x192.png",revision:"7659f0d3e9602e71811f8b7cf2ce0e8e"},{url:"icons/icon-256x256.png",revision:"cf5ad3498fb6fda43bdafd3c6ce9b824"},{url:"icons/icon-384x384.png",revision:"fdfc1b3612b6833a27a7b260c9990247"},{url:"icons/icon-512x512.png",revision:"2c2dc987945806196bd18cb6028d8bf4"},{url:"icons/ms-icon-144x144.png",revision:"8de1b0e67a62b881cd22d935f102a0e6"},{url:"icons/safari-pinned-tab.svg",revision:"3e4c3730b00c89591de9505efb73afd3"},{url:"index.html",revision:"829b361626255ef8e6e863e6d3be85f2"},{url:"js/113.d06c681a.js",revision:null},{url:"js/226.7d0f93d5.js",revision:null},{url:"js/284.6613541e.js",revision:null},{url:"js/365.9453ad08.js",revision:null},{url:"js/454.c302be88.js",revision:null},{url:"js/565.a4a32d5c.js",revision:null},{url:"js/661.bc02b0d8.js",revision:null},{url:"js/694.f157c5d5.js",revision:null},{url:"js/739.2702aec6.js",revision:null},{url:"js/768.65e77961.js",revision:null},{url:"js/846.4bc488ca.js",revision:null},{url:"js/862.35fd88f4.js",revision:null},{url:"js/884.05e887e6.js",revision:null},{url:"js/901.26a39253.js",revision:null},{url:"js/905.63e40ae5.js",revision:null},{url:"js/911.9a8e98f9.js",revision:null},{url:"js/929.cc19861f.js",revision:null},{url:"js/993.da49bd09.js",revision:null},{url:"js/995.fd7e51ce.js",revision:null},{url:"js/app.6b2ee9ae.js",revision:null},{url:"js/vendor.483374ea.js",revision:null},{url:"manifest.json",revision:"24add5da2c3cb848c3c592256490285f"}],{}),s.registerRoute(new s.NavigationRoute(s.createHandlerBoundToURL("index.html"),{denylist:[/service-worker\.js$/,/workbox-(.)*\.js$/]}))}));
