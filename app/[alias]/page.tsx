import { redirect, notFound } from "next/navigation";
import getURL from "@/lib/mongodb";

export default async function RedirectPage({params}: {params: Promise<{alias: string}>}) {
    const {alias} = await params;
    const res = await getURL(alias);

    if(!res){ notFound()}
    redirect(res.url);
}