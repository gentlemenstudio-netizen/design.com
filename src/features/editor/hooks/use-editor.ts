import { fabric } from "fabric";
import { useCallback, useState, useMemo, useRef } from "react";
import { loadCanvasFonts } from "@/lib/load-canvas-fonts";
import {
  Editor,
  FILL_COLOR,
  STROKE_WIDTH,
  STROKE_COLOR,
  CIRCLE_OPTIONS,
  DIAMOND_OPTIONS,
  TRIANGLE_OPTIONS,
  BuildEditorProps,
  RECTANGLE_OPTIONS,
  EditorHookProps,
  STROKE_DASH_ARRAY,
  TEXT_OPTIONS,
  FONT_FAMILY,
  FONT_WEIGHT,
  FONT_SIZE,
  JSON_KEYS,
  TextEffects,
} from "@/features/editor/types";
import { useHistory } from "@/features/editor/hooks/use-history";
import {
  createFilter,
  downloadFile,
  isTextType,
  transformText
} from "@/features/editor/utils";
import { useHotkeys } from "@/features/editor/hooks/use-hotkeys";
import { useClipboard } from "@/features/editor/hooks//use-clipboard";
import { useAutoResize } from "@/features/editor/hooks/use-auto-resize";
import { useCanvasEvents } from "@/features/editor/hooks/use-canvas-events";
import { useWindowEvents } from "@/features/editor/hooks/use-window-events";
import { useLoadState } from "@/features/editor/hooks/use-load-state";
import { LOGO_LAYOUT_RECIPES } from "../layout/logo-layout.recipes";
import { LogoLayoutId } from "../layout/logo-layout.types";

