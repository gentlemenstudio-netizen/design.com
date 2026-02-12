export const injectTemplateVariables = (json: any, variables: any) => {
    const stringified = JSON.stringify(json);
    
    let result = stringified
        .replace(/{{BRAND_NAME}}/g, variables.BRAND_NAME)
        .replace(/{{TAGLINE}}/g, variables.TAGLINE);
    

    const template = JSON.parse(result);

    const color = variables.PRIMARY_COLOR;

    // 2. Recursive function to traverse Fabric.js objects
    const processObjects = (objects: any[]) => {
        objects.forEach((obj: any) => {           

            // HANDLE COLOR: Smartly apply PRIMARY_COLOR
            if (color) {
                // Rule: Only change color for icons/paths, NOT for text or large backgrounds
                const isIcon = obj.type === "path" || obj.type === "group";
                const isNotWhite = obj.fill !== "#ffffff" && obj.fill !== "white";
                
                if (isIcon && isNotWhite) {
                    obj.fill = color;
                    // If it's a group (like a complex SVG icon), color its children
                    if (obj.objects) processObjects(obj.objects);
                }
            }

            // If object has nested objects (groups), recurse
            if (obj.objects && obj.type !== "group") {
                processObjects(obj.objects);
            }
        });
    };

    if (template.objects) {
        processObjects(template.objects);
    }

    return template;
};