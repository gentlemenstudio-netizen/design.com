export function injectTemplateVariables(
    canvasJson: any,
    variables: Record<string, string>
) {
    const jsonString = JSON.stringify(canvasJson);

    const injected = Object.entries(variables).reduce(
        (acc, [key, value]) =>
            acc.replaceAll(`{{${key}}}`, value),
        jsonString
    );

    return JSON.parse(injected);
}
