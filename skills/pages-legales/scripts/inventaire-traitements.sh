#!/usr/bin/env bash
# Inventaire des traitements de données visibles dans un dépôt, pour aligner
# les textes légaux sur le code réel.
#
# Lecture seule : n'exécute aucune commande du projet, ne lit aucune valeur de
# fichier .env (seulement les noms de clés des fichiers d'exemple) et n'affiche
# jamais le contenu d'une ligne de code, seulement « chemin:ligne:indice ».
#
# Usage : inventaire-traitements.sh [racine]   (défaut : dossier courant)
# Variable : INVENTAIRE_MAX = fichiers affichés par catégorie (défaut 15).
# Sortie : rapport Markdown sur stdout. Codes : 0 succès, 2 erreur d'usage.

set -euo pipefail

racine="${1:-.}"
max="${INVENTAIRE_MAX:-15}"

for outil in git grep sed sort awk xargs find; do
	command -v "$outil" >/dev/null 2>&1 || { echo "erreur : commande requise introuvable : $outil" >&2; exit 2; }
done
[ -d "$racine" ] || { echo "erreur : dossier introuvable : $racine" >&2; exit 2; }
case "$max" in ''|*[!0-9]*) echo "erreur : INVENTAIRE_MAX doit être un entier" >&2; exit 2 ;; esac
cd "$racine"

# Fichiers jamais lus : dépendances, artefacts, lockfiles (chaque dépendance
# transitive y apparaîtrait), cartes de sources, minifiés, binaires connus et
# tout fichier d'environnement réel.
EXCLUS='(^|/)(node_modules|\.git|dist|build|out|\.next|\.turbo|\.vercel|\.expo|coverage|vendor|_generated)/|(^|/)(package-lock\.json|yarn\.lock|pnpm-lock\.yaml|bun\.lockb?|Podfile\.lock|Cargo\.lock|composer\.lock|poetry\.lock|uv\.lock)$|\.(map|min\.js|min\.css|png|jpe?g|gif|webp|avif|ico|pdf|zip|woff2?|ttf|otf|mp4|mov|mp3)$|(^|/)\.env($|\.)'
# Écartés des catégories « code » : prose, plans et outillage d'agents, qui
# citent des services sans les appeler.
OUTILLAGE='(^|/)(\.agents|\.claude|\.codex|\.cursor|\.windsurf)/'
NON_CODE="\\.(md|mdx|markdown|txt|rst)\$|(^|/)docs?/|$OUTILLAGE"
TAB="$(printf '\t')"

lister() {
	if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
		git ls-files -z --cached --others --exclude-standard
	else
		find . -type f -print0
	fi | grep -zvE "$EXCLUS" || true
}

# lister_portee code|textes : « code » écarte la prose et l'outillage
# d'agents ; « textes » garde la prose (pages légales en Markdown possibles).
lister_portee() {
	if [ "$1" = textes ]; then
		lister | grep -zvE "$OUTILLAGE" || true
	else
		lister | grep -zvE "$NON_CODE" || true
	fi
}

# chercher <motif ERE> <code|textes> : « chemin:ligne:indice », une ligne par
# indice distinct et par ligne de fichier. Casse ignorée en portée code,
# respectée en portée textes (pour distinguer « [Company] » de « [name] »).
chercher() {
	if [ "$2" = textes ]; then options=-noIE; else options=-noIiE; fi
	lister_portee "$2" \
		| xargs -0 grep "$options" -- "$1" /dev/null 2>/dev/null \
		| awk -F: -v OFS=: '{ i = tolower($3); if (!vu[$1 FS $2 FS i]++) print $1, $2, i }' || true
}

# section <titre> <motif> [code|textes] : résumé des indices, puis un fichier par
# ligne (première occurrence et indices trouvés), les plus chargés d'abord.
section() {
	titre="$1"; motif="$2"; portee="${3:-code}"
	brut="$(chercher "$motif" "$portee")"
	if [ -z "$brut" ]; then
		printf '\n## %s\n\n- aucun indice\n' "$titre"
		return 0
	fi
	resume="$(printf '%s\n' "$brut" | awk -F: '{ n[$3]++ } END { for (i in n) printf "%s (%d)\n", i, n[i] }' | sort | paste -sd ';' - | sed 's/;/, /g')"
	printf '\n## %s : %s\n\n' "$titre" "$resume"
	fichiers="$(printf '%s\n' "$brut" | awk -F: -v tab="$TAB" '
		{ f = $1
		  if (!(f in nb)) { ordre[++k] = f; premier[f] = $2 }
		  nb[f]++
		  if (!((f, $3) in vu)) { vu[f, $3] = 1; ind[f] = (f in ind) ? ind[f] ", " $3 : $3 } }
		END { for (j = 1; j <= k; j++) { f = ordre[j]; printf "%d%s- %s:%s : %s\n", nb[f], tab, f, premier[f], ind[f] } }' \
		| sort -t "$TAB" -k1,1nr | cut -f2-)"
	nf="$(printf '%s\n' "$fichiers" | wc -l | tr -d ' ')"
	printf '%s\n' "$fichiers" | head -n "$max"
	if [ "$nf" -gt "$max" ]; then
		echo "- … $((nf - max)) autre(s) fichier(s) : relance avec INVENTAIRE_MAX=$nf"
	fi
}

