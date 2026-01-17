let patched = false;

export function patchCanvasTextBaseline() {
    if (patched) return;
    patched = true;

    const ctx = CanvasRenderingContext2D.prototype;

    const originalSetter = Object.getOwnPropertyDescriptor(
        ctx,
        "textBaseline"
    )?.set;

    if (!originalSetter) return;

    Object.defineProperty(ctx, "textBaseline", {
        set(value: string) {
            // 🔥 Force Fabric-safe value
            if (value === "alphabetical") {
                originalSetter.call(this, "alphabetic");
            } else {
                originalSetter.call(this, value);
            }
        },
    });
}
