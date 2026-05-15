import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { fabric } from 'fabric';
import { resolveUploadUrl, resolveCanvasJsonUrls } from '../utils/urls';
import Toolbar from '../components/editor/Toolbar';
import PropertiesPanel from '../components/editor/PropertiesPanel';
import LayersPanel from '../components/editor/LayersPanel';
import { FillMode } from '../components/editor/DrawingOptionsBar';
import TemplatesPanel, { Template } from '../components/editor/TemplatesPanel';
import StickersPanel from '../components/editor/StickersPanel';
import ShareModal from '../components/editor/ShareModal';
import { Design } from '../types';
import api from '../api/client';
import { LogoMark } from '../components/Logo';

const SHAPE_TOOLS = [
  'draw-rect','draw-circle',
  'draw-rounded-rect','draw-diamond','draw-trapezoid','draw-right-triangle',
];
const SHAPE_LABELS: Record<string, string> = {
  'draw-rect':           '▭ Прямокутник',
  'draw-circle':         '○ Еліпс',
  'draw-rounded-rect':   '▢ Закруглений',
  'draw-diamond':        '◇ Ромб',
  'draw-trapezoid':      '⏢ Трапеція',
  'draw-right-triangle': '◺ Трикутник',
};

function buildShape(
  tool: string, x1: number, y1: number, x2: number, y2: number,
  fillMode: FillMode, fillColor: string, strokeColor: string,
  strokeWidth: number, opacity: number,
): fabric.Object | null {
  const w = Math.abs(x2-x1), h = Math.abs(y2-y1);
  const left = Math.min(x1,x2), top = Math.min(y1,y2);
  if (w < 2 || h < 2) return null;
  const fill   = fillMode === 'outline' ? 'transparent' : fillColor;
  const stroke = fillMode === 'filled'  ? 'transparent' : strokeColor;
  const sw     = fillMode === 'filled'  ? 0             : strokeWidth;
  const common = { fill, stroke, strokeWidth: sw, opacity, selectable: false, evented: false, objectCaching: false };
  switch (tool) {
    case 'draw-rect':
      return new fabric.Rect({ ...common, left, top, width: w, height: h });
    case 'draw-circle':
      return new fabric.Ellipse({ ...common, left, top, rx: w/2, ry: h/2 });
    case 'draw-rounded-rect':
      return new fabric.Rect({ ...common, left, top, width: w, height: h, rx: Math.min(16,w*.15), ry: Math.min(16,h*.15) });
    case 'draw-diamond': { const p = new fabric.Path(`M ${w/2} 0 L ${w} ${h/2} L ${w/2} ${h} L 0 ${h/2} Z`, common); p.set({ left, top }); return p; }
    case 'draw-trapezoid': { const p = new fabric.Path(`M ${w*.22} 0 L ${w*.78} 0 L ${w} ${h} L 0 ${h} Z`, common); p.set({ left, top }); return p; }
    case 'draw-right-triangle': { const p = new fabric.Path(`M 0 0 L 0 ${h} L ${w} ${h} Z`, common); p.set({ left, top }); return p; }
    default: return null;
  }
}

const HISTORY_LIMIT = 200;

