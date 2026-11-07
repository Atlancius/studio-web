# Templates formulaire (Function, schéma, script client)

## Table des matières

- Schéma Airtable
- Function `api/subscribe.mjs`
- Formulaire HTML
- Script client
- Sécurité

## Schéma Airtable

Landing (newsletter, lead magnet), table `Inscrits` :

| Colonne | Type | Note |
|---|---|---|
| `email` | Email | obligatoire |
| `prenom` | Texte | personnalise l'email |
| `date_inscription` | Date et heure | renseignée par la Function |
| `source` | Texte | UTM ou `direct` |

Site multi-pages (contact), table `Demandes` : `nom`, `email`, `entreprise`, `telephone`, `objet`, `message` (texte long), `date_demande`, `source`.

## Function `api/subscribe.mjs`

Runtime Node de Vercel, export `fetch` standard (extension `.mjs` pour le module ES). Pour un contact, remplacer `FIELDS`, `DATE_FIELD`, `required`, les sujets et les corps d'email.

```javascript
const FIELDS = { email: 254, prenom: 80, source: 120 }; // champ -> longueur max
const DATE_FIELD = 'date_inscription';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const reply = (status, body) => Response.json(body, { status });

const sendEmail = (payload) =>
  fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: process.env.RESEND_FROM_EMAIL, ...payload }),
  });

export default {
  async fetch(request) {
    if (request.method !== 'POST') return reply(405, { ok: false, error: 'Méthode non autorisée' });

    const required = ['RESEND_API_KEY', 'RESEND_FROM_EMAIL', 'NOTIFY_EMAIL', 'AIRTABLE_TOKEN', 'AIRTABLE_BASE_ID', 'AIRTABLE_TABLE_NAME'];
    const missing = required.filter((k) => !process.env[k]);
    if (missing.length) {
      console.error('Variables manquantes :', missing.join(', '));
      return reply(500, { ok: false, error: 'Configuration serveur incomplète' });
    }

    let input;
    try { input = await request.json(); } catch { return reply(400, { ok: false, error: 'Requête invalide' }); }
    if (input.website) return reply(200, { ok: true }); // honeypot : on répond OK sans rien faire

    const data = {};
    for (const [key, max] of Object.entries(FIELDS)) {
      data[key] = typeof input[key] === 'string' ? input[key].trim().slice(0, max) : '';
    }
    if (!EMAIL_RE.test(data.email)) return reply(400, { ok: false, error: 'Email invalide' });
    data.source ||= 'direct';

    // 1. Stockage : si Airtable échoue, aucun email n'est envoyé
    const table = encodeURIComponent(process.env.AIRTABLE_TABLE_NAME);
    const stored = await fetch(`https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${table}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields: { ...data, [DATE_FIELD]: new Date().toISOString() } }),
    }).catch(() => null);
    if (!stored?.ok) {
      console.error('Airtable : statut', stored?.status ?? 'réseau');
      return reply(502, { ok: false, error: "Enregistrement impossible, réessayez plus tard" });
    }

    // 2. Emails : visiteur + propriétaire ; un échec est loggé sans casser la réponse
    const results = await Promise.allSettled([
      sendEmail({ to: data.email, subject: 'Bienvenue !', html: `<p>Bonjour ${esc(data.prenom)},</p><p>Merci pour votre inscription.</p>` }),
      sendEmail({ to: process.env.NOTIFY_EMAIL, subject: 'Nouvelle inscription', html: `<p>${esc(data.prenom)} &lt;${esc(data.email)}&gt; (source : ${esc(data.source)})</p>` }),
    ]);
    results.forEach((r, i) => {
      if (r.status === 'rejected' || !r.value.ok) console.error('Resend : email', i, 'statut', r.value?.status ?? 'réseau');
    });

    return reply(200, { ok: true });
  },
};
```

Remplacer « Bienvenue ! » et le corps par le contenu validé à l'étape 2. PDF en pièce jointe : champ `attachments` de l'API Resend. Envoi rejouable : en-tête `Idempotency-Key` (valable 24 h).

## Formulaire HTML

```html
<form id="cta-form" novalidate>
  <input type="email" name="email" placeholder="name@example.com" required autocomplete="email" />
  <input type="text" name="prenom" placeholder="Votre prénom" autocomplete="given-name" />
  <input type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true"
         style="position:absolute;left:-9999px" />
  <button type="submit">Recevoir le guide</button>
  <p id="cta-message" role="status"></p>
</form>
```

Classes CSS selon la charte du site. Les `name` correspondent aux clés de `FIELDS`.

## Script client

```javascript
const form = document.getElementById('cta-form');
const message = document.getElementById('cta-message');

form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  message.textContent = 'Envoi en cours…';
  try {
    const res = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(new FormData(form))),
    });
    const result = await res.json();
    message.textContent = result.ok ? 'Merci ! Vérifiez votre boîte mail.' : result.error || 'Une erreur est survenue.';
    if (result.ok) form.reset();
  } catch {
    message.textContent = 'Erreur réseau. Réessayez dans un instant.';
  }
});
```

Contact : remplacer `/api/subscribe` par `/api/contact`.

## Sécurité

- Aucune clé dans le HTML, le JS client ni un fichier versionné ; secrets uniquement en variables Vercel.
- Validation côté serveur ; valeurs échappées dans les emails ; pas d'email de visiteur dans les logs.
- Trafic élevé ou spam malgré le honeypot : ajouter une limite de débit (règle de pare-feu Vercel) plutôt que du code.
