// Read essays using the best English voice available on the visitor's device.
(function () {
  'use strict';

  var controls = document.querySelector('.essay-audio');
  if (!controls || !('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) return;

  var speech = window.speechSynthesis;
  var listen = document.getElementById('essay-listen');
  var label = listen.querySelector('span');
  var stop = document.getElementById('essay-stop');
  var status = controls.querySelector('.audio-status');
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
    var natural = /natural|neural|enhanced|premium/i.test(voice.name) ? 100 : 0;
    var preferred = /google|samantha|ava|daniel|serena|aria|jenny|guy/i.test(voice.name) ? 20 : 0;
    return natural + preferred + (voice.default ? 5 : 0);
  }

  function update(message) {
    label.textContent = state === 'playing' ? 'Pause' : state === 'paused' ? 'Resume' : 'Listen';
    stop.hidden = state === 'idle';
    status.textContent = message || '';
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
      // Cancel rather than native pause, which can leave mobile speech stuck.
      // Resume restarts the current short passage.
      generation++;
      state = 'paused';
      speech.cancel();
      update('Paused.');
    } else {
      if (state === 'idle') { speech.cancel(); index = 0; }
      state = 'playing';
      update('Reading essay.');
      speak();
    }
  });
  stop.addEventListener('click', function () { reset(); listen.focus(); });
  window.addEventListener('pagehide', function () { reset(); });
  if (speech.addEventListener) speech.addEventListener('voiceschanged', refreshVoices);
  refreshVoices();
  controls.hidden = false;
})();
