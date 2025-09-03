import fetchSession from "@/fetchSession";
import InauthorizedPage from "@/components/inauthorized";
import NavigationBar from "@/components/navigation/navigation";
import WikiNavigation from "@/components/wiki/navigation";
import MDXRemoteWrapper from "@/components/wiki/remoteWrapper";
import MobileNavigation from "@/components/wiki/mobileNavigation";
import { getWikiPages, serializeWikiPage, wikiSlugs } from "@/server/api/wiki";
import { redirect, RedirectType } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ page: string }>;
}): Promise<Metadata> {
  const { page } = await params;
  const slugs = await wikiSlugs();
  const slug = `${page}.mdx`;
  if (!slugs.includes(slug)) {
    return {
      title: "404",
    };
  }

  const source = await serializeWikiPage(slug);

  return {
    title: `${source?.frontmatter?.title} | KuoLO Ry`,
  };
}

export default async function WikiPage({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;

  const session = await fetchSession();
  if (
    session.type === "inauthenticated" ||
    (session.type === "guest" && session.advertiser)
  ) {
    return redirect("/", RedirectType.replace);
  } else if (session.type === "inauthorized") {
    return <InauthorizedPage />;
  }

  const slugs = await wikiSlugs();
  const slug = `${page}.mdx`;
  if (!slugs.includes(slug)) {
    return <p>Sivua ei löytynyt</p>;
  }

  const pages = await getWikiPages();
  const source = await serializeWikiPage(slug);

  return (
    <>
      <NavigationBar selected="wiki" session={session} />

      <main className="block min-h-full flex-1 flex-row justify-between sm:flex">
        <aside className="hidden w-96 flex-col justify-center sm:block">
          <div className="m-t-5 top-0 w-full">
            <WikiNavigation pages={pages} selectedSlug={slug} />
          </div>
        </aside>
        <div className="block sm:hidden">
          <MobileNavigation pages={pages} selectedSlug={slug ?? undefined} />
        </div>
        <section className="my-6 w-full p-5">
          {source && (
            <div className="prose w-full dark:prose-invert">
              <h1>{(source?.frontmatter.title as string) ?? ""}</h1>
              <MDXRemoteWrapper source={source} />
            </div>
          )}
        </section>
      </main>
    </>
  );
}
