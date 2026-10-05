const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../static/js/reader.js'), 'utf8');

function setup(options = {}) {
  const node = () => ({ hidden: true, textContent: '', events: {},
    addEventListener(name, fn) { this.events[name] = fn; }, focus() { this.focused = true; } });
  const label = node(), status = node(), listen = node(), stop = node(), controls = node();
  listen.querySelector = () => label;
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
    querySelector(selector) { return selector === '.essay-audio' ? controls : { textContent: 'Essay title' }; },
    getElementById(id) { return { 'essay-listen': listen, 'essay-stop': stop, 'essay-content': body }[id]; }
  };
  vm.runInNewContext(source, { window, document, SpeechSynthesisUtterance: function (text) { this.text = text; } });
  return { controls, label, status, listen, stop, speech, window, voice };
}

test('no autoplay, natural English selection, pause/resume and stop', () => {
  const app = setup();
  assert.equal(app.speech.queue.length, 0);
  assert.equal(app.controls.hidden, false);
  app.listen.events.click();
  assert.equal(app.label.textContent, 'Pause');
  assert.equal(app.speech.queue[0].voice, app.voice);
  const first = app.speech.queue[0];
  app.listen.events.click();
  assert.equal(app.label.textContent, 'Resume');
  first.onend(); // A canceled passage must not advance playback.
  app.listen.events.click();
  assert.equal(app.speech.queue[1].text, first.text);
  app.stop.events.click();
  assert.equal(app.label.textContent, 'Listen');
  assert.equal(app.stop.hidden, true);
  assert.equal(app.listen.focused, true);
});

test('long essays retain all text through queued passages', () => {
  const text = ('A full sentence with several words. ').repeat(40).trim();
  const app = setup({ text });
  app.listen.events.click();
  let next = 0;
  while (app.label.textContent === 'Pause') {
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
  assert.equal(app.label.textContent, 'Listen');
  assert.match(app.status.textContent, /unavailable/);
  app.listen.events.click();
  app.window.events.pagehide();
  const count = app.speech.queue.length;
  app.speech.queue[count - 1].onend();
  assert.equal(app.speech.queue.length, count);
  assert.equal(app.label.textContent, 'Listen');
});

test('unsupported browsers keep controls hidden', () => {
  assert.equal(setup({ unsupported: true }).controls.hidden, true);
});
