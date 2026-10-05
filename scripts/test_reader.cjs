const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../static/js/reader.js'), 'utf8');

function setup(options = {}) {
  const node = () => ({ hidden: true, textContent: '', events: {},
    addEventListener(name, fn) { this.events[name] = fn; }, focus() { this.focused = true; } });
  const label = node(), status = node(), listen = node(), controls = node();
  listen.querySelector = selector => selector === 'span' ? label : null;
  controls.querySelector = () => status;
  const body = { textContent: options.text || 'First sentence. Second sentence.', querySelectorAll: () => [], cloneNode() { return this; } };
  const voice = { name: 'English Natural', lang: 'en-US' };
  const speech = { queue: [], voices: options.voices || [
    { name: 'French Premium', lang: 'fr-FR' }, { name: 'English Default', lang: 'en-US', default: true }, voice],
    getVoices() { return this.voices; }, speak(u) { this.queue.push(u); },
    cancel() { this.cancels = (this.cancels || 0) + 1; }, addEventListener() {} };
  const window = { events: {}, addEventListener(name, fn) { this.events[name] = fn; } };
  if (!options.unsupported) {
    window.speechSynthesis = speech;
    window.SpeechSynthesisUtterance = function () {};
  }
  const document = {
    querySelector(selector) {
      if (selector === '.essay-audio') return controls;
      if (selector === '.audio-status') return status;
      return { textContent: 'Essay title' };
    },
    getElementById(id) { return { 'essay-listen': listen, 'essay-content': body }[id]; }
  };
  vm.runInNewContext(source, { window, document, SpeechSynthesisUtterance: function (text) { this.text = text; } });
  return { controls, label, status, listen, speech, window, voice };
}

test('no autoplay, voice selection, and one play/stop toggle', () => {
  const app = setup();
  assert.equal(app.speech.queue.length, 0);
  assert.equal(app.controls.hidden, false);
  app.listen.events.click();
  assert.equal(app.label.textContent, 'Stop');
  assert.equal(app.speech.queue[0].voice, app.voice);
  const first = app.speech.queue[0];
  app.listen.events.click();
  assert.equal(app.label.textContent, 'Play');
  first.onend(); // A canceled passage must not advance playback.
  app.listen.events.click();
  assert.equal(app.speech.queue[1].text, first.text);
  app.listen.events.click();
  assert.equal(app.label.textContent, 'Play');
});

test('long essays retain all text through queued passages', () => {
  const text = ('A full sentence with several words. ').repeat(40).trim();
  const app = setup({ text });
  app.listen.events.click();
  let next = 0;
  while (app.label.textContent === 'Stop') {
    const utterance = app.speech.queue[next++];
    assert.ok(utterance.text.length <= 220);
    utterance.onend();
  }
  assert.equal(app.speech.queue.map(u => u.text).join(' '), 'Essay title. ' + text);
  assert.equal(app.status.textContent, 'Finished.');
});

test('voice loading fallback, failure recovery, and page exit cancellation', () => {
  const app = setup({ voices: [] });
  app.listen.events.click();
  assert.equal(app.speech.queue[0].lang, 'en-US');
  app.speech.queue[0].onerror({ error: 'not-allowed' });
  assert.equal(app.label.textContent, 'Play');
  assert.match(app.status.textContent, /unavailable/);
  app.listen.events.click();
  app.window.events.pagehide();
  const count = app.speech.queue.length;
  app.speech.queue[count - 1].onend();
  assert.equal(app.speech.queue.length, count);
  assert.equal(app.label.textContent, 'Play');
});

test('unsupported browsers keep controls hidden', () => {
  assert.equal(setup({ unsupported: true }).controls.hidden, true);
});

test('male English voices outrank female and unknown voices, with natural male preferred', () => {
  const male = { name: 'Microsoft Guy Online (Natural)', lang: 'en-US' };
  const app = setup({ voices: [
    { name: 'Microsoft Jenny Online (Natural)', lang: 'en-US', default: true },
    { name: 'Google UK English Male', lang: 'en-GB' }, male,
    { name: 'Google UK English Female', lang: 'en-GB' }
  ] });
  app.listen.events.click();
  assert.equal(app.speech.queue[0].voice, male);
});

test('available standard male voice beats a natural female voice', () => {
  const male = { name: 'Daniel', lang: 'en-GB' };
  const app = setup({ voices: [
    { name: 'Samantha Enhanced', lang: 'en-US', default: true }, male
  ] });
  app.listen.events.click();
  assert.equal(app.speech.queue[0].voice, male);
});
