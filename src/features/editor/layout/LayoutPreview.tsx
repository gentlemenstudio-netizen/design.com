import { LOGO_LAYOUT_RECIPES } from "./logo-layout.recipes";
import { LogoLayoutId } from "./logo-layout.types";

type Props = {
    layoutId: LogoLayoutId;
};


export function LayoutPreview({ layoutId }: Props) {
    const recipe = LOGO_LAYOUT_RECIPES[layoutId];
    if (!recipe) return null;

    const dir = recipe.direction;

    const iconScale =
        recipe.iconSize === "big"
            ? "scale-125"
            : recipe.iconSize === "small"
                ? "scale-75"
                : "scale-100";

    const isVertical = dir === "top" || dir === "bottom";
    const isReverse = dir === "bottom" || dir === "right";

    return (
        <div className="w-16 h-12 rounded bg-gray-100 flex items-center justify-center border border-gray-200">
            <div
                className={`
          flex gap-1
          ${isVertical ? "flex-col" : "flex-row"}
          ${isReverse ? "flex-col-reverse flex-row-reverse" : ""}
          items-center
        `}
            >
                {/* ICON */}
                <div
                    className={`
            w-3 h-3 rounded-full bg-gray-500 shrink-0
            ${iconScale}
          `}
                />

                {/* TEXT */}
                <div
                    className={`
            flex flex-col gap-1
            ${recipe.brandAlign === "center" ? "items-center" : ""}
            ${recipe.brandAlign === "right" ? "items-end" : ""}
          `}
                >
                    <div className="w-6 h-1 bg-gray-500 rounded" />
                    <div className="w-4 h-1 bg-gray-300 rounded" />
                </div>
            </div>
        </div>
    );
}
