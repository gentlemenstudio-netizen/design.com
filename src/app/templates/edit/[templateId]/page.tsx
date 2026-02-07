import { notFound } from "next/navigation";
import { getTemplateById } from "@/lib/templates";
import { LogoEditor } from "@/features/editor/components/logo-editor";

interface Props {
    params: { templateId: string };
}

export default async function EditTemplatePage({ params }: Props) {
    const template = await getTemplateById(params.templateId);

    if (!template) return notFound();

    return (
        <LogoEditor
            initialData={{
                id: template.id,
                json: JSON.stringify(template.json),
                width: template.width,
                height: template.height,
                name: template.name,
                userId: "temp",
                thumbnailUrl: null,
                isTemplate: false,
                isPro: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }}
            mode="template"
        />
    );
}
