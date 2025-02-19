import InauthorizedPage from "@/components/inauthorized";
import NavigationBar from "@/components/navigation/navigation";
import WikiNavigation from "@/components/wiki/navigation";
import fetchSession from "@/fetchSession";
import MDXRemoteWrapper from "@/components/wiki/remoteWrapper";
import MobileNavigation from "@/components/wiki/mobileNavigation";
import { getWikiPages, serializeWikiPage } from "@/server/api/wiki";
import { redirect, RedirectType } from "next/navigation";

export default async function WikiIndex() {
  const session = await fetchSession();
  if (session.type === "inauthenticated") {
    return redirect("/", RedirectType.replace);
  } else if (session.type === "inauthorized") {
    return <InauthorizedPage />;
  }

  const pages = await getWikiPages();

  const firstGroup = Object.keys(pages)[0];
  const firstPage = firstGroup && pages[firstGroup]?.[0]?.slug;
  const source = firstPage && (await serializeWikiPage(firstPage));

  return (
    <>
      <NavigationBar selected="wiki" session={session} />

      <main className="block sm:flex sm:min-h-full sm:flex-1 sm:flex-row sm:justify-between">
        <aside className="hidden w-96 flex-col justify-center sm:block">
          <div className="m-t-5 top-0 w-full">
            <WikiNavigation
              pages={pages}
              selectedSlug={firstPage ?? undefined}
            />
          </div>
        </aside>
        <div className="block sm:hidden">
          <MobileNavigation
            pages={pages}
            selectedSlug={firstPage ?? undefined}
          />
        </div>
        <section className="my-6 w-full p-5">
          {source && (
            <div className="prose dark:prose-invert w-full">
              <h1>{(source?.frontmatter.title as string) ?? ""}</h1>
              <MDXRemoteWrapper source={source} />
            </div>
          )}
        </section>
      </main>
    </>
  );
}
