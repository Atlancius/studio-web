# Resend : règles d'envoi

- `from` toujours lu depuis la variable `RESEND_FROM_EMAIL`, de forme `Marque <adresse@domaine>` ; jamais d'adresse en dur dans le code, jamais `noreply@` générique ni `@resend.dev` en production.
- Domaine vérifié dans Resend (Domains) : copier les enregistrements DNS exacts affichés par Resend (ils dépendent de la région) chez le registraire. DMARC d'abord `p=none`, puis `quarantine`, puis `reject` une fois la délivrabilité vérifiée.
- Prévoir une adresse `replyTo` qui reçoit vraiment les réponses.
- Envoi rejouable (nouvelle tentative) : en-tête `Idempotency-Key` (valable 24 h).
- Ajouter un tag `category` à chaque envoi (lettres ASCII, chiffres, `_` ou `-`) pour filtrer les statistiques.
- Newsletter ou envois marketing : utiliser les Broadcasts et Segments de Resend (désinscription gérée), pas l'API transactionnelle en boucle.
- Secrets (`RESEND_API_KEY`) uniquement dans les variables d'environnement Vercel, jamais dans un fichier commité, le HTML, le JavaScript du navigateur ou le chat.