printf '# Inventaire des traitements — %s\n\n' "$(pwd -P)"
echo "Indices à confirmer par la lecture du code : une dépendance déclarée n'est pas forcément utilisée, et un service peut être appelé sans SDK (fetch direct)."

section "Paiement" 'stripe|lemonsqueezy|lemon-squeezy|paddle|revenuecat|react-native-purchases|expo-iap|storekit|in_app_purchase'
section "Mesure d'audience et produit" 'posthog|@vercel/analytics|@vercel/speed-insights|plausible|gtag\(|googletagmanager|google-analytics|@next/third-parties|mixpanel|amplitude|@segment|matomo|umami|hotjar|clarity\.ms'
section "Erreurs, traces et replay" '@sentry/[a-z-]+|sentry_dsn|logrocket|datadog|bugsnag|replaysSessionSampleRate|session_recording'
section "Email et notifications" 'resend|airtable|formspree|getform|tally\.so|typeform|@react-email|sendgrid|postmark|nodemailer|mailgun|brevo|sib-api|mailchimp|lumail|ghost/api|members/api|expo-notifications|firebase/messaging|onesignal|web-push'
section "Authentification et identité" 'better-auth|next-auth|@auth/[a-z-]+|@clerk|clerk|lucia|firebase/auth|supabase\.auth|socialProviders|expo-apple-authentication|@react-oauth/google|magicLink|passkey'
section "Fichiers et stockage" '@aws-sdk/client-s3|r2\.cloudflarestorage|cloudinary|uploadthing|@vercel/blob|ctx\.storage|firebase/storage|generateUploadUrl'
section "Données et hébergement" 'convex|@neondatabase|neon\.tech|drizzle-orm|@prisma/client|supabase|mongodb|planetscale|turso|wrangler|vercel\.json|fly\.toml|railway|render\.yaml'
section "IA" '@anthropic-ai/sdk|openai|@ai-sdk/[a-z-]+|@google/genai|@google/generative-ai|mistralai|replicate|@fal-ai|groq-sdk|elevenlabs'
section "Capteurs et données de l'appareil" 'expo-location|geolocation|mapbox|maps\.googleapis|expo-camera|expo-image-picker|expo-contacts|getUserMedia|expo-media-library'
section "Stockage navigateur et cookies" 'document\.cookie|localStorage|sessionStorage|indexedDB|cookies\(\)|set-cookie|setCookie'
section "Consentement" 'consent|cookie-?banner|tarteaucitron|axeptio|didomi|cookiebot|opt_in_capturing|opt_out_capturing'
section "Droits RGPD dans le code" 'deleteMyAccount|deleteAccount|deleteUser|anonymi[sz]e[A-Za-z]*|exportMyData|exportUserData|exportData|dataExport'
section "Conservation et purge" 'retention|purge[A-Za-z]*|expiresAt|\bttl\b|crons\.(daily|weekly|monthly|interval|cron)|cron\('
# Champs à remplir et textes de démonstration laissés par un modèle de site.
section "Textes hérités ou à compléter" '[Ll]orem ipsum|[Yy]our (privacy|terms)[a-z ]* here|\[([Yy]our |[Vv]otre )?(Company|COMPANY|Nom|NOM|Name|NAME|Adresse|ADRESSE|Address|ADDRESS|Email|EMAIL|SIRET|Siret)[^],]*\]|\{\{[A-Z_]+\}\}|[Ee]xample (Inc|LLC|SAS)|ACME' textes

printf '\n## Pages légales candidates\n\n'
pages="$(lister | tr '\0' '\n' | grep -iE '(privacy|confidentialit|terms|cgu|cgv|conditions|mentions|legal|cookies?|rgpd|gdpr|data-?deletion|suppression)' | head -n "$max" || true)"
if [ -n "$pages" ]; then printf '%s\n' "$pages" | sed 's/^/- /'; else echo "- aucune"; fi

printf '\n## Variables déclarées dans les fichiers d’exemple (noms seulement)\n\n'
exemples="$(git ls-files 2>/dev/null | grep -E '(^|/)\.env\.(example|sample|template)$|(^|/)\.env-[a-z-]*template$' || true)"
if [ -z "$exemples" ]; then
	echo "- aucun fichier d'exemple"
else
	printf '%s\n' "$exemples" | while IFS= read -r f; do
		cles="$(sed -n 's/^[[:space:]]*\(export[[:space:]][[:space:]]*\)\{0,1\}\([A-Za-z_][A-Za-z0-9_]*\)=.*/\2/p' "$f" | sort -u | tr '\n' ' ')"
		echo "- $f : ${cles:-aucune clé}"
	done
fi
