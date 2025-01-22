import fetchSession from "@/fetchSession";
import InauthenticatedPage from "../_components/inauthenticated";
import InauthorizedPage from "../_components/inauthorized";
import NavigationBar from "../_components/navigation";
import WikiNavigation from "../_components/wikiNavigation";

export default async function WikiIndex() {
  const session = await fetchSession();
  if (session.type === "inauthenticated") {
    return <InauthenticatedPage />;
  } else if (session.type === "inauthorized") {
    return <InauthorizedPage />;
  }

  return (
    <>
      <NavigationBar selected="wiki" session={session} />

      <main className="block min-h-full flex-1 flex-row justify-between sm:flex">
        <aside className="hidden w-96 flex-col justify-center sm:block">
          <div className="m-t-5 top-0 w-full">
            <WikiNavigation />
          </div>
        </aside>

        <section className="my-6 w-full p-5">
          <h1 className="mb-4 text-3xl">Yleistä</h1>
          <p>
            Tervetuloa KuoLO ry:n wikiin! Täältä löydät tietoa yhdistyksestä,
            sen toiminnasta ja muusta hyödyllisestä.
          </p>
        </section>
      </main>
    </>
  );
}