export default function EditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchParamsRef = useRef(searchParams);

  const canvasRef        = useRef<HTMLCanvasElement>(null);
  const canvasWrapRef    = useRef<HTMLDivElement>(null);
  const fabricRef        = useRef<fabric.Canvas | null>(null);
  const fileInputRef     = useRef<HTMLInputElement>(null);

  const historyRef        = useRef<string[]>([]);
  const historyLabelsRef  = useRef<string[]>([]);
  const historyIndexRef   = useRef(-1);
  const suppressRef       = useRef(false);
  const modifiedRef       = useRef(false);
  const lastActionLabel   = useRef('✏ Зміна');
  const logicalSizeRef    = useRef({ w: 800, h: 600 });
  const isDirtyRef        = useRef(false);
  const bgHistoryTimer    = useRef<ReturnType<typeof setTimeout>>();
  const clipboardRef      = useRef<fabric.Object | null>(null);
  const lastPropsByType   = useRef<Record<string, { fill: string; stroke: string; strokeWidth: number; opacity: number }>>({});

  const [design,       setDesign]       = useState<Design | null>(null);
  const [title,        setTitle]        = useState('Untitled Design');
  const [saving,       setSaving]       = useState(false);
  const [saved,        setSaved]        = useState(false);
  const [background,   setBackground]   = useState('#ffffff');
  const [zoom,         setZoom]         = useState(1);
  const [logicalSize,  setLogicalSize]  = useState({ w: 800, h: 600 });
  const [historyState, setHistoryState] = useState<{ labels: string[]; index: number }>({ labels: [], index: -1 });

  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);
  const [objects,        setObjects]        = useState<fabric.Object[]>([]);
  const [showTemplates,  setShowTemplates]  = useState(false);
  const [showStickers,   setShowStickers]   = useState(false);
  const [savingTemplate, setSavingTemplate] = useState(false);
  const [showShare,      setShowShare]      = useState(false);
  const [isPublic,       setIsPublic]       = useState(false);
  const [userTemplates,  setUserTemplates]  = useState<any[]>([]);

  const [activeTool,  setActiveTool]  = useState('select');
  const [fillColor,   setFillColor]   = useState('#6c63ff');
  const [strokeColor, setStrokeColor] = useState('#1a1a2e');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [brushSize,   setBrushSize]   = useState(12);
  const [fillMode,    setFillMode]    = useState<FillMode>('filled');
  const [opacity,     setOpacity]     = useState(1);

  const activeToolRef  = useRef(activeTool);
  const fillColorRef   = useRef(fillColor);
  const strokeColorRef = useRef(strokeColor);
  const strokeWidthRef = useRef(strokeWidth);
  const brushSizeRef   = useRef(brushSize);
  const fillModeRef    = useRef(fillMode);
  const opacityRef     = useRef(opacity);
  const zoomRef        = useRef(zoom);

  useEffect(() => { activeToolRef.current  = activeTool;  }, [activeTool]);
  useEffect(() => { fillColorRef.current   = fillColor;   }, [fillColor]);
  useEffect(() => { strokeColorRef.current = strokeColor; }, [strokeColor]);
  useEffect(() => { strokeWidthRef.current = strokeWidth; }, [strokeWidth]);
  useEffect(() => { brushSizeRef.current   = brushSize;   }, [brushSize]);
  useEffect(() => { fillModeRef.current    = fillMode;    }, [fillMode]);
  useEffect(() => { opacityRef.current     = opacity;     }, [opacity]);
  useEffect(() => { zoomRef.current        = zoom;        }, [zoom]);

  const isDrawingShapeRef = useRef(false);
  const shapeStartRef     = useRef({ x: 0, y: 0 });
  const tempShapeRef      = useRef<fabric.Object | null>(null);

  const refreshObjects = useCallback(() => {
    const c = fabricRef.current;
    if (!c) return;
    setObjects([...c.getObjects()]);
    setSelectedObject(c.getActiveObject() || null);
  }, []);

  const pushHistory = useCallback((label = '✏ Зміна') => {
    const c = fabricRef.current;
    if (!c || suppressRef.current) return;
    const json = JSON.stringify(c.toJSON(['_label', '_locked', '_isSticker']));
    const idx  = historyIndexRef.current;
    const arr  = historyRef.current.slice(0, idx + 1);
    const lbls = historyLabelsRef.current.slice(0, idx + 1);
    arr.push(json);
    lbls.push(label);
    if (arr.length > HISTORY_LIMIT) { arr.shift(); lbls.shift(); }
    historyRef.current       = arr;
    historyLabelsRef.current = lbls;
    historyIndexRef.current  = arr.length - 1;
    setHistoryState({ labels: [...lbls], index: arr.length - 1 });
    isDirtyRef.current = true;
  }, []);

  const undo = useCallback(() => {
    if (historyIndexRef.current <= 0) return;
    historyIndexRef.current--;
    const newIdx = historyIndexRef.current;
    suppressRef.current = true;
    fabricRef.current?.loadFromJSON(historyRef.current[newIdx], () => {
      fabricRef.current?.renderAll();
      suppressRef.current = false;
      refreshObjects();
    });
    setHistoryState(prev => ({ ...prev, index: newIdx }));
  }, [refreshObjects]);

  const redo = useCallback(() => {
    if (historyIndexRef.current >= historyRef.current.length - 1) return;
    historyIndexRef.current++;
    const newIdx = historyIndexRef.current;
    suppressRef.current = true;
    fabricRef.current?.loadFromJSON(historyRef.current[newIdx], () => {
      fabricRef.current?.renderAll();
      suppressRef.current = false;
      refreshObjects();
    });
    setHistoryState(prev => ({ ...prev, index: newIdx }));
  }, [refreshObjects]);

  const jumpHistory = useCallback((i: number) => {
    if (i < 0 || i >= historyRef.current.length) return;
    historyIndexRef.current = i;
    suppressRef.current = true;
    fabricRef.current?.loadFromJSON(historyRef.current[i], () => {
      fabricRef.current?.renderAll();
      suppressRef.current = false;
      refreshObjects();
    });
    setHistoryState(prev => ({ ...prev, index: i }));
  }, [refreshObjects]);

  const applyZoom = useCallback((newZ: number, cursorInWrapper?: { x: number; y: number }) => {
    const c = fabricRef.current;
    const wrapper = canvasWrapRef.current;
    if (!c) return;
    const { w, h } = logicalSizeRef.current;
    const oldZ = zoomRef.current;
    const clampedZ = Math.max(0.1, Math.min(5, newZ));

    let logicalX = 0, logicalY = 0;
    if (cursorInWrapper && wrapper) {
      const absX = cursorInWrapper.x + wrapper.scrollLeft;
      const absY = cursorInWrapper.y + wrapper.scrollTop;
      logicalX = absX / oldZ;
      logicalY = absY / oldZ;
    }

    c.setZoom(clampedZ);
    c.setViewportTransform([clampedZ, 0, 0, clampedZ, 0, 0]);
    c.setDimensions({ width: w * clampedZ, height: h * clampedZ });
    c.renderAll();
    zoomRef.current = clampedZ;
    setZoom(clampedZ);

    if (cursorInWrapper && wrapper) {
      const newAbsX = logicalX * clampedZ;
      const newAbsY = logicalY * clampedZ;
      wrapper.scrollLeft = newAbsX - cursorInWrapper.x;
      wrapper.scrollTop  = newAbsY - cursorInWrapper.y;
    }
  }, []);

  useEffect(() => {
    const el = canvasWrapRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      const newZ = Math.max(0.1, Math.min(5, zoomRef.current + (e.deltaY < 0 ? 0.05 : -0.05)));
      const rect = el.getBoundingClientRect();
      applyZoom(newZ, { x: e.clientX - rect.left, y: e.clientY - rect.top });
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [applyZoom]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = new fabric.Canvas(canvasRef.current, {
      backgroundColor: '#ffffff',
      preserveObjectStacking: true,
      stopContextMenu: true,
      uniformScaling: false,
    });
    fabricRef.current = canvas;

    canvas.on('selection:created', refreshObjects);
    canvas.on('selection:updated', refreshObjects);
    canvas.on('selection:cleared', refreshObjects);

    canvas.on('object:moving',   () => { lastActionLabel.current = '↕ Переміщення'; });
    canvas.on('object:scaling',  () => { lastActionLabel.current = '⇔ Масштаб'; });
    canvas.on('object:rotating', () => { lastActionLabel.current = '↻ Поворот'; });

    canvas.on('object:modified', () => {
      modifiedRef.current = true;
      const active = canvas.getActiveObject();
      if (active) saveObjProps(active);
      refreshObjects();
    });

    canvas.on('object:added', () => {
      if (!suppressRef.current) refreshObjects();
    });
    canvas.on('object:removed', () => {
      if (!suppressRef.current) pushHistory('🗑 Видалення');
      refreshObjects();
    });

    canvas.on('mouse:down', (opt: fabric.IEvent<MouseEvent>) => {
      const tool = activeToolRef.current;
      if (!SHAPE_TOOLS.includes(tool)) return;
      if (opt.target) {
        canvas.setActiveObject(opt.target);
        canvas.renderAll();
        refreshObjects();
        return;
      }
      canvas.discardActiveObject();
      isDrawingShapeRef.current = true;
      const p = canvas.getPointer(opt.e);
      shapeStartRef.current = { x: p.x, y: p.y };
    });

    canvas.on('mouse:move', (opt: fabric.IEvent<MouseEvent>) => {
      if (!isDrawingShapeRef.current) return;
      const p = canvas.getPointer(opt.e);
      const { x: sx, y: sy } = shapeStartRef.current;
      suppressRef.current = true;
      if (tempShapeRef.current) canvas.remove(tempShapeRef.current);
      suppressRef.current = false;
      const shape = buildShape(
        activeToolRef.current, sx, sy, p.x, p.y,
        fillModeRef.current, fillColorRef.current,
        strokeColorRef.current, strokeWidthRef.current, opacityRef.current,
      );
      if (shape) {
        tempShapeRef.current = shape;
        suppressRef.current = true;
        canvas.add(shape);
        canvas.renderAll();
        suppressRef.current = false;
      }
    });

    canvas.on('mouse:up', (opt: fabric.IEvent<MouseEvent>) => {
      if (modifiedRef.current && !isDrawingShapeRef.current) {
        modifiedRef.current = false;
        pushHistory(lastActionLabel.current);
        lastActionLabel.current = '✏ Зміна';
      }

      if (!isDrawingShapeRef.current) return;
      isDrawingShapeRef.current = false;
      if (tempShapeRef.current) {
        suppressRef.current = true;
        canvas.remove(tempShapeRef.current);
        suppressRef.current = false;
        tempShapeRef.current = null;
      }
      const p = canvas.getPointer(opt.e);
      const { x: sx, y: sy } = shapeStartRef.current;
      const shape = buildShape(
        activeToolRef.current, sx, sy, p.x, p.y,
        fillModeRef.current, fillColorRef.current,
        strokeColorRef.current, strokeWidthRef.current, opacityRef.current,
      );
      if (shape) {
        shape.set({ selectable: true, evented: true, _label: SHAPE_LABELS[activeToolRef.current] ?? '' } as any);
        canvas.add(shape);
        canvas.getObjects().forEach(o => { if (!(o as any)._locked) { o.selectable = true; o.evented = true; } });
        canvas.selection = true;
        canvas.defaultCursor = 'default';
        canvas.setActiveObject(shape);
        canvas.renderAll();
        pushHistory(SHAPE_LABELS[activeToolRef.current] ?? '▭ Фігура');
        refreshObjects();
      }
    });

    canvas.on('path:created', (e: any) => {
      if (e.path && opacityRef.current < 1) {
        e.path.set('opacity', opacityRef.current);
        canvas.renderAll();
      }
      pushHistory('✏️ Малюнок');
      refreshObjects();
    });

    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      const inInput = tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement).isContentEditable;
      const k = e.key.toLowerCase();
      if ((e.ctrlKey || e.metaKey) && (k === 'z' || k === 'я')) { e.preventDefault(); undo(); }
      if ((e.ctrlKey || e.metaKey) && (k === 'y' || k === 'н')) { e.preventDefault(); redo(); }
      if ((e.ctrlKey || e.metaKey) && k === 's') { e.preventDefault(); saveDesign(); }
      if ((e.ctrlKey || e.metaKey) && (k === 'c' || k === 'с') && !inInput) {
        const active = canvas.getActiveObject();
        if (active) active.clone((cloned: fabric.Object) => { clipboardRef.current = cloned; });
      }
      if ((e.ctrlKey || e.metaKey) && (k === 'v' || k === 'м') && !inInput) {
        const clipped = clipboardRef.current;
        if (!clipped) return;
        clipped.clone((cloned: fabric.Object) => {
          canvas.discardActiveObject();
          cloned.set({ left: (cloned.left ?? 0) + 20, top: (cloned.top ?? 0) + 20, evented: true });
          if ((cloned as any).type === 'activeSelection') {
            (cloned as fabric.ActiveSelection).canvas = canvas;
            (cloned as fabric.ActiveSelection).forEachObject((o: fabric.Object) => canvas.add(o));
            cloned.setCoords();
          } else {
            canvas.add(cloned);
          }
          canvas.setActiveObject(cloned);
          canvas.renderAll();
          pushHistory('📋 Вставка');
          refreshObjects();
          clipboardRef.current = cloned;
        });
      }
      if ((e.key === 'Delete' || e.key === 'Backspace') && !inInput) {
        const active = canvas.getActiveObjects();
        if (active.length) { active.forEach(o => canvas.remove(o)); canvas.discardActiveObject(); canvas.renderAll(); }
      }
      if (e.key === 'Escape') setActiveTool('select');
    };
    window.addEventListener('keydown', onKey);

    const onBeforeUnload = () => {
      if (isDirtyRef.current) saveDesign();
    };
    window.addEventListener('beforeunload', onBeforeUnload);

    if (id && id !== 'new') {
      api.get(`/designs/${id}`).then(({ data }) => {
        setDesign(data);
        setTitle(data.title);
        setIsPublic(data.isPublic || false);
        logicalSizeRef.current = { w: data.width, h: data.height };
        setLogicalSize({ w: data.width, h: data.height });
        const availW = window.innerWidth - 172 - 270 - 48;
        const availH = window.innerHeight - 56 - 48;
        const fitZ = Math.max(0.1, Math.min(1, Math.min(availW / data.width, availH / data.height)));
        zoomRef.current = fitZ; setZoom(fitZ);
        canvas.setDimensions({ width: data.width * fitZ, height: data.height * fitZ });
        canvas.setViewportTransform([fitZ,0,0,fitZ,0,0]);
        try {
          if (data.canvasData && Object.keys(data.canvasData).length > 0) {
            suppressRef.current = true;
            const bg = (data.canvasData as any).background || '#ffffff';
            setBackground(bg);
            canvas.loadFromJSON(resolveCanvasJsonUrls(data.canvasData), () => {
              canvas.setDimensions({ width: data.width * fitZ, height: data.height * fitZ });
              canvas.setViewportTransform([fitZ,0,0,fitZ,0,0]);
              canvas.renderAll();
              suppressRef.current = false;
              canvas.setBackgroundColor(bg, canvas.renderAll.bind(canvas));
              pushHistory('📂 Завантаження');
              refreshObjects();
            });
          } else {
            pushHistory('📂 Завантаження');
            const sysId = searchParamsRef.current.get('sysTemplate');
            if (sysId) {
              import('../components/editor/TemplatesPanel').then(m => {
                const tpl = m.TEMPLATES.find((t: any) => t.id === sysId);
                if (tpl) applyTemplateNoConfirm(canvas, tpl);
              });
            }
          }
        } catch {
          suppressRef.current = false;
          pushHistory('📂 Завантаження');
        }
      }).catch(() => navigate('/dashboard'));
    } else {
      logicalSizeRef.current = { w: 800, h: 600 };
      setLogicalSize({ w: 800, h: 600 });
      canvas.setDimensions({ width: 800, height: 600 });
      canvas.setViewportTransform([1,0,0,1,0,0]);
      pushHistory('🆕 Новий');
    }

    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('beforeunload', onBeforeUnload);
      canvas.dispose();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const isBrush = activeTool === 'pencil';
    const isShape = SHAPE_TOOLS.includes(activeTool);

    if (isBrush) {
      const brush = new fabric.PencilBrush(canvas);
      brush.color = fillColor;
      brush.width = Math.max(1, brushSize / 4);
      (brush as any).opacity = opacity;
      canvas.freeDrawingBrush = brush;
      canvas.isDrawingMode = true;
      canvas.selection = false;
      canvas.defaultCursor = 'crosshair';
      canvas.getObjects().forEach(o => { o.selectable = false; o.evented = false; });
    } else if (isShape) {
      canvas.isDrawingMode = false;
      canvas.selection = false;
      canvas.defaultCursor = 'crosshair';
      canvas.discardActiveObject();
      canvas.getObjects().forEach(o => { o.selectable = false; o.evented = true; });
      canvas.renderAll();
    } else {
      canvas.isDrawingMode = false;
      canvas.selection = true;
      canvas.defaultCursor = 'default';
      canvas.getObjects().forEach(o => { if (!(o as any)._locked) { o.selectable = true; o.evented = true; } });
    }
  }, [activeTool, fillColor, brushSize, opacity]);

  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas?.isDrawingMode || !canvas.freeDrawingBrush) return;
    canvas.freeDrawingBrush.color = fillColor;
    canvas.freeDrawingBrush.width = Math.max(1, brushSize / 4);
    (canvas.freeDrawingBrush as any).opacity = opacity;
  }, [fillColor, brushSize, opacity, activeTool]);

  const handleBackgroundChange = (color: string) => {
    setBackground(color);
    const c = fabricRef.current;
    if (!c) return;
    c.setBackgroundColor(color, () => { c.renderAll(); });
    clearTimeout(bgHistoryTimer.current);
    bgHistoryTimer.current = setTimeout(() => pushHistory('🎨 Фон'), 600);
  };

  const fabricTypeToKey = (type: string): string => {
    if (type === 'ellipse' || type === 'circle') return 'ellipse';
    if (type === 'rect') return 'rect';
    if (type === 'path') return 'path';
    if (type === 'textbox' || type === 'i-text' || type === 'text') return 'text';
    return type;
  };

  const toolToTypeKey = (tool: string): string => {
    if (tool === 'draw-circle') return 'ellipse';
    if (tool === 'pencil') return 'path';
    return 'rect'; // draw-rect, draw-rounded-rect, draw-diamond, draw-trapezoid, draw-right-triangle
  };

  const saveObjProps = (obj: fabric.Object) => {
    const key = fabricTypeToKey(obj.type || '');
    const o = obj as any;
    lastPropsByType.current[key] = {
      fill:        o.fill        ?? '#6c63ff',
      stroke:      o.stroke      ?? 'transparent',
      strokeWidth: o.strokeWidth ?? 2,
      opacity:     o.opacity     ?? 1,
    };
  };

  const inheritFromLastObject = (tool: string) => {
    const key = toolToTypeKey(tool);
    const saved = lastPropsByType.current[key];
    if (!saved) return;
    if (saved.fill && saved.fill !== 'transparent') setFillColor(saved.fill);
    if (saved.stroke && saved.stroke !== 'transparent') setStrokeColor(saved.stroke);
    setStrokeWidth(saved.strokeWidth);
    setOpacity(saved.opacity);
    const hasFill = saved.fill && saved.fill !== 'transparent';
    const hasStroke = saved.stroke && saved.stroke !== 'transparent';
    if (hasFill && hasStroke) setFillMode('both');
    else if (hasStroke) setFillMode('outline');
    else setFillMode('filled');
  };

  const selectTool = (tool: string) => {
    if (SHAPE_TOOLS.includes(tool) || tool === 'pencil') inheritFromLastObject(tool);
    setActiveTool(tool);
  };

  const createDefaultShape = (tool: string) => {
    const c = fabricRef.current;
    if (!c) return;
    const cw = logicalSizeRef.current.w;
    const ch = logicalSizeRef.current.h;
    const size = Math.min(cw, ch) * 0.25;
    const x1 = (cw - size) / 2, y1 = (ch - size) / 2;
    const x2 = x1 + size,       y2 = y1 + size;
    const shape = buildShape(
      tool, x1, y1, x2, y2,
      fillModeRef.current, fillColorRef.current,
      strokeColorRef.current, strokeWidthRef.current, opacityRef.current,
    );
    if (!shape) return;
    shape.set({ selectable: true, evented: true, _label: SHAPE_LABELS[tool] ?? '' } as any);
    c.add(shape);
    c.setActiveObject(shape);
    c.renderAll();
    pushHistory(`${SHAPE_LABELS[tool] ?? '▭'} Фігура`);
    refreshObjects();
    setActiveTool('select');
  };

  const addText = () => {
    const c = fabricRef.current;
    if (!c) return;
    const text = new fabric.Textbox('Двічі клікніть для редагування', {
      left: 80, top: 80, width: 260, fontSize: 24,
      fontFamily: 'Inter', fill: fillColor, opacity,
    });
    c.add(text);
    c.setActiveObject(text);
    c.renderAll();
    pushHistory('T Текст');
    setActiveTool('select');
  };

  const uploadImage = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const c = fabricRef.current;
    if (!c) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      fabric.Image.fromURL(dataUrl, (img) => {
        const { w, h } = logicalSizeRef.current;
        const maxDim = Math.min(w, h) * 0.5;
        img.scale(Math.min(maxDim / (img.width || maxDim), maxDim / (img.height || maxDim)));
        img.set({ left: 50, top: 50, opacity: opacityRef.current });
        img.crossOrigin = 'anonymous';
        c.add(img); c.setActiveObject(img); c.renderAll();
        pushHistory('🖼 Зображення');
        refreshObjects();
      }, { crossOrigin: 'anonymous' });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
    setActiveTool('select');
  };

  const deleteSelected = () => {
    const c = fabricRef.current;
    if (!c) return;
    suppressRef.current = true;
    c.getActiveObjects().forEach(o => c.remove(o));
    c.discardActiveObject(); c.renderAll();
    suppressRef.current = false;
    pushHistory('🗑 Видалення');
    refreshObjects();
  };
  const bringForward = () => {
    const a = fabricRef.current?.getActiveObject();
    if (a) { fabricRef.current?.bringForward(a); fabricRef.current?.renderAll(); pushHistory('⬆ Вперед'); refreshObjects(); }
  };
  const sendBackward = () => {
    const a = fabricRef.current?.getActiveObject();
    if (a) { fabricRef.current?.sendBackwards(a); fabricRef.current?.renderAll(); pushHistory('⬇ Назад'); refreshObjects(); }
  };
  const bringToFront = () => {
    const a = fabricRef.current?.getActiveObject();
    if (a) { fabricRef.current?.bringToFront(a); fabricRef.current?.renderAll(); pushHistory('⏫ На верх'); refreshObjects(); }
  };
  const sendToBack = () => {
    const a = fabricRef.current?.getActiveObject();
    if (a) { fabricRef.current?.sendToBack(a); fabricRef.current?.renderAll(); pushHistory('⏬ На низ'); refreshObjects(); }
  };

  const applyTemplateNoConfirm = (c: fabric.Canvas, tpl: any) => {
    const label = tpl.label ?? tpl.name ?? 'Шаблон';
    logicalSizeRef.current = { w: tpl.width, h: tpl.height };
    setLogicalSize({ w: tpl.width, h: tpl.height });
    const availW = window.innerWidth - 172 - 270 - 48;
    const availH = window.innerHeight - 56 - 48;
    const z = Math.max(0.1, Math.min(1, Math.min(availW / tpl.width, availH / tpl.height)));
    zoomRef.current = z; setZoom(z);
    c.setDimensions({ width: tpl.width * z, height: tpl.height * z });
    c.setViewportTransform([z,0,0,z,0,0]);
    const bg = tpl.background ?? '#ffffff';
    setBackground(bg);
    suppressRef.current = true;
    c.clear();
    c.setBackgroundColor(bg, () => {});
    const specs: any[] = tpl.objects ?? [];
    for (const spec of specs) {
      const { type, text, ...props } = spec;
      let obj: fabric.Object | null = null;
      if (type === 'rect')         obj = new fabric.Rect(props);
      else if (type === 'ellipse') obj = new fabric.Ellipse(props);
      else if (type === 'textbox') obj = new fabric.Textbox(text ?? '', props);
      else if (type === 'path')    obj = new fabric.Path(props.path ?? '', props);
      if (obj) c.add(obj);
    }
    c.renderAll();
    suppressRef.current = false;
    pushHistory(`📋 ${label}`);
    refreshObjects();
  };

  const applyTemplate = (tpl: Template | any) => {
    const c = fabricRef.current;
    if (!c) return;
    const label = tpl.label ?? tpl.name ?? 'Шаблон';
    if (!window.confirm(`Застосувати шаблон "${label}"?\nПоточний вміст буде замінено.`)) return;
    logicalSizeRef.current = { w: tpl.width, h: tpl.height };
    setLogicalSize({ w: tpl.width, h: tpl.height });
    const availW = window.innerWidth - 172 - 270 - 48;
    const availH = window.innerHeight - 56 - 48;
    const z = Math.max(0.1, Math.min(1, Math.min(availW / tpl.width, availH / tpl.height)));
    zoomRef.current = z; setZoom(z);
    c.setDimensions({ width: tpl.width * z, height: tpl.height * z });
    c.setViewportTransform([z,0,0,z,0,0]);
    const bg = tpl.background ?? tpl.canvasData?.background ?? '#ffffff';
    setBackground(bg);
    suppressRef.current = true;
    c.clear();
    c.setBackgroundColor(bg, () => {});

    if (tpl.canvasData && !tpl.objects) {
      // user template — use loadFromJSON
      const jsonData = resolveCanvasJsonUrls(tpl.canvasData);
      const safety = setTimeout(() => {
        suppressRef.current = false;
        c.renderAll();
        refreshObjects();
      }, 5000);
      c.loadFromJSON(jsonData, () => {
        clearTimeout(safety);
        const zz = zoomRef.current;
        c.setDimensions({ width: tpl.width * zz, height: tpl.height * zz });
        c.setViewportTransform([zz,0,0,zz,0,0]);
        c.renderAll();
        suppressRef.current = false;
        pushHistory(`📋 ${label}`);
        refreshObjects();
      });
    } else {
      // built-in template — create objects synchronously via constructors
      const specs: any[] = tpl.objects ?? [];
      for (const spec of specs) {
        const { type, text, ...props } = spec;
        let obj: fabric.Object | null = null;
        if (type === 'rect')    obj = new fabric.Rect(props);
        else if (type === 'ellipse')  obj = new fabric.Ellipse(props);
        else if (type === 'textbox')  obj = new fabric.Textbox(text ?? '', props);
        else if (type === 'path')     obj = new fabric.Path(props.path ?? '', props);
        if (obj) c.add(obj);
      }
      c.renderAll();
      suppressRef.current = false;
      pushHistory(`📋 ${label}`);
      refreshObjects();
    }
    setShowTemplates(false);
  };

  const applyCustomSize = (w: number, h: number) => {
    const c = fabricRef.current;
    if (!c) return;
    if (!window.confirm(`Змінити розмір полотна на ${w}×${h} px?\nОб'єкти залишаться, але можуть виходити за межі.`)) return;
    logicalSizeRef.current = { w, h };
    setLogicalSize({ w, h });
    const z = zoomRef.current;
    c.setDimensions({ width: w * z, height: h * z });
    c.setViewportTransform([z,0,0,z,0,0]);
    c.renderAll();
    pushHistory(`📐 ${w}×${h}`);
    setShowTemplates(false);
  };

  const generateThumbnail = (c: fabric.Canvas): Promise<Blob> =>
    new Promise((res, rej) => {
      const active = c.getActiveObject();
      c.discardActiveObject(); c.renderAll();
      const url = c.toDataURL({ format: 'jpeg', quality: 0.75, multiplier: 0.35 / zoomRef.current });
      if (active) { c.setActiveObject(active); c.renderAll(); }
      fetch(url).then(r => r.blob()).then(res).catch(rej);
    });

  const saveDesign = async (): Promise<string | null> => {
    const c = fabricRef.current;
    if (!c) return null;
    setSaving(true);
    const canvasData = c.toJSON(['_label', '_locked', '_isSticker']);
    try {
      let savedId: string;
      if (design) {
        await api.patch(`/designs/${design.id}`, { title, width: logicalSizeRef.current.w, height: logicalSizeRef.current.h, canvasData });
        savedId = design.id;
      } else {
        const { data } = await api.post('/designs', { title, width: logicalSizeRef.current.w, height: logicalSizeRef.current.h, canvasData });
        setDesign(data);
        savedId = data.id;
        navigate(`/editor/${data.id}`, { replace: true });
      }
      await generateThumbnail(c).then(blob => new Promise<void>(resolve => {
        const reader = new FileReader();
        reader.onload = () => {
          const dataUrl = reader.result as string;
          api.patch(`/designs/${savedId}/thumbnail`, { thumbnail: dataUrl }).finally(resolve);
        };
        reader.onerror = () => resolve();
        reader.readAsDataURL(blob);
      })).catch(() => {});
      isDirtyRef.current = false;
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      return savedId;
    } finally {
      setSaving(false);
    }
    return null;
  };

  const togglePublic = async (pub: boolean) => {
    let targetId = design?.id;
    if (!targetId) {
      targetId = (await saveDesign()) ?? undefined;
    }
    if (!targetId) return;
    await api.patch(`/designs/${targetId}`, { isPublic: pub });
    setIsPublic(pub);
    setDesign(prev => prev ? { ...prev, isPublic: pub } : prev);
  };

  const addSticker = (emoji: string) => {
    const c = fabricRef.current;
    if (!c) return;
    const text = new fabric.Text(emoji, {
      left: 120, top: 120, fontSize: 64,
      selectable: true, evented: true,
      _isSticker: true,
    } as any);
    c.add(text);
    c.setActiveObject(text);
    c.renderAll();
    pushHistory(`${emoji} Стікер`);
    refreshObjects();
  };

  const loadUserTemplates = useCallback(async () => {
    try {
      const { data } = await api.get('/templates/mine');
      setUserTemplates(data);
    } catch {
      setUserTemplates([]);
    }
  }, []);

  const saveAsTemplate = async (nameOverride?: string) => {
    const c = fabricRef.current;
    if (!c) return;
    const name = nameOverride ?? window.prompt('Назва шаблону:', title);
    if (!name) return;
    setSavingTemplate(true);
    try {
      const canvasData = c.toJSON(['_label', '_locked', '_isSticker']);
      const thumbnail  = c.toDataURL({ format: 'jpeg', quality: 0.7, multiplier: 0.3 / zoomRef.current });
      await api.post('/templates', {
        name,
        width:  logicalSizeRef.current.w,
        height: logicalSizeRef.current.h,
        canvasData,
        thumbnail,
      });
      await loadUserTemplates();
    } catch {
      window.alert('Помилка збереження шаблону');
    } finally {
      setSavingTemplate(false);
    }
  };

  const deleteUserTemplate = async (id: string) => {
    if (!window.confirm('Видалити цей шаблон?')) return;
    try {
      await api.delete(`/templates/${id}`);
      setUserTemplates(prev => prev.filter(t => t.id !== id));
    } catch {
      window.alert('Помилка видалення шаблону');
    }
  };

  const exportAs = (format: 'png' | 'jpeg' | 'svg' | 'pdf') => {
    const c = fabricRef.current;
    if (!c) return;

    if (format === 'svg') {
      const { w, h } = logicalSizeRef.current;
      const z = zoomRef.current;
      c.setZoom(1);
      c.setViewportTransform([1, 0, 0, 1, 0, 0]);
      c.setDimensions({ width: w, height: h });
      const svg = c.toSVG();
      c.setZoom(z);
      c.setViewportTransform([z, 0, 0, z, 0, 0]);
      c.setDimensions({ width: w * z, height: h * z });
      c.renderAll();
      const blob = new Blob([svg], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `${title}.svg`; a.click();
      URL.revokeObjectURL(url);
      return;
    }

    if (format === 'pdf') {
      const { w, h } = logicalSizeRef.current;
      const url = c.toDataURL({ format: 'png', quality: 1, multiplier: 1 / zoomRef.current });
      const img = new Image();
      img.onload = () => {
        const cvs = document.createElement('canvas');
        cvs.width = w; cvs.height = h;
        const ctx = cvs.getContext('2d')!;
        ctx.drawImage(img, 0, 0, w, h);
        const printFrame = document.createElement('iframe');
        printFrame.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;border:none;z-index:99999;visibility:hidden';
        document.body.appendChild(printFrame);
        const doc = printFrame.contentDocument!;
        doc.open();
        doc.write(`<!DOCTYPE html><html><head><style>
          @page{size:${w}px ${h}px;margin:0}
          body{margin:0;padding:0;width:${w}px;height:${h}px;overflow:hidden}
          img{width:${w}px;height:${h}px;display:block;object-fit:contain}
        </style></head><body><img src="${url}"/></body></html>`);
        doc.close();
        printFrame.contentWindow!.focus();
        setTimeout(() => {
          printFrame.style.visibility = 'visible';
          printFrame.contentWindow!.print();
          setTimeout(() => document.body.removeChild(printFrame), 1000);
        }, 300);
      };
      img.src = url;
      return;
    }

    const url = c.toDataURL({ format, quality: 0.92, multiplier: 1 / zoomRef.current });
    const a = document.createElement('a');
    a.href = url; a.download = `${title}.${format === 'jpeg' ? 'jpg' : 'png'}`;
    a.click();
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#1a1a2e' }}>
      <div style={{
        height: 52, background: '#12121f', borderBottom: '1px solid #2d2d45',
        display: 'flex', alignItems: 'center', padding: '0 14px', gap: 10, flexShrink: 0,
      }}>
        <Link to="/dashboard"
          onClick={(e) => {
            if (isDirtyRef.current) {
              e.preventDefault();
              saveDesign().then(() => navigate('/dashboard'));
            }
          }}
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <LogoMark size={24} />
        </Link>
        <span style={{ color: '#555' }}>›</span>
        <input value={title} onChange={(e) => setTitle(e.target.value)}
          style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: 14, fontWeight: 500, outline: 'none', minWidth: 120, maxWidth: 240 }} />
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 12, color: '#555' }}>Ctrl+колесо — масштаб</span>
        {(['png','jpeg','svg','pdf'] as const).map(fmt => (
          <button key={fmt} onClick={() => exportAs(fmt)} style={{ background: '#2d2d42', border: 'none', color: '#aaa', padding: '5px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>
            {fmt.toUpperCase()}
          </button>
        ))}
        <button onClick={() => setShowShare(true)}
          style={{ background: '#2d2d42', border: 'none', color: '#aaa', padding: '5px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
          🔗 Поширити
        </button>
        <button onClick={() => saveAsTemplate(undefined)} disabled={savingTemplate}
          title="Зберегти як мій шаблон"
          style={{ background: '#2d2d42', border: 'none', color: '#aaa', padding: '5px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
          {savingTemplate ? <span className="spinner" style={{ width: 12, height: 12, borderWidth: 2 }} /> : '📋'} Шаблон
        </button>
        <button onClick={saveDesign} disabled={saving} className="btn btn-primary btn-sm" style={{ minWidth: 80, justifyContent: 'center' }}>
          {saving ? <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> : saved ? '✓ Збережено' : 'Зберегти'}
        </button>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <Toolbar
          activeTool={activeTool} setActiveTool={selectTool} onQuickCreate={createDefaultShape}
          onAddText={addText} onUploadImage={uploadImage}
          onDelete={deleteSelected} onUndo={undo} onRedo={redo}
          onBringForward={bringForward} onSendBackward={sendBackward}
          onBringToFront={bringToFront} onSendToBack={sendToBack}
          onToggleTemplates={() => { setShowTemplates(v => { if (!v) loadUserTemplates(); return !v; }); setShowStickers(false); }}
          templatesOpen={showTemplates}
          onToggleStickers={() => { setShowStickers(v => !v); setShowTemplates(false); }}
          stickersOpen={showStickers}
        />

        {showStickers && (
          <StickersPanel
            onAddSticker={addSticker}
            onClose={() => setShowStickers(false)}
          />
        )}

        {showTemplates && (
          <TemplatesPanel
            onApply={applyTemplate}
            onApplyCustom={applyCustomSize}
            onClose={() => setShowTemplates(false)}
            userTemplates={userTemplates}
            onSaveAsTemplate={() => saveAsTemplate(undefined)}
            onDeleteUserTemplate={deleteUserTemplate}
            savingTemplate={savingTemplate}
          />
        )}

        <LayersPanel
          canvas={fabricRef.current}
          objects={objects}
          selectedObject={selectedObject}
          onSelect={(obj) => setSelectedObject(obj)}
          onRefresh={refreshObjects}
          onReorder={() => pushHistory('↕ Шари')}
        />

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div
            ref={canvasWrapRef}
            style={{
              flex: 1, overflow: 'auto',
              display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start',
              background: '#2d2d3e', padding: 40,
            }}
          >
            <div style={{ boxShadow: '0 8px 48px rgba(0,0,0,.5)', flexShrink: 0, display: 'inline-block' }}>
              <canvas ref={canvasRef} />
            </div>
          </div>
        </div>

        <PropertiesPanel
          selectedObject={selectedObject}
          canvas={fabricRef.current}
          onUpdate={() => {
            const active = fabricRef.current?.getActiveObject();
            if (active) saveObjProps(active);
            refreshObjects();
          }}
          background={background}
          onBackgroundChange={handleBackgroundChange}
          historySteps={historyState.labels}
          historyIndex={historyState.index}
          onJumpHistory={jumpHistory}
          toolProps={{
            activeTool,
            fillColor,    setFillColor,
            strokeColor,  setStrokeColor,
            strokeWidth,  setStrokeWidth,
            fillMode,     setFillMode,
            opacity,      setOpacity,
            brushSize,    setBrushSize,
          }}
        />
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />

      {showShare && (
        <ShareModal
          designId={design?.id || ''}
          title={title}
          thumbnail={design?.thumbnail}
          isPublic={isPublic}
          onTogglePublic={togglePublic}
          onClose={() => setShowShare(false)}
        />
      )}

      <div style={{ height: 26, background: '#12121f', borderTop: '1px solid #2d2d45', display: 'flex', alignItems: 'center', padding: '0 14px', gap: 16 }}>
        <span style={{ fontSize: 11, color: '#555' }}>{logicalSize.w} × {logicalSize.h} px</span>
        <span style={{ fontSize: 11, color: '#555' }}>{Math.round(zoom * 100)}%</span>
        <span style={{ fontSize: 11, color: '#555' }}>{objects.length} об'єктів</span>
        {selectedObject && <span style={{ fontSize: 11, color: '#555' }}>Вибрано: {selectedObject.type}</span>}
        <span style={{ fontSize: 11, color: '#444', marginLeft: 'auto' }}>
          Ctrl+Z/Y — крок назад/вперед · Ctrl+S — зберегти · Del — видалити · Shift+drag — пропорційно
        </span>
      </div>
    </div>
  );
}
