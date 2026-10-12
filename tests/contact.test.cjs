const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function load(file, overrides = {}, env = {}) {
  const source = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(source, { module, exports: module.exports, require: name => overrides[name] || require(name), process: { env }, URL, TextEncoder });
  return module.exports;
}
const contact = load('lib/contact.ts');
const valid = { name: 'Inquiry test', email: 'visitor@example.com', projectType: 'AI content', message: 'A cinematic product concept for our next launch.' };
const smtp = { SMTP_HOST: 'smtp.example.com', SMTP_PORT: '465', SMTP_USER: 'sender@example.com', SMTP_PASS: 'test-only-secret' };
function handler({ env = smtp, delivery = { accepted: ['contact@polidori.dev'] }, error } = {}) {
  const sent = [];
  let closed = false;
  const nodemailer = { createTransport: () => ({ sendMail: async message => { sent.push(message); if (error) throw error; return delivery; }, close: () => { closed = true; } }) };
  const { POST } = load('app/api/contact/route.ts', { '@/lib/contact': contact, nodemailer }, env);
  return { POST, sent, closed: () => closed };
}
function request(value, origin = 'https://polidori.dev') {
  return new Request('https://polidori.dev/api/contact', { method: 'POST', headers: { 'content-type': 'application/json', origin }, body: typeof value === 'string' ? value : JSON.stringify(value) });
}

test('sends only to the owner and makes the visitor replyable', async () => {
  const h = handler(); const response = await h.POST(request({ ...valid, to: 'other@example.com', name: '  Inquiry test  ' }));
  assert.equal(response.status, 200); assert.equal(h.sent.length, 1);
  assert.equal(h.sent[0].to, 'contact@polidori.dev'); assert.equal(h.sent[0].from.address, smtp.SMTP_USER);
  assert.equal(h.sent[0].replyTo.address, valid.email); assert.equal(h.sent[0].replyTo.name, valid.name);
  assert.match(h.sent[0].subject, /AI content inquiry/); assert.ok(h.sent[0].text.includes(valid.message)); assert.equal(h.closed(), true);
});
test('rejects malformed, missing, oversized, or unsafe input before mail', async () => {
  const h = handler();
  for (const payload of ['{', null, [], { ...valid, name: ' \n ' }, { ...valid, name: 'Name\r\nBcc: attacker@example.com' }, { ...valid, email: 'not-an-email' }, { ...valid, email: 'a@b.com\r\nBcc:x@y.com' }, { ...valid, message: 'tiny' }, { ...valid, message: 'x'.repeat(5001) }, { ...valid, projectType: 'invalid' }]) assert.equal((await h.POST(request(payload))).status, 400);
  assert.equal((await h.POST(request({ ...valid, message: 'x'.repeat(25000) }))).status, 413);
  assert.equal(h.sent.length, 0);
});
test('rejects foreign origins and ignores honeypot submissions', async () => {
  const h = handler(); assert.equal((await h.POST(request(valid, 'https://another.example'))).status, 403);
  assert.equal((await h.POST(request({ ...valid, companyWebsite: 'spam' }))).status, 200); assert.equal(h.sent.length, 0);
});
test('missing SMTP configuration gives an honest fallback without exposing settings', async () => {
  const h = handler({ env: {} }); const response = await h.POST(request(valid));
  assert.equal(response.status, 503); assert.match((await response.json()).error, /contact@polidori.dev/); assert.equal(h.sent.length, 0);
});
test('rejection or transport failure never reports success or leaks credentials', async () => {
  for (const setup of [{ delivery: { accepted: [], rejected: ['contact@polidori.dev'] } }, { error: new Error('private credential test-only-secret') }]) {
    const h = handler(setup); const response = await h.POST(request(valid)); assert.equal(response.status, 502);
    assert.doesNotMatch(await response.text(), /test-only-secret|private credential/); assert.equal(h.closed(), true);
  }
});
