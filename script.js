/* Kyki / after midnight — no libraries, no tracking. */
(() => {
  'use strict';
  const $ = (selector) => document.querySelector(selector);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let motion = !reduced.matches;
  document.body.classList.add('js-ready');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    });
  }, { threshold: .12 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  const clock = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Kyiv', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  function updateClock() {
    $('#clock').textContent = clock.format(new Date());
    const zone = new Intl.DateTimeFormat('en', {timeZone:'Europe/Kyiv', timeZoneName:'shortOffset'}).formatToParts(new Date()).find(p => p.type === 'timeZoneName').value;
    $('.local-time i').textContent = zone.replace('GMT', 'UTC');
  }
  updateClock(); setInterval(updateClock, 1000); $('#year').textContent = new Date().getFullYear();
  const canvas = $('#rain'), ctx = canvas.getContext('2d');
  let drops = [], width = 0, height = 0, frame = 0, lastTime = 0;
  function resizeRain() {
    const bounds = canvas.getBoundingClientRect(); width = bounds.width; height = bounds.height;
    const dpr = Math.min(devicePixelRatio || 1, 2); canvas.width = width * dpr; canvas.height = height * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drops = Array.from({length: width < 700 ? 45 : 100}, () => ({x: Math.random()*width, y: Math.random()*height, length: 10 + Math.random()*24, speed: 190 + Math.random()*240, alpha:.08 + Math.random()*.18}));
  }
  function drawRain(time) {
    if (!motion || document.hidden) { frame = 0; return; }
    const dt = Math.min((time - lastTime)/1000 || .016, .05); lastTime = time;
    ctx.clearRect(0,0,width,height); ctx.lineWidth = .7;
    drops.forEach(d => { d.y += d.speed*dt; d.x -= d.speed*dt*.12; if(d.y>height){d.y=-30;d.x=Math.random()*width;} if(d.x<0)d.x=width; ctx.strokeStyle=`rgba(214,174,239,${d.alpha})`;ctx.beginPath();ctx.moveTo(d.x,d.y);ctx.lineTo(d.x-3,d.y+d.length);ctx.stroke(); });
    frame = requestAnimationFrame(drawRain);
  }
  function resumeRain() { if (motion && !document.hidden && !frame) { lastTime=performance.now();frame=requestAnimationFrame(drawRain); } }
  resizeRain(); resumeRain(); window.addEventListener('resize',resizeRain);document.addEventListener('visibilitychange',resumeRain);
  const motionButton = $('#motion-toggle');
  function setMotion(enabled) {motion=enabled;document.body.classList.toggle('motion-off',!motion);motionButton.setAttribute('aria-pressed',String(motion));motionButton.innerHTML=`Animations ${motion?'ON':'OFF'} <span>✦</span>`; if(motion)resumeRain(); else{cancelAnimationFrame(frame);frame=0;ctx.clearRect(0,0,width,height);$('.hero-art').style.setProperty('--art-x','0px');$('.hero-art').style.setProperty('--art-y','0px');}}
  setMotion(motion);motionButton.addEventListener('click',()=>setMotion(!motion));reduced.addEventListener('change',e=>setMotion(!e.matches));
  const cursor = $('.cursor');
  if(matchMedia('(pointer:fine)').matches){window.addEventListener('pointermove',e=>{if(!motion)return;cursor.style.left=e.clientX+'px';cursor.style.top=e.clientY+'px';cursor.classList.toggle('active',!!e.target.closest('a,button'));if(e.clientY<height){$('.hero-art').style.setProperty('--art-x',((e.clientX/innerWidth-.5)*-13)+'px');$('.hero-art').style.setProperty('--art-y',((e.clientY/height-.5)*-8)+'px');}}, {passive:true});}
  document.querySelectorAll('.link-card').forEach(card=>card.addEventListener('pointermove',e=>{if(!motion)return;const rect=card.getBoundingClientRect();card.style.setProperty('--mouse-x',e.clientX-rect.left+'px');card.style.setProperty('--mouse-y',e.clientY-rect.top+'px');}));
  $('#copy-discord').addEventListener('click',async()=>{const value='kyki678_90621';try{await navigator.clipboard.writeText(value);$('#copy-status').textContent='Copied ✓';}catch{const field=document.createElement('textarea');field.value=value;field.style.position='fixed';field.style.opacity='0';document.body.append(field);field.select();const copied=document.execCommand('copy');field.remove();$('#copy-status').textContent=copied?'Copied ✓':`Discord: ${value}`;}setTimeout(()=>$('#copy-status').textContent='',4000);});
  // Sound is synthesized locally and only starts after a deliberate click.
  let audio, master, playing=false, nodes=[];
  const soundButton = $('.sound-toggle');
  function createAmbience() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if(!AudioContext)throw new Error('Audio unavailable');
    audio = new AudioContext(); master = audio.createGain();master.gain.value=0;master.connect(audio.destination);
    const buffer=audio.createBuffer(1,audio.sampleRate*3,audio.sampleRate), data=buffer.getChannelData(0);let previous=0;
    for(let i=0;i<data.length;i++){previous=(previous+(Math.random()*2-1)*.02)/1.02;data[i]=previous*3;}
    const noise=audio.createBufferSource();noise.buffer=buffer;noise.loop=true;const filter=audio.createBiquadFilter();filter.type='lowpass';filter.frequency.value=900;const noiseGain=audio.createGain();noiseGain.gain.value=.16;noise.connect(filter);filter.connect(noiseGain);noiseGain.connect(master);noise.start();nodes.push(noise);
    [110,164.81,220,261.63].forEach((freq,i)=>{const osc=audio.createOscillator(),gain=audio.createGain();osc.type='sine';osc.frequency.value=freq;gain.gain.value=.014/(i+1);osc.connect(gain);gain.connect(master);osc.start();nodes.push(osc);});
  }
  soundButton.addEventListener('click',async()=>{try{if(!audio)createAmbience();await audio.resume();playing=!playing;master.gain.cancelScheduledValues(audio.currentTime);master.gain.setTargetAtTime(playing?.65:0,audio.currentTime,.4);soundButton.setAttribute('aria-pressed',String(playing));$('.sound-label').textContent=`Sound ${playing?'ON':'OFF'}`;soundButton.title=playing?'Disable ambient sound':'Enable ambient sound';}catch{$('.sound-label').textContent='Sound unavailable';}});
  document.addEventListener('visibilitychange',()=>{if(audio){if(document.hidden)audio.suspend();else if(playing)audio.resume().catch(()=>{});}});
  // A brief cinematic pulse on the nickname, without repeated screen flashes.
  $('#hero-title').addEventListener('click',()=>{if(!motion)return;const flash=$('.flash');flash.classList.remove('fire');void flash.offsetWidth;flash.classList.add('fire');});
})();
