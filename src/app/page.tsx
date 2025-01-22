import NavigationBar from "./_components/navigation";
import IndexButtons from "./_components/indexButtons";

export default async function Home() {
  return (
    <>
      <NavigationBar />

      <main className="block min-h-full flex-1 flex-row justify-between sm:flex sm:px-10">
        <div className="align-center flex w-full flex-1 flex-col place-items-center justify-center sm:w-96">
          <h1 className={`mb-10 text-center text-3xl`}>Jäsensivut</h1>
          <IndexButtons />
        </div>
      </main>
    </>
  );
}