const buildEditor = ({
  save,
  undo,
  redo,
  canRedo,
  canUndo,
  autoZoom,
  copy,
  paste,
  canvas,
  fillColor,
  fontFamily,
  setFontFamily,
  setFillColor,
  strokeColor,
  setStrokeColor,
  strokeWidth,
  setStrokeWidth,
  selectedObjects,
  strokeDashArray,
  setStrokeDashArray,
}: BuildEditorProps): Editor => {
  const generateSaveOptions = () => {
    const { width, height, left, top } = getWorkspace() as fabric.Rect;

    return {
      name: "Image",
      format: "png",
      quality: 1,
      width,
      height,
      left,
      top,
    };
  };

  const savePng = () => {
    const options = generateSaveOptions();

    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    const dataUrl = canvas.toDataURL(options);

    downloadFile(dataUrl, "png");
    autoZoom();
  };

  const saveSvg = () => {
    const options = generateSaveOptions();

    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    const dataUrl = canvas.toDataURL(options);

    downloadFile(dataUrl, "svg");
    autoZoom();
  };

  const saveJpg = () => {
    const options = generateSaveOptions();

    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    const dataUrl = canvas.toDataURL(options);

    downloadFile(dataUrl, "jpg");
    autoZoom();
  };

  const saveJson = async () => {
    const dataUrl = canvas.toJSON(JSON_KEYS);

    await transformText(dataUrl.objects);
    const fileString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(dataUrl, null, "\t"),
    )}`;
    downloadFile(fileString, "json");
  };

  const loadJson = (json: string) => {
    const data = JSON.parse(json);

    canvas.loadFromJSON(data, () => {
      autoZoom();
    });
  };

  const getWorkspace = () => {
    return canvas
      .getObjects()
      .find((object) => object.name === "clip");
  };

  const center = (object: fabric.Object) => {
    const workspace = getWorkspace();
    const center = workspace?.getCenterPoint();

    if (!center) return;

    // @ts-ignore
    canvas._centerObject(object, center);
  };

  const addToCanvas = (object: fabric.Object) => {
    center(object);
    canvas.add(object);
    canvas.setActiveObject(object);
  };

  const changeTextCase = () => {
    const obj = canvas.getActiveObject();
    if (!obj || obj.type !== "textbox") return;

    const textObj = obj as fabric.Textbox;
    const text = textObj.text || "";

    let nextText = text;

    if (text === text.toUpperCase()) {
      // UPPER → lower
      nextText = text.toLowerCase();
    } else if (text === text.toLowerCase()) {
      // lower → Title
      nextText = text.replace(/\w\S*/g, (w) =>
        w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
      );
    } else {
      // Title → UPPER
      nextText = text.toUpperCase();
    }

    textObj.set("text", nextText);
    canvas.requestRenderAll();
  };

  const updateTextEffects = (effects: TextEffects) => {
    const obj = canvas.getActiveObject();
    if (!obj || obj.type !== "textbox") return;

    /* ===== OUTLINE ===== */
    if (effects.outline) {
      const { color, thickness } = effects.outline;

      obj.set({
        stroke: thickness > 0 ? color : undefined,
        strokeWidth: thickness > 0 ? thickness : 0,
        paintFirst: thickness > 0 ? "stroke" : "fill",
      });
    }

    /* ===== SHADOW ===== */
    if (effects.shadow) {
      const { color, blur, offsetX, offsetY } = effects.shadow;

      const hasShadow = blur > 0 || offsetX !== 0 || offsetY !== 0;

      obj.set(
        "shadow",
        hasShadow
          ? new fabric.Shadow({
            color,
            blur,
            offsetX,
            offsetY,
          })
          : undefined
      );
    }

    canvas.requestRenderAll();
  };
  const recolorLogoIcon = (colors: string[]) => {
    const icon = canvas
      .getObjects()
      .find(o => o.customType === "logoIcon") as fabric.Group | undefined;

    if (!icon) return;

    icon.getObjects().forEach((obj: fabric.Object) => {
      const index = obj.paletteIndex ?? 0;
      obj.set("fill", colors[index % colors.length]);
    });

    canvas.requestRenderAll();
  };

  const normalizeColor = (color: string) => {
    // convert rgba(0,0,0,1) → #000000 (simple fallback)
    if (color.startsWith("rgb")) {
      const nums = color.match(/\d+/g);
      if (!nums) return color;
      const [r, g, b] = nums.map(Number);
      return (
        "#" +
        [r, g, b]
          .map(x => x.toString(16).padStart(2, "0"))
          .join("")
      );
    }
    return color.toLowerCase();
  };

  const getIconColors = (): string[] => {
    const active = canvas.getActiveObject();

    if (!active || active.type !== "group") return [];

    const group = active as fabric.Group;
    const objects = getGroupObjects(group);

    const colors = new Set<string>();

    objects.forEach(obj => {
      if (typeof obj.fill === "string") {
        colors.add(normalizeColor(obj.fill));
      }
    });

    return Array.from(colors);
  };

  const getIconGradients = () => {
    const group = getActiveLogoGroup();
    if (!group) return [];

    const gradientMap = new Map<
      string,
      {
        signature: string;
        paletteIndexes: number[]; // 🔑 all paths using this gradient
        stops: { offset: number; color: string }[];
        baseGradient: fabric.Gradient;
      }
    >();

    group.getObjects().forEach((obj: any) => {
      if (!obj.fill || typeof obj.fill === "string") return;

      const gradient = obj.fill as fabric.Gradient;
      if (!gradient.colorStops) return;

      const sig = gradientSignature(gradient);

      if (!gradientMap.has(sig)) {
        gradientMap.set(sig, {
          signature: sig,
          paletteIndexes: [obj.paletteIndex],
          stops: gradient.colorStops.map(s => ({
            offset: s.offset,
            color: s.color,
          })),
          baseGradient: gradient,
        });
      } else {
        gradientMap.get(sig)!.paletteIndexes.push(obj.paletteIndex);
      }
    });

    return Array.from(gradientMap.values());
  };


  const updateIconGradientStop = (
    signature: string,
    stopIndex: number,
    color: string
  ) => {
    const group = getActiveLogoGroup();
    if (!group) return;

    group.getObjects().forEach((obj: any) => {
      if (!obj.fill || typeof obj.fill === "string") return;

      const gradient = obj.fill as fabric.Gradient;
      if (!gradient.colorStops) return;

      if (gradientSignature(gradient) !== signature) return;

      const newStops = gradient.colorStops.map((stop, i) =>
        i === stopIndex ? { ...stop, color } : stop
      );

      const newGradient = new fabric.Gradient({
        type: gradient.type,
        coords: gradient.coords,
        colorStops: newStops,
      });

      obj.set("fill", newGradient);
    });

    canvas.requestRenderAll();
  };




  const getActiveLogoGroup = () => {
    const active = canvas.getActiveObject();
    if (!active || active.type !== "group") return null;
    if ((active as any).customType !== "logoIcon") return null;
    return active as fabric.Group;
  };
  const replaceIconColor = (oldColor: string, newColor: string) => {
    const active = canvas.getActiveObject();

    if (!active || active.type !== "group") return;

    const group = active as fabric.Group;
    const objects = getGroupObjects(group);

    const normalizedOld = normalizeColor(oldColor);

    objects.forEach(obj => {
      if (
        typeof obj.fill === "string" &&
        normalizeColor(obj.fill) === normalizedOld
      ) {
        obj.set("fill", newColor);
      }
    });

    canvas.requestRenderAll();
  };


  const getGroupObjects = (group: fabric.Group): fabric.Object[] => {
    return typeof (group as any).getObjects === "function"
      ? (group as any).getObjects()
      : (group as any).objects || [];
  };

  function gradientSignature(gradient: fabric.Gradient): string {
    const stops = (gradient.colorStops ?? [])
      .map(s => `${s.offset}:${s.color}`)
      .join("|");

    return JSON.stringify({
      type: gradient.type,
      coords: gradient.coords,
      stops,
    });
  }



  const applyLogoLayout = (layout: LogoLayoutId) => {
    if (!canvas) return;

    const recipe = LOGO_LAYOUT_RECIPES[layout];
    if (!recipe) return;

    const icon = canvas.getObjects().find(
      (o: any) => o.customType === "logoIcon"
    );
    const brand = canvas.getObjects().find(
      (o: any) => o.customRole === "brand"
    );
    const tagline = canvas.getObjects().find(
      (o: any) => o.customRole === "tagline"
    );

    const elements = [icon, brand, tagline].filter(Boolean) as fabric.Object[];
    if (!elements.length) return;

    const artboard = getArtboard(canvas);
    if (!artboard) return;


    // reset base scale once
    elements.forEach((o: any) => {
      if (!o.__baseScaleX) {
        o.__baseScaleX = o.scaleX ?? 1;
        o.__baseScaleY = o.scaleY ?? 1;
      }
      if (o.customType === "logoIcon") {
        o.scaleX = o.__baseScaleX * recipe.iconScale;
        o.scaleY = o.__baseScaleY * recipe.iconScale;
      }
      if (o.customRole === "brand" || o.customRole === "tagline") {
        o.scaleX = o.__baseScaleX * recipe.textScale;
        o.scaleY = o.__baseScaleY * recipe.textScale;
        o.set('fontSize', (o.__baseFontSize || FONT_SIZE) * recipe.textScale);

      }
    });

    const { cx, cy } = artboard;


    icon?.set({ visible: recipe.iconScale > 0 });
    brand?.set({ visible: recipe.textScale > 0 });
    tagline?.set({ visible: recipe.textScale > 0 });



    if (recipe.direction === "vertical") {
      icon?.set({ left: cx, top: cy - 60 });
      brand?.set({ left: cx, top: cy + recipe.spacing });
      tagline?.set({ left: cx, top: cy + recipe.spacing * 2 });
    } else {
      const dir = recipe.iconPosition === "end" ? 1 : -1;
      icon?.set({ left: cx + dir * 120, top: cy });
      brand?.set({ left: cx - dir * 20, top: cy - 10 });
      tagline?.set({ left: cx - dir * 20, top: cy + 16 });
    }



    elements.forEach((o) =>
      o.set({ originX: "center", originY: "center" })
    );

    fitLogoToArtboard(canvas, elements);
    centerLogo(canvas, elements);
    canvas.requestRenderAll();
  };

  function centerLogo(canvas: fabric.Canvas, objects: fabric.Object[]) {
    const artboard = canvas.getObjects().find(
      (o: any) => o.type === "rect" && o.name === "clip"
    );
    if (!artboard) return;

    const art = artboard.getBoundingRect(true, true);
    const bounds = getCombinedBounds(objects);

    const offsetX =
      art.left + art.width / 2 - (bounds.minX + bounds.width / 2);
    const offsetY =
      art.top + art.height / 2 - (bounds.minY + bounds.height / 2);

    objects.forEach((obj) => {
      obj.left! += offsetX;
      obj.top! += offsetY;
      obj.setCoords();
    });
  }

  function getCombinedBounds(objects: fabric.Object[]) {
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;

    objects.forEach((obj) => {
      obj.setCoords();
      const rect = obj.getBoundingRect(true, true);

      minX = Math.min(minX, rect.left);
      minY = Math.min(minY, rect.top);
      maxX = Math.max(maxX, rect.left + rect.width);
      maxY = Math.max(maxY, rect.top + rect.height);
    });

    return {
      width: maxX - minX,
      height: maxY - minY,
      minX,
      minY,
    };
  }



  function resetObject(o?: fabric.Object) {
    if (!o) return;
    o.set({
      originX: "center",
      originY: "center",
      angle: 0,
    });
    o.setCoords();
  }

  function getLogoParts(canvas: fabric.Canvas) {
    const icon = canvas.getObjects().find(o => o.customType === "logoIcon");
    const brand = canvas.getObjects().find(o => o.customRole === "brand");
    const tagline = canvas.getObjects().find(o => o.customRole === "tagline");

    return { icon, brand, tagline };
  }



  function fitLogoToArtboard(
    canvas: fabric.Canvas,
    objects: fabric.Object[],
    padding = 40
  ) {
    const artboard = canvas.getObjects().find(
      (o: any) => o.type === "rect" && o.name === "clip"
    );

    if (!artboard) return;

    const art = artboard.getBoundingRect(true, true);
    const bounds = getCombinedBounds(objects);

    const scale = Math.min(
      (art.width - padding * 2) / bounds.width,
      (art.height - padding * 2) / bounds.height,
      1 // ⛔ never upscale too much
    );

    objects.forEach((obj) => {
      obj.scaleX = (obj.scaleX ?? 1) * scale;
      obj.scaleY = (obj.scaleY ?? 1) * scale;
      obj.setCoords();
    });
  }




  function getArtboard(canvas: fabric.Canvas) {
    const bg = canvas.getObjects().find(
      (o: any) => o.type === "rect" && o.name === "clip"
    );

    if (!bg) return null;

    const rect = bg.getBoundingRect(true, true);

    return {
      cx: rect.left + rect.width / 2,
      cy: rect.top + rect.height / 2,
      width: rect.width,
      height: rect.height,
    };
  }


  return {
    savePng,
    saveJpg,
    saveSvg,
    saveJson,
    loadJson,
    canUndo,
    canRedo,
    autoZoom,
    getWorkspace,
    zoomIn: () => {
      let zoomRatio = canvas.getZoom();
      zoomRatio += 0.05;
      const center = canvas.getCenter();
      canvas.zoomToPoint(
        new fabric.Point(center.left, center.top),
        zoomRatio > 1 ? 1 : zoomRatio
      );
    },
    zoomOut: () => {
      let zoomRatio = canvas.getZoom();
      zoomRatio -= 0.05;
      const center = canvas.getCenter();
      canvas.zoomToPoint(
        new fabric.Point(center.left, center.top),
        zoomRatio < 0.2 ? 0.2 : zoomRatio,
      );
    },
    changeSize: (value: { width: number; height: number }) => {
      const workspace = getWorkspace();

      workspace?.set(value);
      autoZoom();
      save();
    },
    chnageTextSpacing: (spacing: number) => {
      const obj = canvas.getActiveObject();
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          // @ts-ignore
          // Faulty TS library, fontSize exists.
          object.set({ charSpacing: spacing });
        }
      });
      canvas.renderAll();
    },
    getTextSpacing: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return 100;
      }

      // @ts-ignore
      // Faulty TS library, fontSize exists.
      const value = selectedObject.get("charSpacing") || 100;

      return value;
    },
    changeBackground: (value: string) => {
      const workspace = getWorkspace();
      workspace?.set({ fill: value });
      canvas.renderAll();
      save();
    },
    enableDrawingMode: () => {
      canvas.discardActiveObject();
      canvas.renderAll();
      canvas.isDrawingMode = true;
      canvas.freeDrawingBrush.width = strokeWidth;
      canvas.freeDrawingBrush.color = strokeColor;
    },
    disableDrawingMode: () => {
      canvas.isDrawingMode = false;
    },
    onUndo: () => undo(),
    onRedo: () => redo(),
    onCopy: () => copy(),
    onPaste: () => paste(),
    changeImageFilter: (value: string) => {
      const objects = canvas.getActiveObjects();
      objects.forEach((object) => {
        if (object.type === "image") {
          const imageObject = object as fabric.Image;

          const effect = createFilter(value);

          imageObject.filters = effect ? [effect] : [];
          imageObject.applyFilters();
          canvas.renderAll();
        }
      });
    },
    addImage: (value: string) => {
      fabric.Image.fromURL(
        value,
        (image) => {
          const workspace = getWorkspace();

          image.scaleToWidth(workspace?.width || 0);
          image.scaleToHeight(workspace?.height || 0);

          addToCanvas(image);
        },
        {
          crossOrigin: "anonymous",
        },
      );
    },
    delete: () => {
      canvas.getActiveObjects().forEach((object) => canvas.remove(object));
      canvas.discardActiveObject();
      canvas.renderAll();
    },
    addText: (value, options, role = "") => {
      const object = new fabric.Textbox(value, {
        ...TEXT_OPTIONS,
        fill: fillColor,
        ...options,
      });

      if (role) {
        object.customRole = role;
      }

      addToCanvas(object);
    },
    getActiveOpacity: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return 1;
      }

      const value = selectedObject.get("opacity") || 1;

      return value;
    },
    changeFontSize: (value: number) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          // @ts-ignore
          // Faulty TS library, fontSize exists.
          object.set({ fontSize: value });
        }
      });
      canvas.renderAll();
    },
    getActiveFontSize: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return FONT_SIZE;
      }

      // @ts-ignore
      // Faulty TS library, fontSize exists.
      const value = selectedObject.get("fontSize") || FONT_SIZE;

      return value;
    },
    changeTextAlign: (value: string) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          // @ts-ignore
          // Faulty TS library, textAlign exists.
          object.set({ textAlign: value });
        }
      });
      canvas.renderAll();
    },
    getActiveTextAlign: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return "left";
      }

      // @ts-ignore
      // Faulty TS library, textAlign exists.
      const value = selectedObject.get("textAlign") || "left";

      return value;
    },
    changeFontUnderline: (value: boolean) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          // @ts-ignore
          // Faulty TS library, underline exists.
          object.set({ underline: value });
        }
      });
      canvas.renderAll();
    },
    getActiveFontUnderline: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return false;
      }

      // @ts-ignore
      // Faulty TS library, underline exists.
      const value = selectedObject.get("underline") || false;

      return value;
    },
    changeFontLinethrough: (value: boolean) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          // @ts-ignore
          // Faulty TS library, linethrough exists.
          object.set({ linethrough: value });
        }
      });
      canvas.renderAll();
    },
    getActiveFontLinethrough: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return false;
      }

      // @ts-ignore
      // Faulty TS library, linethrough exists.
      const value = selectedObject.get("linethrough") || false;

      return value;
    },
    changeFontStyle: (value: string) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          // @ts-ignore
          // Faulty TS library, fontStyle exists.
          object.set({ fontStyle: value });
        }
      });
      canvas.renderAll();
    },
    getActiveFontStyle: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return "normal";
      }

      // @ts-ignore
      // Faulty TS library, fontStyle exists.
      const value = selectedObject.get("fontStyle") || "normal";

      return value;
    },
    changeFontWeight: (value: number) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          // @ts-ignore
          // Faulty TS library, fontWeight exists.
          object.set({ fontWeight: value });
        }
      });
      canvas.renderAll();
    },
    changeOpacity: (value: number) => {
      canvas.getActiveObjects().forEach((object) => {
        object.set({ opacity: value });
      });
      canvas.renderAll();
    },
    bringForward: () => {
      canvas.getActiveObjects().forEach((object) => {
        canvas.bringForward(object);
      });

      canvas.renderAll();

      const workspace = getWorkspace();
      workspace?.sendToBack();
    },
    sendBackwards: () => {
      canvas.getActiveObjects().forEach((object) => {
        canvas.sendBackwards(object);
      });

      canvas.renderAll();
      const workspace = getWorkspace();
      workspace?.sendToBack();
    },
    changeFontFamily: (value: string) => {
      setFontFamily(value);
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          // @ts-ignore
          // Faulty TS library, fontFamily exists.
          object.set({ fontFamily: value });
        }
      });
      canvas.renderAll();
    },
    changeFillColor: (value: string) => {
      setFillColor(value);
      canvas.getActiveObjects().forEach((object) => {
        object.set({ fill: value });
      });
      canvas.renderAll();
    },
    changeStrokeColor: (value: string) => {
      setStrokeColor(value);
      canvas.getActiveObjects().forEach((object) => {
        // Text types don't have stroke
        if (isTextType(object.type)) {
          object.set({ fill: value });
          return;
        }

        object.set({ stroke: value });
      });
      canvas.freeDrawingBrush.color = value;
      canvas.renderAll();
    },
    changeStrokeWidth: (value: number) => {
      setStrokeWidth(value);
      canvas.getActiveObjects().forEach((object) => {
        object.set({ strokeWidth: value });
      });
      canvas.freeDrawingBrush.width = value;
      canvas.renderAll();
    },
    changeStrokeDashArray: (value: number[]) => {
      setStrokeDashArray(value);
      canvas.getActiveObjects().forEach((object) => {
        object.set({ strokeDashArray: value });
      });
      canvas.renderAll();
    },
    addCircle: () => {
      const object = new fabric.Circle({
        ...CIRCLE_OPTIONS,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
        strokeDashArray: strokeDashArray,
      });

      addToCanvas(object);
    },
    addSoftRectangle: () => {
      const object = new fabric.Rect({
        ...RECTANGLE_OPTIONS,
        rx: 50,
        ry: 50,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
        strokeDashArray: strokeDashArray,
      });

      addToCanvas(object);
    },
    addRectangle: () => {
      const object = new fabric.Rect({
        ...RECTANGLE_OPTIONS,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
        strokeDashArray: strokeDashArray,
      });

      addToCanvas(object);
    },
    addTriangle: () => {
      const object = new fabric.Triangle({
        ...TRIANGLE_OPTIONS,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
        strokeDashArray: strokeDashArray,
      });

      addToCanvas(object);
    },
    addInverseTriangle: () => {
      const HEIGHT = TRIANGLE_OPTIONS.height;
      const WIDTH = TRIANGLE_OPTIONS.width;

      const object = new fabric.Polygon(
        [
          { x: 0, y: 0 },
          { x: WIDTH, y: 0 },
          { x: WIDTH / 2, y: HEIGHT },
        ],
        {
          ...TRIANGLE_OPTIONS,
          fill: fillColor,
          stroke: strokeColor,
          strokeWidth: strokeWidth,
          strokeDashArray: strokeDashArray,
        }
      );

      addToCanvas(object);
    },
    addDiamond: () => {
      const HEIGHT = DIAMOND_OPTIONS.height;
      const WIDTH = DIAMOND_OPTIONS.width;

      const object = new fabric.Polygon(
        [
          { x: WIDTH / 2, y: 0 },
          { x: WIDTH, y: HEIGHT / 2 },
          { x: WIDTH / 2, y: HEIGHT },
          { x: 0, y: HEIGHT / 2 },
        ],
        {
          ...DIAMOND_OPTIONS,
          fill: fillColor,
          stroke: strokeColor,
          strokeWidth: strokeWidth,
          strokeDashArray: strokeDashArray,
        }
      );
      addToCanvas(object);
    },
    canvas,
    getActiveFontWeight: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return FONT_WEIGHT;
      }

      // @ts-ignore
      // Faulty TS library, fontWeight exists.
      const value = selectedObject.get("fontWeight") || FONT_WEIGHT;

      return value;
    },
    getActiveFontFamily: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return fontFamily;
      }

      // @ts-ignore
      // Faulty TS library, fontFamily exists.
      const value = selectedObject.get("fontFamily") || fontFamily;

      return value;
    },
    getActiveFillColor: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return fillColor;
      }

      const value = selectedObject.get("fill") || fillColor;

      // Currently, gradients & patterns are not supported
      return value as string;
    },
    getActiveStrokeColor: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return strokeColor;
      }

      const value = selectedObject.get("stroke") || strokeColor;

      return value;
    },
    getActiveStrokeWidth: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return strokeWidth;
      }

      const value = selectedObject.get("strokeWidth") || strokeWidth;

      return value;
    },
    getActiveStrokeDashArray: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return strokeDashArray;
      }

      const value = selectedObject.get("strokeDashArray") || strokeDashArray;

      return value;
    },

    selectedObjects,
    changeTextCase,
    updateTextEffects,
    recolorLogoIcon,
    getIconColors,
    replaceIconColor,
    getIconGradients,
    updateIconGradientStop,
    applyLogoLayout,
  };
};

export const useEditor = ({
  defaultState,
  defaultHeight,
  defaultWidth,
  clearSelectionCallback,
  saveCallback,
}: EditorHookProps) => {
  const initialState = useRef(defaultState);
  const initialWidth = useRef(defaultWidth);
  const initialHeight = useRef(defaultHeight);

  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [selectedObjects, setSelectedObjects] = useState<fabric.Object[]>([]);

  const [fontFamily, setFontFamily] = useState(FONT_FAMILY);
  const [fillColor, setFillColor] = useState(FILL_COLOR);
  const [strokeColor, setStrokeColor] = useState(STROKE_COLOR);
  const [strokeWidth, setStrokeWidth] = useState(STROKE_WIDTH);
  const [strokeDashArray, setStrokeDashArray] = useState<number[]>(STROKE_DASH_ARRAY);

  useWindowEvents();

  const {
    save,
    canRedo,
    canUndo,
    undo,
    redo,
    canvasHistory,
    setHistoryIndex,
  } = useHistory({
    canvas,
    saveCallback
  });

  const { copy, paste } = useClipboard({ canvas });

  const { autoZoom } = useAutoResize({
    canvas,
    container,
  });

  useCanvasEvents({
    save,
    canvas,
    setSelectedObjects,
    clearSelectionCallback,
  });

  useHotkeys({
    undo,
    redo,
    copy,
    paste,
    save,
    canvas,
  });

  useLoadState({
    canvas,
    autoZoom,
    initialState,
    canvasHistory,
    setHistoryIndex,
  });

  const editor = useMemo(() => {
    if (canvas) {
      return buildEditor({
        save,
        undo,
        redo,
        canUndo,
        canRedo,
        autoZoom,
        copy,
        paste,
        canvas,
        fillColor,
        strokeWidth,
        strokeColor,
        setFillColor,
        setStrokeColor,
        setStrokeWidth,
        strokeDashArray,
        selectedObjects,
        setStrokeDashArray,
        fontFamily,
        setFontFamily,
      });
    }

    return undefined;
  },
    [
      canRedo,
      canUndo,
      undo,
      redo,
      save,
      autoZoom,
      copy,
      paste,
      canvas,
      fillColor,
      strokeWidth,
      strokeColor,
      selectedObjects,
      strokeDashArray,
      fontFamily,
    ]);


  const init = useCallback(
    async ({
      initialCanvas,
      initialContainer,
    }: {
      initialCanvas: fabric.Canvas;
      initialContainer: HTMLDivElement;
    }) => {
      await loadCanvasFonts(); // 🔑 REQUIRED

      fabric.Object.prototype.set({
        cornerColor: "#FFF",
        cornerStyle: "circle",
        borderColor: "#3b82f6",
        borderScaleFactor: 1.5,
        transparentCorners: false,
        borderOpacityWhenMoving: 1,
        cornerStrokeColor: "#3b82f6",
      });

      const initialWorkspace = new fabric.Rect({
        width: initialWidth.current,
        height: initialHeight.current,
        name: "clip",
        fill: "white",
        selectable: false,
        hasControls: false,
        shadow: new fabric.Shadow({
          color: "rgba(0,0,0,0.8)",
          blur: 5,
        }),
      });

      initialCanvas.setWidth(initialContainer.offsetWidth);
      initialCanvas.setHeight(initialContainer.offsetHeight);

      initialCanvas.add(initialWorkspace);
      initialCanvas.centerObject(initialWorkspace);
      initialCanvas.clipPath = initialWorkspace;

      setCanvas(initialCanvas);
      setContainer(initialContainer);

      const currentState = JSON.stringify(
        initialCanvas.toJSON(JSON_KEYS)
      );
      canvasHistory.current = [currentState];
      setHistoryIndex(0);
    },
    [
      canvasHistory, // No need, this is from useRef
      setHistoryIndex, // No need, this is from useState
    ]
  );

  return { init, editor };
};
