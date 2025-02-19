import IndexButtons from "@/components/index/buttons";
import NavigationBar from "@/components/navigation/navigation";
import fetchSession from "@/fetchSession";
import { redirect, RedirectType } from "next/navigation";

export default async function Home({
  searchParams: searchParamsP,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await searchParamsP;
  const session = await fetchSession();

  if (session.type !== "inauthenticated") {
    return redirect("/wiki", RedirectType.replace);
  }

  return (
    <>
      <NavigationBar />

      <main className="block min-h-full flex-1 flex-row justify-between sm:flex sm:px-10">
        <div className="align-center flex w-full flex-1 flex-col place-items-center justify-center sm:w-96">
          <h1 className={`mb-10 text-center text-3xl`}>Jäsensivut</h1>

          {searchParams?.memberInvited && (
            <p className="mb-5 text-center text-sm text-gray-400">
              Jäsen on nyt kutsuttu sähköpostilla ja voi luoda sitä kautta
              käyttäjän.
            </p>
          )}

          <IndexButtons />
        </div>
      </main>
    </>
  );
}
