import { validateSvg } from "@/lib/svg-validator";

export async function POST(req: Request) {
    try {
        const { svg } = await req.json();

        validateSvg(svg);

        return Response.json({
            success: true,
            svg, // return sanitized svg string
        });
    } catch (err: any) {
        return Response.json(
            { success: false, error: err.message },
            { status: 400 }
        );
    }
}
