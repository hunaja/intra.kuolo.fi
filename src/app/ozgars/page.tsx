import fetchSession from "@/fetchSession";
import { redirect } from "next/navigation";
import NavigationBar from "@/components/navigation/navigation";
import OzgarsModal from "@/components/ozgars/modal";
import { api, HydrateClient } from "@/trpc/server";

export const metadata = {
  title: "Ozgars | KuoLO Ry",
};

export default async function OzgarsPage() {
  const session = await fetchSession();
  if (
    session.type === "inauthenticated" ||
    session.type === "inauthorized" ||
    (session.type === "guest" && session.advertiser)
  )
    return redirect("/");

  return (
    <HydrateClient>
      <NavigationBar selected="ozgars" session={session} />
      <div className="block p-4 sm:p-10"></div>
    </HydrateClient>
  );
}
