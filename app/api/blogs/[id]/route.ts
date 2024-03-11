import { blogs } from '../data';

export async function GET(
    _request: Request,
    { params }: { params: { id: string } }
) {

    const blog = blogs.find(
        ( blog )=> blog.id === parseInt(params.id)
    );
    return Response.json(blog);

}