import { redirect } from "next/navigation";
import {
  createSession,
  destroySession,
  isAdmin,
  passwordMatches,
} from "@/lib/admin-auth";
import { cocon, getCoconStats } from "@/lib/cocon";
import { loadAll } from "@/lib/cocon-storage";
import AdminClient from "./AdminClient";
import "./styles.css";

async function loginAction(formData: FormData) {
  "use server";
  if (passwordMatches(formData.get("password"))) {
    await createSession();
    redirect("/cocon/admin");
  }
  redirect("/cocon/admin?error=wrong");
}

async function logoutAction() {
  "use server";
  await destroySession();
  redirect("/cocon/admin");
}

export const metadata = {
  title: "Cocon Admin",
  robots: { index: false, follow: false },
};

export default async function CoconAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  if (!(await isAdmin())) {
    return (
      <div className="cocon-login">
        <form action={loginAction} className="cocon-login-form">
          <h1>Cocon Admin</h1>
          <p className="cocon-login-lede">
            Générateur d'articles, accès protégé.
          </p>
          {error === "wrong" && (
            <div className="cocon-login-error">Mot de passe incorrect.</div>
          )}
          <input
            name="password"
            type="password"
            placeholder="Mot de passe"
            autoFocus
            required
            autoComplete="current-password"
          />
          <button type="submit">Connexion</button>
        </form>
      </div>
    );
  }

  const stats = getCoconStats();
  const [initialBriefs, initialArticles, initialPublished] = await Promise.all([
    loadAll("briefs"),
    loadAll("articles"),
    loadAll("published"),
  ]);
  return (
    <AdminClient
      cocon={cocon}
      stats={stats}
      logoutAction={logoutAction}
      initialBriefs={initialBriefs}
      initialArticles={initialArticles}
      initialPublished={initialPublished}
    />
  );
}
