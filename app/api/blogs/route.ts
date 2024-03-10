import { blogs } from "./data";

export async function GET() {
    return Response.json(blogs)
}