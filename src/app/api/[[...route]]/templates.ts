import { Hono } from "hono";
import { db } from "@/db/drizzle";
import { templates } from "@/db/schema";
import { eq } from "drizzle-orm";

const app = new Hono();

/* ===== GET TEMPLATE BY ID ===== */
app.get("/:id", async (c) => {
    const id = c.req.param("id");

    const data = await db
        .select()
        .from(templates)
        .where(eq(templates.id, id))
        .limit(1);

    if (!data[0]) {
        return c.json({ error: "Not found" }, 404);
    }

    return c.json({ data: data[0] });
});

app.patch("/:id", async (c) => {
    const id = c.req.param("id");
    const { json, width, height } = await c.req.json();

    await db
        .update(templates)
        .set({
            json,
            width,
            height,
        })
        .where(eq(templates.id, id));

    return c.json({ success: true });
});

/* ===== DELETE TEMPLATE ===== */
app.delete("/:id", async (c) => {
    const id = c.req.param("id");

    await db.delete(templates).where(eq(templates.id, id));

    return c.json({ success: true });
});

export default app;
