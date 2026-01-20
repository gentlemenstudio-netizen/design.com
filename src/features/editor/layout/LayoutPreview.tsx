type Props = {
    type: "icon-top" | "icon-bottom" | "icon-left" | "icon-right";
};

export function LayoutPreview({ type }: Props) {
    return (
        <div className="w-16 h-12 rounded bg-gray-100 flex items-center justify-center">
            <div
                className={`
          flex gap-1
          ${type === "icon-top" ? "flex-col items-center" : ""}
          ${type === "icon-bottom" ? "flex-col-reverse items-center" : ""}
          ${type === "icon-left" ? "flex-row items-center" : ""}
          ${type === "icon-right" ? "flex-row-reverse items-center" : ""}
        `}
            >
                <div className="w-4 h-4 bg-gray-400 rounded-full" />
                <div className="flex flex-col gap-1">
                    <div className="w-6 h-1 bg-gray-400 rounded" />
                    <div className="w-4 h-1 bg-gray-300 rounded" />
                </div>
            </div>
        </div>
    );
}
