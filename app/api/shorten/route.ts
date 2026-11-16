import { NextResponse } from "next/server";
import getURL, {addURL} from "@/lib/mongodb";

export async function POST(request: Request) {
    try{
        const {url, alias} = await request.json();
        if (!url || !alias){
            return NextResponse.json(
                { error: "Both URL and alias are required." },
            );
        }
        let resUrl: URL;
        try{
            resUrl = new URL(url);
            if (resUrl.protocol !== "http:" && resUrl.protocol !== "https:") {
                throw new Error("Invalid URL protocol");
            }
        } catch {return NextResponse.json({ error: "Please enter a valid URL." },);}

        const existingURL = await getURL(alias);
        if (existingURL) {return NextResponse.json({ error: "This alias is already taken." });}

        await addURL(alias, resUrl.href)
        return NextResponse.json({ message: "URL validated successfully!" });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "An error occurred." });
    }
}