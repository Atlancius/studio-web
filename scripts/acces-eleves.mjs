#!/usr/bin/env node
// Gère l'accès des élèves au dépôt privé Studio Web (Mac, Linux, Windows).
// Usage : node scripts/acces-eleves.mjs inviter pseudo1 [pseudo2 ...]
//         node scripts/acces-eleves.mjs retirer pseudo1 [pseudo2 ...]
//         node scripts/acces-eleves.mjs lister
// Prérequis : GitHub CLI (gh) connecté avec un compte administrateur du dépôt.
import { execFileSync } from "node:child_process";

const REPO = process.env.STUDIO_WEB_REPO || "Atlancius/studio-web";
const [action, ...pseudos] = process.argv.slice(2);
const gh = (args) => execFileSync("gh", args, { encoding: "utf8", stdio: ["ignore", "pipe", "inherit"] });

try {
  if (action === "inviter" && pseudos.length) {
    for (const p of pseudos) {
      gh(["api", "-X", "PUT", `repos/${REPO}/collaborators/${p}`, "-f", "permission=pull"]);
      console.log(`Invitation envoyée à ${p} (lecture seule). À accepter sur https://github.com/${REPO}/invitations`);
    }
  } else if (action === "retirer" && pseudos.length) {
    for (const p of pseudos) {
      gh(["api", "-X", "DELETE", `repos/${REPO}/collaborators/${p}`]);
      console.log(`Accès retiré pour ${p}.`);
    }
  } else if (action === "lister") {
    const membres = JSON.parse(gh(["api", `repos/${REPO}/collaborators`, "--paginate"]));
    const invites = JSON.parse(gh(["api", `repos/${REPO}/invitations`, "--paginate"]));
    console.log("Accès actifs :", membres.map((m) => m.login).join(", ") || "aucun");
    console.log("Invitations en attente :", invites.map((i) => i.invitee?.login).join(", ") || "aucune");
  } else {
    console.log("Usage : node scripts/acces-eleves.mjs inviter|retirer pseudo [...] | lister");
    process.exit(1);
  }
} catch (e) {
  console.error("Échec. Vérifie que gh est connecté (gh auth status) et que le pseudo existe.");
  process.exit(1);
}
