// Prefer a natural male English voice available on the visitor's device.
(function () {
  'use strict';

  var controls = document.querySelector('.essay-audio');
  if (!controls || !('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) return;

  var speech = window.speechSynthesis;
  var listen = document.getElementById('essay-listen');
  var label = listen.querySelector('span');
  var playbackIcon = listen.querySelector('.audio-playback-icon');
  var status = document.querySelector('.audio-status');
  var body = document.getElementById('essay-content').cloneNode(true);
  body.querySelectorAll('script, style, figure, .twitter-tweet, [hidden]').forEach(function (el) { el.remove(); });
  body.querySelectorAll('br').forEach(function (el) { el.replaceWith(document.createTextNode(' ')); });
  body.querySelectorAll('p, h2, h3, li, blockquote').forEach(function (el) {
    el.appendChild(document.createTextNode(' '));
  });
  var text = document.querySelector('.essay-title').textContent + '. ' + body.textContent;
  text = text.replace(/https?:\/\/\S+/g, '').replace(/\s+/g, ' ').trim();

  // Short utterances avoid the long-text cutoff in some browsers. Retain every word.
  var chunks = [];
  while (text.length) {
    var cut = text.length;
    if (cut > 220) {
      var beginning = text.slice(0, 220);
      var sentence = Math.max(beginning.lastIndexOf('. '), beginning.lastIndexOf('? '), beginning.lastIndexOf('! '));
      cut = sentence > 50 ? sentence + 1 : beginning.lastIndexOf(' ');
      if (cut < 1) cut = 220;
    }
    chunks.push(text.slice(0, cut).trim());
    text = text.slice(cut).trim();
  }

  var voices = [];
  var state = 'idle';
  var index = 0;
  var generation = 0;
  var activeUtterance = null;

  function refreshVoices() {
    voices = speech.getVoices().filter(function (voice) { return /^en(?:[-_]|$)/i.test(voice.lang); });
    voices.sort(function (a, b) { return score(b) - score(a); });
  }

  function score(voice) {
    // SpeechSynthesisVoice has no gender field; recognize known voice names.
    var male = /\b(male|daniel|alex|david|guy|ryan|andrew|christopher|eric|george|brian|thomas|oliver|liam|arthur|james|fred|rishi|mark|roger|stephen)\b/i.test(voice.name) ? 1000 : 0;
    var natural = /natural|neural|enhanced|premium/i.test(voice.name) ? 100 : 0;
    var preferred = /google|microsoft|apple/i.test(voice.name) ? 20 : 0;
    return male + natural + preferred + (voice.default ? 5 : 0);
  }

  function update(message) {
    label.textContent = state === 'playing' ? 'Stop' : 'Play';
    if (playbackIcon) playbackIcon.setAttribute('d', state === 'playing' ? 'M4 4h8v8H4Z' : 'M5 3.5 12 8l-7 4.5Z');
    status.textContent = message || '';
    status.className = 'audio-status' + (message && /unavailable/.test(message) ? ' audio-error' : '');
  }

  function reset(message) {
    generation++;
    state = 'idle';
    index = 0;
    activeUtterance = null;
    speech.cancel();
    update(message);
  }

  function speak() {
    if (index >= chunks.length) { reset('Finished.'); return; }
    var run = generation;
    var utterance = new SpeechSynthesisUtterance(chunks[index]);
    activeUtterance = utterance;
    refreshVoices();
    if (voices.length) utterance.voice = voices[0];
    utterance.lang = voices.length ? voices[0].lang : 'en-US';
    utterance.rate = 0.95;
    utterance.onend = function () {
      if (run !== generation) return;
      index++;
      if (state === 'playing') speak();
    };
    utterance.onerror = function (event) {
      if (run !== generation || event.error === 'canceled' || event.error === 'interrupted') return;
      reset('Audio is unavailable. Please try again or use another browser.');
    };
    speech.speak(utterance);
  }

  listen.addEventListener('click', function () {
    if (state === 'playing') {
      reset();
    } else {
      if (state === 'idle') { speech.cancel(); index = 0; }
      state = 'playing';
      update('Reading essay.');
      speak();
    }
  });
  window.addEventListener('pagehide', function () { reset(); });
  if (speech.addEventListener) speech.addEventListener('voiceschanged', refreshVoices);
  refreshVoices();
  controls.hidden = false;
})();
