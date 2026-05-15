export interface Template {
  id: string;
  label: string;
  category: string;
  width: number;
  height: number;
  background: string;
  thumb: string;
  objects: object[];
}

const enc = (svg: string) =>
  `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;

export const TEMPLATES: Template[] = [
  // ── Базові ────────────────────────────────────────────────────
  {
    id: 'blank',
    label: 'Чистий аркуш',
    category: 'Базові',
    width: 800, height: 600,
    background: '#ffffff',
    objects: [],
    thumb: enc(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120">
      <rect width="160" height="120" fill="#fff" stroke="#ddd" stroke-width="2"/>
      <text x="80" y="66" text-anchor="middle" fill="#ccc" font-size="11" font-family="sans-serif">Порожній</text>
    </svg>`),
  },
  {
    id: 'presentation',
    label: 'Презентація',
    category: 'Базові',
    width: 960, height: 540,
    background: '#f8f8fc',
    objects: [
      { type:'rect', left:0, top:0, width:960, height:100, fill:'#6c63ff', stroke:null, strokeWidth:1, angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:60, top:24, width:840, height:52, text:'Заголовок презентації', fontSize:38, fontFamily:'Inter', fontWeight:'bold', fill:'#ffffff', textAlign:'left', angle:0, opacity:1, selectable:true, evented:true },
      { type:'rect', left:40, top:140, width:420, height:340, fill:'#ffffff', stroke:'#e0e0e0', strokeWidth:1, rx:8, ry:8, angle:0, opacity:1, selectable:true, evented:true },
      { type:'rect', left:500, top:140, width:420, height:340, fill:'#ffffff', stroke:'#e0e0e0', strokeWidth:1, rx:8, ry:8, angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:60, top:160, width:380, height:30, text:'Секція 1', fontSize:22, fontFamily:'Inter', fontWeight:'bold', fill:'#6c63ff', angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:60, top:200, width:380, height:80, text:'Опис першої секції або список пунктів для вашої презентації.', fontSize:16, fontFamily:'Inter', fill:'#555555', angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:520, top:160, width:380, height:30, text:'Секція 2', fontSize:22, fontFamily:'Inter', fontWeight:'bold', fill:'#6c63ff', angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:520, top:200, width:380, height:80, text:'Опис другої секції або список пунктів для вашої презентації.', fontSize:16, fontFamily:'Inter', fill:'#555555', angle:0, opacity:1, selectable:true, evented:true },
    ],
    thumb: enc(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 90">
      <rect width="160" height="90" fill="#f8f8fc"/>
      <rect x="0" y="0" width="160" height="22" fill="#6c63ff"/>
      <text x="80" y="15" text-anchor="middle" fill="#fff" font-size="8" font-family="sans-serif" font-weight="bold">Презентація</text>
      <rect x="8" y="30" width="68" height="52" fill="#fff" stroke="#e0e0e0" stroke-width="0.5" rx="3"/>
      <rect x="84" y="30" width="68" height="52" fill="#fff" stroke="#e0e0e0" stroke-width="0.5" rx="3"/>
      <text x="14" y="44" fill="#6c63ff" font-size="6" font-family="sans-serif" font-weight="bold">Секція 1</text>
      <text x="90" y="44" fill="#6c63ff" font-size="6" font-family="sans-serif" font-weight="bold">Секція 2</text>
    </svg>`),
  },
  {
    id: 'mindmap',
    label: 'Схема / Mind Map',
    category: 'Базові',
    width: 1000, height: 700,
    background: '#fafafa',
    objects: [
      { type:'ellipse', left:500, top:350, rx:90, ry:55, fill:'#6c63ff', stroke:null, strokeWidth:1, angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:500, top:350, width:160, height:40, text:'ГОЛОВНА ІДЕЯ', fontSize:16, fontFamily:'Inter', fontWeight:'bold', fill:'#ffffff', textAlign:'center', angle:0, opacity:1, selectable:true, evented:true },
      { type:'ellipse', left:200, top:180, rx:70, ry:42, fill:'#ff6b6b', stroke:null, strokeWidth:1, angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:200, top:180, width:120, height:35, text:'Ідея 1', fontSize:14, fontFamily:'Inter', fontWeight:'bold', fill:'#ffffff', textAlign:'center', angle:0, opacity:1, selectable:true, evented:true },
      { type:'ellipse', left:800, top:180, rx:70, ry:42, fill:'#16a085', stroke:null, strokeWidth:1, angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:800, top:180, width:120, height:35, text:'Ідея 2', fontSize:14, fontFamily:'Inter', fontWeight:'bold', fill:'#ffffff', textAlign:'center', angle:0, opacity:1, selectable:true, evented:true },
      { type:'ellipse', left:180, top:520, rx:70, ry:42, fill:'#f39c12', stroke:null, strokeWidth:1, angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:180, top:520, width:120, height:35, text:'Ідея 3', fontSize:14, fontFamily:'Inter', fontWeight:'bold', fill:'#ffffff', textAlign:'center', angle:0, opacity:1, selectable:true, evented:true },
      { type:'ellipse', left:820, top:520, rx:70, ry:42, fill:'#8e44ad', stroke:null, strokeWidth:1, angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:820, top:520, width:120, height:35, text:'Ідея 4', fontSize:14, fontFamily:'Inter', fontWeight:'bold', fill:'#ffffff', textAlign:'center', angle:0, opacity:1, selectable:true, evented:true },
    ],
    thumb: enc(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 112">
      <rect width="160" height="112" fill="#fafafa"/>
      <ellipse cx="80" cy="56" rx="28" ry="17" fill="#6c63ff"/>
      <text x="80" y="60" text-anchor="middle" fill="#fff" font-size="6" font-family="sans-serif" font-weight="bold">ІДЕЯ</text>
      <line x1="80" y1="39" x2="42" y2="25" stroke="#ccc" stroke-width="1"/>
      <line x1="80" y1="39" x2="118" y2="25" stroke="#ccc" stroke-width="1"/>
      <line x1="80" y1="73" x2="38" y2="87" stroke="#ccc" stroke-width="1"/>
      <line x1="80" y1="73" x2="122" y2="87" stroke="#ccc" stroke-width="1"/>
      <ellipse cx="42" cy="22" rx="18" ry="11" fill="#ff6b6b"/>
      <ellipse cx="118" cy="22" rx="18" ry="11" fill="#16a085"/>
      <ellipse cx="38" cy="90" rx="18" ry="11" fill="#f39c12"/>
      <ellipse cx="122" cy="90" rx="18" ry="11" fill="#8e44ad"/>
    </svg>`),
  },

  // ── Публікації ────────────────────────────────────────────────
  {
    id: 'social',
    label: 'Соц. мережа',
    category: 'Публікації',
    width: 800, height: 800,
    background: '#6c63ff',
    objects: [
      { type:'rect', left:40, top:40, width:720, height:720, fill:'transparent', stroke:'rgba(255,255,255,0.25)', strokeWidth:2, rx:16, ry:16, angle:0, opacity:1, selectable:true, evented:true },
      { type:'ellipse', left:390, top:270, rx:110, ry:110, fill:'rgba(255,255,255,0.12)', stroke:null, strokeWidth:1, angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:80, top:340, width:640, height:80, text:'ВАШ ЗАГОЛОВОК', fontSize:56, fontFamily:'Inter', fontWeight:'bold', fill:'#ffffff', textAlign:'center', angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:120, top:440, width:560, height:60, text:'Підзаголовок або короткий опис публікації', fontSize:22, fontFamily:'Inter', fill:'rgba(255,255,255,0.8)', textAlign:'center', angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:300, top:660, width:200, height:30, text:'@yourhandle', fontSize:20, fontFamily:'Inter', fill:'rgba(255,255,255,0.6)', textAlign:'center', angle:0, opacity:1, selectable:true, evented:true },
    ],
    thumb: enc(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
      <rect width="120" height="120" fill="#6c63ff"/>
      <rect x="8" y="8" width="104" height="104" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1.5" rx="4"/>
      <circle cx="60" cy="42" r="22" fill="rgba(255,255,255,0.15)"/>
      <text x="60" y="76" text-anchor="middle" fill="#fff" font-size="10" font-family="sans-serif" font-weight="bold">ЗАГОЛОВОК</text>
      <text x="60" y="90" text-anchor="middle" fill="rgba(255,255,255,0.7)" font-size="7" font-family="sans-serif">Підзаголовок</text>
    </svg>`),
  },
  {
    id: 'poster',
    label: 'Постер',
    category: 'Публікації',
    width: 600, height: 840,
    background: '#ff6b6b',
    objects: [
      { type:'rect', left:0, top:560, width:600, height:280, fill:'rgba(0,0,0,0.3)', stroke:null, strokeWidth:1, angle:0, opacity:1, selectable:true, evented:true },
      { type:'ellipse', left:300, top:260, rx:200, ry:200, fill:'rgba(255,255,255,0.1)', stroke:null, strokeWidth:1, angle:0, opacity:1, selectable:true, evented:true },
      { type:'ellipse', left:420, top:180, rx:120, ry:120, fill:'rgba(255,255,255,0.08)', stroke:null, strokeWidth:1, angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:40, top:580, width:520, height:70, text:'НАЗВА ЗАХОДУ', fontSize:54, fontFamily:'Inter', fontWeight:'bold', fill:'#ffffff', textAlign:'center', angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:60, top:666, width:480, height:40, text:'Підзаголовок або опис заходу', fontSize:24, fontFamily:'Inter', fill:'rgba(255,255,255,0.85)', textAlign:'center', angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:60, top:720, width:480, height:35, text:'Дата  ·  Місце  ·  Квитки', fontSize:20, fontFamily:'Inter', fill:'rgba(255,255,255,0.7)', textAlign:'center', angle:0, opacity:1, selectable:true, evented:true },
    ],
    thumb: enc(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 126">
      <rect width="90" height="126" fill="#ff6b6b"/>
      <rect x="0" y="80" width="90" height="46" fill="rgba(0,0,0,0.3)"/>
      <circle cx="45" cy="42" r="28" fill="rgba(255,255,255,0.12)"/>
      <circle cx="60" cy="28" r="16" fill="rgba(255,255,255,0.08)"/>
      <text x="45" y="96" text-anchor="middle" fill="#fff" font-size="9" font-family="sans-serif" font-weight="bold">ПОСТЕР</text>
      <text x="45" y="109" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-size="6" font-family="sans-serif">Захід · Дата · Місце</text>
    </svg>`),
  },
  {
    id: 'instagram-story',
    label: 'Instagram Story',
    category: 'Публікації',
    width: 750, height: 1334,
    background: '#833ab4',
    objects: [
      { type:'ellipse', left:280, top:280, rx:400, ry:400, fill:'rgba(253,29,29,0.3)', stroke:null, strokeWidth:1, angle:0, opacity:1, selectable:true, evented:true },
      { type:'ellipse', left:700, top:1150, rx:350, ry:350, fill:'rgba(252,176,69,0.2)', stroke:null, strokeWidth:1, angle:0, opacity:1, selectable:true, evented:true },
      { type:'rect', left:40, top:560, width:670, height:220, fill:'rgba(0,0,0,0.35)', stroke:null, strokeWidth:1, rx:20, ry:20, angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:60, top:575, width:630, height:80, text:'ВАША ІСТОРІЯ', fontSize:58, fontFamily:'Inter', fontWeight:'bold', fill:'#ffffff', textAlign:'center', angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:60, top:670, width:630, height:40, text:'Поділіться моментом з підписниками', fontSize:24, fontFamily:'Inter', fill:'rgba(255,255,255,0.85)', textAlign:'center', angle:0, opacity:1, selectable:true, evented:true },
      { type:'rect', left:250, top:820, width:250, height:60, fill:'#ffffff', stroke:null, strokeWidth:1, rx:30, ry:30, angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:262, top:833, width:226, height:34, text:'Дізнатись більше', fontSize:20, fontFamily:'Inter', fontWeight:'bold', fill:'#833ab4', textAlign:'center', angle:0, opacity:1, selectable:true, evented:true },
    ],
    thumb: enc(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 75 133">
      <defs>
        <linearGradient id="ig" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#833ab4"/>
          <stop offset="50%" stop-color="#fd1d1d"/>
          <stop offset="100%" stop-color="#fcb045"/>
        </linearGradient>
      </defs>
      <rect width="75" height="133" fill="url(#ig)"/>
      <circle cx="10" cy="10" r="35" fill="rgba(253,29,29,0.25)"/>
      <circle cx="60" cy="100" r="30" fill="rgba(252,176,69,0.2)"/>
      <rect x="6" y="56" width="63" height="28" fill="rgba(0,0,0,0.35)" rx="5"/>
      <text x="37" y="70" text-anchor="middle" fill="#fff" font-size="8" font-family="sans-serif" font-weight="bold">ІСТОРІЯ</text>
      <text x="37" y="79" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-size="5" font-family="sans-serif">Ваш текст тут</text>
      <rect x="22" y="92" width="31" height="10" fill="#fff" rx="5"/>
      <text x="37" y="100" text-anchor="middle" fill="#833ab4" font-size="5" font-family="sans-serif" font-weight="bold">Детальніше</text>
    </svg>`),
  },
  {
    id: 'flyer',
    label: 'Флаєр',
    category: 'Публікації',
    width: 600, height: 800,
    background: '#0f3460',
    objects: [
      { type:'rect', left:0, top:0, width:600, height:260, fill:'#16213e', stroke:null, strokeWidth:1, angle:0, opacity:1, selectable:true, evented:true },
      { type:'ellipse', left:300, top:130, rx:150, ry:150, fill:'rgba(22,160,133,0.15)', stroke:null, strokeWidth:1, angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:40, top:80, width:520, height:130, text:'ПОДІЯ МІСЯЦЯ', fontSize:62, fontFamily:'Inter', fontWeight:'bold', fill:'#ffffff', textAlign:'center', angle:0, opacity:1, selectable:true, evented:true },
      { type:'rect', left:200, top:257, width:200, height:6, fill:'#16a085', stroke:null, strokeWidth:1, rx:3, ry:3, angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:40, top:285, width:520, height:70, text:'Короткий та яскравий опис події що зацікавить вашу аудиторію', fontSize:22, fontFamily:'Inter', fill:'rgba(255,255,255,0.8)', textAlign:'center', angle:0, opacity:1, selectable:true, evented:true },
      { type:'rect', left:40, top:620, width:520, height:100, fill:'rgba(22,160,133,0.2)', stroke:null, strokeWidth:1, rx:12, ry:12, angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:60, top:638, width:480, height:30, text:'15 листопада 2025', fontSize:22, fontFamily:'Inter', fill:'#16a085', angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:60, top:670, width:480, height:30, text:'Київ, вул. Хрещатик 1', fontSize:20, fontFamily:'Inter', fill:'rgba(255,255,255,0.7)', angle:0, opacity:1, selectable:true, evented:true },
      { type:'rect', left:175, top:735, width:250, height:50, fill:'#16a085', stroke:null, strokeWidth:1, rx:25, ry:25, angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:185, top:748, width:230, height:30, text:'Зареєструватись', fontSize:19, fontFamily:'Inter', fontWeight:'bold', fill:'#ffffff', textAlign:'center', angle:0, opacity:1, selectable:true, evented:true },
    ],
    thumb: enc(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 120">
      <rect width="90" height="120" fill="#0f3460"/>
      <rect x="0" y="0" width="90" height="45" fill="#16213e"/>
      <circle cx="45" cy="22" r="20" fill="rgba(22,160,133,0.2)"/>
      <text x="45" y="19" text-anchor="middle" fill="#fff" font-size="10" font-family="sans-serif" font-weight="bold">ФЛАЄР</text>
      <text x="45" y="32" text-anchor="middle" fill="#fff" font-size="8" font-family="sans-serif" font-weight="bold">ПОДІЇ</text>
      <rect x="30" y="44" width="30" height="3" fill="#16a085" rx="1"/>
      <text x="45" y="62" text-anchor="middle" fill="rgba(255,255,255,0.7)" font-size="6" font-family="sans-serif">Опис події та деталі</text>
      <rect x="8" y="90" width="74" height="18" fill="rgba(22,160,133,0.3)" rx="4"/>
      <text x="45" y="103" text-anchor="middle" fill="#16a085" font-size="6" font-family="sans-serif">Дата  Місце</text>
    </svg>`),
  },

  // ── Банери ────────────────────────────────────────────────────
  {
    id: 'banner',
    label: 'Широкий банер',
    category: 'Банери',
    width: 1200, height: 400,
    background: '#1a1a2e',
    objects: [
      { type:'rect', left:0, top:0, width:360, height:400, fill:'#6c63ff', stroke:null, strokeWidth:1, angle:0, opacity:1, selectable:true, evented:true },
      { type:'ellipse', left:200, top:200, rx:120, ry:120, fill:'rgba(255,255,255,0.08)', stroke:null, strokeWidth:1, angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:400, top:120, width:700, height:70, text:'Ваш рекламний банер', fontSize:50, fontFamily:'Inter', fontWeight:'bold', fill:'#ffffff', angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:400, top:205, width:700, height:40, text:'Короткий опис або заклик до дії', fontSize:24, fontFamily:'Inter', fill:'rgba(255,255,255,0.7)', angle:0, opacity:1, selectable:true, evented:true },
      { type:'rect', left:400, top:280, width:200, height:56, fill:'#6c63ff', stroke:null, strokeWidth:1, rx:28, ry:28, angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:420, top:294, width:160, height:30, text:'Детальніше', fontSize:19, fontFamily:'Inter', fill:'#ffffff', textAlign:'center', angle:0, opacity:1, selectable:true, evented:true },
    ],
    thumb: enc(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 53">
      <rect width="160" height="53" fill="#1a1a2e"/>
      <rect x="0" y="0" width="48" height="53" fill="#6c63ff"/>
      <circle cx="24" cy="26" r="16" fill="rgba(255,255,255,0.1)"/>
      <text x="65" y="22" fill="#fff" font-size="9" font-family="sans-serif" font-weight="bold">БАНЕР</text>
      <text x="65" y="34" fill="rgba(255,255,255,0.6)" font-size="6" font-family="sans-serif">Опис або заклик</text>
      <rect x="65" y="39" width="38" height="9" fill="#6c63ff" rx="4"/>
    </svg>`),
  },
  {
    id: 'youtube',
    label: 'YouTube обкладинка',
    category: 'Банери',
    width: 1280, height: 720,
    background: '#0a0a0a',
    objects: [
      { type:'rect', left:0, top:0, width:420, height:720, fill:'#ff0000', stroke:null, strokeWidth:1, angle:0, opacity:1, selectable:true, evented:true },
      { type:'ellipse', left:240, top:380, rx:180, ry:180, fill:'rgba(255,255,255,0.06)', stroke:null, strokeWidth:1, angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:460, top:180, width:780, height:200, text:'НАЗВА КАНАЛУ', fontSize:94, fontFamily:'Inter', fontWeight:'bold', fill:'#ffffff', angle:0, opacity:1, selectable:true, evented:true },
      { type:'rect', left:460, top:395, width:780, height:4, fill:'#ff0000', stroke:null, strokeWidth:1, angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:460, top:415, width:780, height:50, text:'Підписуйтесь та натискайте дзвіночок', fontSize:30, fontFamily:'Inter', fill:'rgba(255,255,255,0.7)', angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:460, top:475, width:780, height:45, text:'Новий відеоролик щотижня', fontSize:26, fontFamily:'Inter', fill:'rgba(255,255,255,0.5)', angle:0, opacity:1, selectable:true, evented:true },
    ],
    thumb: enc(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 90">
      <rect width="160" height="90" fill="#0a0a0a"/>
      <rect x="0" y="0" width="52" height="90" fill="#ff0000"/>
      <text x="26" y="50" text-anchor="middle" fill="rgba(255,255,255,0.3)" font-size="24" font-family="sans-serif">&#9654;</text>
      <text x="82" y="36" fill="#fff" font-size="11" font-family="sans-serif" font-weight="bold">КАНАЛ</text>
      <rect x="60" y="50" width="94" height="2" fill="#ff0000"/>
      <text x="82" y="63" fill="rgba(255,255,255,0.6)" font-size="6" font-family="sans-serif">Підписуйтесь</text>
      <text x="82" y="74" fill="rgba(255,255,255,0.4)" font-size="5.5" font-family="sans-serif">Новий відео щотижня</text>
    </svg>`),
  },
  {
    id: 'email',
    label: 'Email банер',
    category: 'Банери',
    width: 600, height: 220,
    background: '#6c63ff',
    objects: [
      { type:'ellipse', left:580, top:-40, rx:180, ry:180, fill:'rgba(255,255,255,0.07)', stroke:null, strokeWidth:1, angle:0, opacity:1, selectable:true, evented:true },
      { type:'rect', left:0, top:160, width:600, height:60, fill:'rgba(0,0,0,0.2)', stroke:null, strokeWidth:1, angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:40, top:48, width:380, height:50, text:'Спеціальна пропозиція!', fontSize:34, fontFamily:'Inter', fontWeight:'bold', fill:'#ffffff', angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:40, top:105, width:380, height:40, text:'Знижка 30% на всі товари до кінця місяця', fontSize:17, fontFamily:'Inter', fill:'rgba(255,255,255,0.85)', angle:0, opacity:1, selectable:true, evented:true },
      { type:'rect', left:440, top:68, width:130, height:44, fill:'#ffffff', stroke:null, strokeWidth:1, rx:22, ry:22, angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:448, top:80, width:114, height:22, text:'Купити', fontSize:15, fontFamily:'Inter', fontWeight:'bold', fill:'#6c63ff', textAlign:'center', angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:40, top:172, width:520, height:25, text:'2025 Ваша Компанія  ·  Відписатись', fontSize:12, fontFamily:'Inter', fill:'rgba(255,255,255,0.5)', textAlign:'center', angle:0, opacity:1, selectable:true, evented:true },
    ],
    thumb: enc(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 59">
      <rect width="160" height="59" fill="#6c63ff"/>
      <rect x="0" y="43" width="160" height="16" fill="rgba(0,0,0,0.2)"/>
      <circle cx="130" cy="10" r="30" fill="rgba(255,255,255,0.07)"/>
      <text x="14" y="22" fill="#fff" font-size="8.5" font-family="sans-serif" font-weight="bold">Спеціальна пропозиція!</text>
      <text x="14" y="33" fill="rgba(255,255,255,0.8)" font-size="6" font-family="sans-serif">Знижка 30% на всі товари</text>
      <rect x="118" y="15" width="34" height="14" fill="#fff" rx="7"/>
      <text x="135" y="25" text-anchor="middle" fill="#6c63ff" font-size="6" font-family="sans-serif" font-weight="bold">Купити</text>
    </svg>`),
  },

  // ── Бізнес ────────────────────────────────────────────────────
  {
    id: 'bizcard',
    label: 'Візитка',
    category: 'Бізнес',
    width: 900, height: 500,
    background: '#2d2d45',
    objects: [
      { type:'rect', left:0, top:0, width:300, height:500, fill:'#6c63ff', stroke:null, strokeWidth:1, angle:0, opacity:1, selectable:true, evented:true },
      { type:'ellipse', left:140, top:220, rx:80, ry:80, fill:'rgba(255,255,255,0.15)', stroke:null, strokeWidth:1, angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:10, top:200, width:280, height:70, text:'ВА', fontSize:56, fontFamily:'Inter', fontWeight:'bold', fill:'rgba(255,255,255,0.4)', textAlign:'center', angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:340, top:130, width:500, height:60, text:"Ваше Ім'я", fontSize:42, fontFamily:'Inter', fontWeight:'bold', fill:'#ffffff', angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:340, top:195, width:500, height:40, text:'Посада / Компанія', fontSize:24, fontFamily:'Inter', fill:'rgba(255,255,255,0.6)', angle:0, opacity:1, selectable:true, evented:true },
      { type:'rect', left:340, top:246, width:460, height:2, fill:'rgba(255,255,255,0.2)', stroke:null, strokeWidth:1, angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:340, top:265, width:220, height:25, text:'email@example.com', fontSize:17, fontFamily:'Inter', fill:'rgba(255,255,255,0.7)', angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:560, top:265, width:240, height:25, text:'+38 (000) 000-00-00', fontSize:17, fontFamily:'Inter', fill:'rgba(255,255,255,0.7)', angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:340, top:300, width:460, height:25, text:'вул. Прикладна 1, Київ, Україна', fontSize:15, fontFamily:'Inter', fill:'rgba(255,255,255,0.5)', angle:0, opacity:1, selectable:true, evented:true },
    ],
    thumb: enc(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 89">
      <rect width="160" height="89" fill="#2d2d45"/>
      <rect x="0" y="0" width="48" height="89" fill="#6c63ff"/>
      <circle cx="24" cy="44" r="16" fill="rgba(255,255,255,0.2)"/>
      <text x="24" y="49" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-size="10" font-family="sans-serif" font-weight="bold">ВА</text>
      <text x="58" y="36" fill="#fff" font-size="9" font-family="sans-serif" font-weight="bold">Ваше Ім'я</text>
      <text x="58" y="49" fill="rgba(255,255,255,0.6)" font-size="6" font-family="sans-serif">Посада · Компанія</text>
      <line x1="58" y1="55" x2="150" y2="55" stroke="rgba(255,255,255,0.2)" stroke-width="0.8"/>
      <text x="58" y="65" fill="rgba(255,255,255,0.5)" font-size="5.5" font-family="sans-serif">email@example.com</text>
      <text x="58" y="75" fill="rgba(255,255,255,0.5)" font-size="5.5" font-family="sans-serif">+38 (000) 000-00-00</text>
    </svg>`),
  },
  {
    id: 'logo',
    label: 'Логотип',
    category: 'Бізнес',
    width: 500, height: 500,
    background: '#ffffff',
    objects: [
      { type:'ellipse', left:250, top:230, rx:150, ry:150, fill:'none', stroke:'#6c63ff', strokeWidth:8, angle:0, opacity:1, selectable:true, evented:true },
      { type:'ellipse', left:250, top:230, rx:98, ry:98, fill:'#6c63ff', stroke:null, strokeWidth:1, angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:50, top:360, width:400, height:55, text:'КОМПАНІЯ', fontSize:40, fontFamily:'Inter', fontWeight:'bold', fill:'#1a1a2e', textAlign:'center', angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:80, top:418, width:340, height:28, text:'TAGLINE · SINCE 2024', fontSize:16, fontFamily:'Inter', fill:'#888888', textAlign:'center', angle:0, opacity:1, selectable:true, evented:true },
    ],
    thumb: enc(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect width="100" height="100" fill="#fff"/>
      <circle cx="50" cy="42" r="28" fill="none" stroke="#6c63ff" stroke-width="4"/>
      <circle cx="50" cy="42" r="18" fill="#6c63ff"/>
      <text x="50" y="82" text-anchor="middle" fill="#1a1a2e" font-size="9" font-family="sans-serif" font-weight="bold">ЛОГОТИП</text>
      <text x="50" y="93" text-anchor="middle" fill="#888" font-size="5.5" font-family="sans-serif">TAGLINE</text>
    </svg>`),
  },
  {
    id: 'menu',
    label: 'Меню ресторану',
    category: 'Бізнес',
    width: 800, height: 1000,
    background: '#1c1c1c',
    objects: [
      { type:'rect', left:0, top:0, width:800, height:200, fill:'#2a1a0a', stroke:null, strokeWidth:1, angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:60, top:60, width:680, height:120, text:'НАЗВА РЕСТОРАНУ', fontSize:52, fontFamily:'Inter', fontWeight:'bold', fill:'#d4a017', textAlign:'center', angle:0, opacity:1, selectable:true, evented:true },
      { type:'rect', left:80, top:197, width:640, height:2, fill:'#d4a017', stroke:null, strokeWidth:1, angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:80, top:228, width:640, height:32, text:'— ЗАКУСКИ —', fontSize:22, fontFamily:'Inter', fontWeight:'bold', fill:'#d4a017', textAlign:'center', angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:80, top:268, width:500, height:28, text:'Брускети з томатами та базиліком', fontSize:18, fontFamily:'Inter', fill:'#ffffff', angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:600, top:268, width:120, height:28, text:'120 грн', fontSize:18, fontFamily:'Inter', fill:'#d4a017', textAlign:'right', angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:80, top:303, width:500, height:28, text:'Карпаччо з лосося', fontSize:18, fontFamily:'Inter', fill:'#ffffff', angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:600, top:303, width:120, height:28, text:'185 грн', fontSize:18, fontFamily:'Inter', fill:'#d4a017', textAlign:'right', angle:0, opacity:1, selectable:true, evented:true },
      { type:'rect', left:80, top:343, width:640, height:1, fill:'rgba(212,160,23,0.3)', stroke:null, strokeWidth:1, angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:80, top:363, width:640, height:32, text:'— ОСНОВНІ СТРАВИ —', fontSize:22, fontFamily:'Inter', fontWeight:'bold', fill:'#d4a017', textAlign:'center', angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:80, top:403, width:500, height:28, text:'Стейк Рібай (300г)', fontSize:18, fontFamily:'Inter', fill:'#ffffff', angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:600, top:403, width:120, height:28, text:'650 грн', fontSize:18, fontFamily:'Inter', fill:'#d4a017', textAlign:'right', angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:80, top:438, width:500, height:28, text:'Паста Карбонара', fontSize:18, fontFamily:'Inter', fill:'#ffffff', angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:600, top:438, width:120, height:28, text:'220 грн', fontSize:18, fontFamily:'Inter', fill:'#d4a017', textAlign:'right', angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:80, top:920, width:640, height:25, text:'Тел: +38 (050) 000-00-00  ·  вул. Прикладна 1', fontSize:15, fontFamily:'Inter', fill:'rgba(212,160,23,0.6)', textAlign:'center', angle:0, opacity:1, selectable:true, evented:true },
    ],
    thumb: enc(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 112">
      <rect width="90" height="112" fill="#1c1c1c"/>
      <rect x="0" y="0" width="90" height="26" fill="#2a1a0a"/>
      <text x="45" y="12" text-anchor="middle" fill="#d4a017" font-size="7" font-family="sans-serif" font-weight="bold">НАЗВА</text>
      <text x="45" y="22" text-anchor="middle" fill="#d4a017" font-size="7" font-family="sans-serif" font-weight="bold">РЕСТОРАНУ</text>
      <line x1="10" y1="28" x2="80" y2="28" stroke="#d4a017" stroke-width="0.8"/>
      <text x="45" y="39" text-anchor="middle" fill="#d4a017" font-size="5.5" font-family="sans-serif">— ЗАКУСКИ —</text>
      <text x="12" y="50" fill="#fff" font-size="5" font-family="sans-serif">Брускети</text>
      <text x="78" y="50" text-anchor="end" fill="#d4a017" font-size="5" font-family="sans-serif">120 грн</text>
      <line x1="10" y1="58" x2="80" y2="58" stroke="rgba(212,160,23,0.3)" stroke-width="0.5"/>
      <text x="45" y="67" text-anchor="middle" fill="#d4a017" font-size="5.5" font-family="sans-serif">— ОСНОВНІ —</text>
      <text x="12" y="78" fill="#fff" font-size="5" font-family="sans-serif">Стейк Рібай</text>
      <text x="78" y="78" text-anchor="end" fill="#d4a017" font-size="5" font-family="sans-serif">650 грн</text>
    </svg>`),
  },

  // ── Документи ─────────────────────────────────────────────────
  {
    id: 'certificate',
    label: 'Сертифікат',
    category: 'Документи',
    width: 900, height: 630,
    background: '#fffdf0',
    objects: [
      { type:'rect', left:12, top:12, width:876, height:606, fill:'transparent', stroke:'#c9a227', strokeWidth:4, angle:0, opacity:1, selectable:true, evented:true },
      { type:'rect', left:22, top:22, width:856, height:586, fill:'transparent', stroke:'#c9a227', strokeWidth:1, angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:100, top:60, width:700, height:80, text:'СЕРТИФІКАТ', fontSize:60, fontFamily:'Inter', fontWeight:'bold', fill:'#c9a227', textAlign:'center', angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:100, top:148, width:700, height:35, text:'Цей сертифікат підтверджує, що', fontSize:22, fontFamily:'Inter', fill:'#666666', textAlign:'center', angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:80, top:195, width:740, height:65, text:"Ваше Повне Ім'я", fontSize:46, fontFamily:'Inter', fontStyle:'italic', fill:'#1a1a2e', textAlign:'center', angle:0, opacity:1, selectable:true, evented:true },
      { type:'rect', left:200, top:268, width:500, height:2, fill:'#c9a227', stroke:null, strokeWidth:1, angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:80, top:285, width:740, height:35, text:'успішно завершив(ла) курс', fontSize:22, fontFamily:'Inter', fill:'#666666', textAlign:'center', angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:80, top:330, width:740, height:50, text:'«Назва курсу або програми»', fontSize:30, fontFamily:'Inter', fontWeight:'bold', fill:'#1a1a2e', textAlign:'center', angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:80, top:500, width:300, height:55, text:'_________________\nПідпис директора', fontSize:17, fontFamily:'Inter', fill:'#444444', textAlign:'center', angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:520, top:500, width:300, height:55, text:'_________________\nДата видачі', fontSize:17, fontFamily:'Inter', fill:'#444444', textAlign:'center', angle:0, opacity:1, selectable:true, evented:true },
    ],
    thumb: enc(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 112">
      <rect width="160" height="112" fill="#fffdf0"/>
      <rect x="4" y="4" width="152" height="104" fill="none" stroke="#c9a227" stroke-width="2"/>
      <rect x="8" y="8" width="144" height="96" fill="none" stroke="#c9a227" stroke-width="0.6"/>
      <text x="80" y="34" text-anchor="middle" fill="#c9a227" font-size="11" font-family="sans-serif" font-weight="bold">СЕРТИФІКАТ</text>
      <line x1="30" y1="42" x2="130" y2="42" stroke="#c9a227" stroke-width="0.8"/>
      <text x="80" y="56" text-anchor="middle" fill="#666" font-size="7" font-family="sans-serif">Ваше Повне Ім'я</text>
      <text x="80" y="70" text-anchor="middle" fill="#333" font-size="6.5" font-family="sans-serif">«Назва курсу»</text>
      <line x1="20" y1="92" x2="65" y2="92" stroke="#888" stroke-width="0.8"/>
      <line x1="95" y1="92" x2="140" y2="92" stroke="#888" stroke-width="0.8"/>
    </svg>`),
  },
  {
    id: 'invitation',
    label: 'Запрошення',
    category: 'Документи',
    width: 700, height: 500,
    background: '#fdf6e3',
    objects: [
      { type:'rect', left:16, top:16, width:668, height:468, fill:'transparent', stroke:'#b8860b', strokeWidth:2, angle:0, opacity:1, selectable:true, evented:true },
      { type:'rect', left:28, top:28, width:644, height:444, fill:'transparent', stroke:'#daa520', strokeWidth:0.5, angle:0, opacity:1, selectable:true, evented:true },
      { type:'ellipse', left:350, top:110, rx:80, ry:80, fill:'rgba(184,134,11,0.06)', stroke:null, strokeWidth:1, angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:80, top:60, width:540, height:70, text:'Запрошення', fontSize:50, fontFamily:'Inter', fontStyle:'italic', fill:'#b8860b', textAlign:'center', angle:0, opacity:1, selectable:true, evented:true },
      { type:'rect', left:200, top:128, width:300, height:1, fill:'#daa520', stroke:null, strokeWidth:1, angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:80, top:145, width:540, height:35, text:'Шановний(а) _____________,', fontSize:20, fontFamily:'Inter', fill:'#5a4a2a', textAlign:'center', angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:80, top:195, width:540, height:70, text:'з великою радістю запрошуємо вас на наше особливе свято', fontSize:21, fontFamily:'Inter', fill:'#5a4a2a', textAlign:'center', angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:80, top:295, width:240, height:55, text:'Дата\n20 грудня 2025', fontSize:17, fontFamily:'Inter', fill:'#7a6a4a', textAlign:'center', angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:380, top:295, width:240, height:55, text:'Місце\nм. Київ', fontSize:17, fontFamily:'Inter', fill:'#7a6a4a', textAlign:'center', angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:80, top:415, width:540, height:35, text:'Чекаємо на вас!', fontSize:20, fontFamily:'Inter', fontStyle:'italic', fill:'#b8860b', textAlign:'center', angle:0, opacity:1, selectable:true, evented:true },
    ],
    thumb: enc(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 100">
      <rect width="140" height="100" fill="#fdf6e3"/>
      <rect x="4" y="4" width="132" height="92" fill="none" stroke="#b8860b" stroke-width="1.5"/>
      <rect x="8" y="8" width="124" height="84" fill="none" stroke="#daa520" stroke-width="0.5"/>
      <text x="70" y="32" text-anchor="middle" fill="#b8860b" font-size="10" font-family="sans-serif" font-style="italic">Запрошення</text>
      <line x1="35" y1="38" x2="105" y2="38" stroke="#daa520" stroke-width="0.8"/>
      <text x="70" y="52" text-anchor="middle" fill="#5a4a2a" font-size="6.5" font-family="sans-serif">Шановний(а) ___________,</text>
      <text x="70" y="64" text-anchor="middle" fill="#5a4a2a" font-size="6" font-family="sans-serif">запрошуємо вас на свято</text>
      <text x="35" y="82" text-anchor="middle" fill="#7a6a4a" font-size="5.5" font-family="sans-serif">Дата</text>
      <text x="105" y="82" text-anchor="middle" fill="#7a6a4a" font-size="5.5" font-family="sans-serif">Місце</text>
    </svg>`),
  },
  {
    id: 'resume',
    label: 'Резюме',
    category: 'Документи',
    width: 800, height: 1000,
    background: '#ffffff',
    objects: [
      { type:'rect', left:0, top:0, width:260, height:1000, fill:'#2c3e50', stroke:null, strokeWidth:1, angle:0, opacity:1, selectable:true, evented:true },
      { type:'ellipse', left:130, top:135, rx:75, ry:75, fill:'#34495e', stroke:null, strokeWidth:1, angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:10, top:220, width:240, height:65, text:"Ваше Повне Ім'я", fontSize:24, fontFamily:'Inter', fontWeight:'bold', fill:'#ffffff', textAlign:'center', angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:10, top:290, width:240, height:25, text:'Посада / Спеціальність', fontSize:15, fontFamily:'Inter', fill:'rgba(255,255,255,0.6)', textAlign:'center', angle:0, opacity:1, selectable:true, evented:true },
      { type:'rect', left:60, top:322, width:140, height:1, fill:'rgba(255,255,255,0.2)', stroke:null, strokeWidth:1, angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:10, top:336, width:240, height:22, text:'КОНТАКТИ', fontSize:12, fontFamily:'Inter', fontWeight:'bold', fill:'rgba(255,255,255,0.5)', textAlign:'center', angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:10, top:362, width:240, height:85, text:'email@example.com\n+38 (000) 000-00-00\nlinkedin.com/in/name', fontSize:13, fontFamily:'Inter', fill:'rgba(255,255,255,0.75)', textAlign:'center', angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:10, top:470, width:240, height:22, text:'НАВИЧКИ', fontSize:12, fontFamily:'Inter', fontWeight:'bold', fill:'rgba(255,255,255,0.5)', textAlign:'center', angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:20, top:498, width:220, height:100, text:'Навичка 1\nНавичка 2\nНавичка 3\nНавичка 4', fontSize:13, fontFamily:'Inter', fill:'rgba(255,255,255,0.75)', textAlign:'left', angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:300, top:50, width:460, height:22, text:'ПРО МЕНЕ', fontSize:13, fontFamily:'Inter', fontWeight:'bold', fill:'#2c3e50', angle:0, opacity:1, selectable:true, evented:true },
      { type:'rect', left:300, top:74, width:460, height:1, fill:'#2c3e50', stroke:null, strokeWidth:1, angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:300, top:86, width:460, height:80, text:'Короткий опис про себе, ваші досягнення та цілі. Розкажіть про свій досвід та що ви можете запропонувати.', fontSize:14, fontFamily:'Inter', fill:'#555555', angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:300, top:190, width:460, height:22, text:'ДОСВІД РОБОТИ', fontSize:13, fontFamily:'Inter', fontWeight:'bold', fill:'#2c3e50', angle:0, opacity:1, selectable:true, evented:true },
      { type:'rect', left:300, top:214, width:460, height:1, fill:'#2c3e50', stroke:null, strokeWidth:1, angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:300, top:226, width:320, height:28, text:'Назва посади', fontSize:17, fontFamily:'Inter', fontWeight:'bold', fill:'#2c3e50', angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:620, top:226, width:140, height:28, text:'2022 – 2025', fontSize:13, fontFamily:'Inter', fill:'#888888', textAlign:'right', angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:300, top:255, width:460, height:22, text:'Назва компанії · м. Київ', fontSize:14, fontFamily:'Inter', fill:'#6c63ff', angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:300, top:280, width:460, height:65, text:"Опис обов'язків та досягнень на цій посаді.", fontSize:13, fontFamily:'Inter', fill:'#666666', angle:0, opacity:1, selectable:true, evented:true },
    ],
    thumb: enc(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 112">
      <rect width="90" height="112" fill="#fff"/>
      <rect x="0" y="0" width="28" height="112" fill="#2c3e50"/>
      <circle cx="14" cy="22" r="10" fill="#34495e"/>
      <text x="14" y="44" text-anchor="middle" fill="#fff" font-size="4.5" font-family="sans-serif" font-weight="bold">Ім'я</text>
      <text x="14" y="53" text-anchor="middle" fill="rgba(255,255,255,0.6)" font-size="3.5" font-family="sans-serif">Посада</text>
      <text x="34" y="14" fill="#2c3e50" font-size="4" font-family="sans-serif" font-weight="bold">ПРО МЕНЕ</text>
      <line x1="33" y1="16" x2="87" y2="16" stroke="#2c3e50" stroke-width="0.6"/>
      <text x="34" y="26" fill="#666" font-size="3.5" font-family="sans-serif">Короткий опис досвіду</text>
      <text x="34" y="38" fill="#2c3e50" font-size="4" font-family="sans-serif" font-weight="bold">ДОСВІД</text>
      <line x1="33" y1="40" x2="87" y2="40" stroke="#2c3e50" stroke-width="0.6"/>
      <text x="34" y="50" fill="#2c3e50" font-size="3.5" font-family="sans-serif" font-weight="bold">Посада</text>
      <text x="34" y="58" fill="#6c63ff" font-size="3" font-family="sans-serif">Компанія</text>
    </svg>`),
  },

  // ── Нові шаблони ──────────────────────────────────────────────
  {
    id: 'sale-badge',
    label: 'Sale / Акція',
    category: 'Публікації',
    width: 800, height: 800,
    background: '#ff3b30',
    objects: [
      { type:'ellipse', left:400, top:400, rx:360, ry:360, fill:'rgba(255,255,255,0.08)', stroke:null, strokeWidth:1, angle:0, opacity:1, selectable:true, evented:true },
      { type:'ellipse', left:400, top:400, rx:300, ry:300, fill:'transparent', stroke:'rgba(255,255,255,0.25)', strokeWidth:3, angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:60, top:200, width:680, height:80, text:'ЗНИЖКА', fontSize:70, fontFamily:'Inter', fontWeight:'bold', fill:'#ffffff', textAlign:'center', angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:60, top:290, width:680, height:180, text:'50%', fontSize:180, fontFamily:'Inter', fontWeight:'bold', fill:'#ffffff', textAlign:'center', angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:60, top:500, width:680, height:50, text:'тільки до кінця місяця!', fontSize:28, fontFamily:'Inter', fill:'rgba(255,255,255,0.85)', textAlign:'center', angle:0, opacity:1, selectable:true, evented:true },
      { type:'rect', left:200, top:590, width:400, height:56, fill:'#ffffff', stroke:null, strokeWidth:1, rx:28, ry:28, angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:210, top:604, width:380, height:30, text:'Купити зараз', fontSize:22, fontFamily:'Inter', fontWeight:'bold', fill:'#ff3b30', textAlign:'center', angle:0, opacity:1, selectable:true, evented:true },
    ],
    thumb: enc(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
      <rect width="120" height="120" fill="#ff3b30"/>
      <circle cx="60" cy="60" r="54" fill="rgba(255,255,255,0.08)"/>
      <circle cx="60" cy="60" r="44" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="1.5"/>
      <text x="60" y="44" text-anchor="middle" fill="#fff" font-size="11" font-family="sans-serif" font-weight="bold">ЗНИЖКА</text>
      <text x="60" y="80" text-anchor="middle" fill="#fff" font-size="38" font-family="sans-serif" font-weight="bold">50%</text>
      <rect x="30" y="88" width="60" height="16" fill="#fff" rx="8"/>
      <text x="60" y="100" text-anchor="middle" fill="#ff3b30" font-size="7" font-family="sans-serif" font-weight="bold">Купити зараз</text>
    </svg>`),
  },
  {
    id: 'timeline',
    label: 'Таймлайн',
    category: 'Бізнес',
    width: 1000, height: 500,
    background: '#ffffff',
    objects: [
      { type:'rect', left:80, top:240, width:840, height:4, fill:'#6c63ff', stroke:null, strokeWidth:1, angle:0, opacity:1, selectable:true, evented:true },
      { type:'ellipse', left:180, top:242, rx:16, ry:16, fill:'#6c63ff', stroke:null, strokeWidth:1, angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:130, top:140, width:100, height:22, text:'Крок 1', fontSize:14, fontFamily:'Inter', fontWeight:'bold', fill:'#6c63ff', textAlign:'center', angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:110, top:165, width:140, height:60, text:'Перший важливий етап проекту', fontSize:12, fontFamily:'Inter', fill:'#555555', textAlign:'center', angle:0, opacity:1, selectable:true, evented:true },
      { type:'ellipse', left:390, top:242, rx:16, ry:16, fill:'#6c63ff', stroke:null, strokeWidth:1, angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:340, top:270, width:100, height:22, text:'Крок 2', fontSize:14, fontFamily:'Inter', fontWeight:'bold', fill:'#6c63ff', textAlign:'center', angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:320, top:296, width:140, height:60, text:'Другий важливий етап проекту', fontSize:12, fontFamily:'Inter', fill:'#555555', textAlign:'center', angle:0, opacity:1, selectable:true, evented:true },
      { type:'ellipse', left:610, top:242, rx:16, ry:16, fill:'#6c63ff', stroke:null, strokeWidth:1, angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:560, top:140, width:100, height:22, text:'Крок 3', fontSize:14, fontFamily:'Inter', fontWeight:'bold', fill:'#6c63ff', textAlign:'center', angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:540, top:165, width:140, height:60, text:'Третій важливий етап проекту', fontSize:12, fontFamily:'Inter', fill:'#555555', textAlign:'center', angle:0, opacity:1, selectable:true, evented:true },
      { type:'ellipse', left:820, top:242, rx:16, ry:16, fill:'#ff6b6b', stroke:null, strokeWidth:1, angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:770, top:270, width:100, height:22, text:'Фінал', fontSize:14, fontFamily:'Inter', fontWeight:'bold', fill:'#ff6b6b', textAlign:'center', angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:750, top:296, width:140, height:60, text:'Результат та запуск продукту', fontSize:12, fontFamily:'Inter', fill:'#555555', textAlign:'center', angle:0, opacity:1, selectable:true, evented:true },
    ],
    thumb: enc(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 80">
      <rect width="160" height="80" fill="#fff"/>
      <line x1="16" y1="40" x2="144" y2="40" stroke="#6c63ff" stroke-width="2"/>
      <circle cx="36" cy="40" r="7" fill="#6c63ff"/>
      <circle cx="76" cy="40" r="7" fill="#6c63ff"/>
      <circle cx="116" cy="40" r="7" fill="#6c63ff"/>
      <circle cx="144" cy="40" r="7" fill="#ff6b6b"/>
      <text x="36" y="26" text-anchor="middle" fill="#6c63ff" font-size="5.5" font-family="sans-serif" font-weight="bold">Крок 1</text>
      <text x="76" y="56" text-anchor="middle" fill="#6c63ff" font-size="5.5" font-family="sans-serif" font-weight="bold">Крок 2</text>
      <text x="116" y="26" text-anchor="middle" fill="#6c63ff" font-size="5.5" font-family="sans-serif" font-weight="bold">Крок 3</text>
      <text x="144" y="56" text-anchor="middle" fill="#ff6b6b" font-size="5.5" font-family="sans-serif" font-weight="bold">Фінал</text>
    </svg>`),
  },
  {
    id: 'quote',
    label: 'Цитата',
    category: 'Публікації',
    width: 800, height: 800,
    background: '#1a1a2e',
    objects: [
      { type:'textbox', left:60, top:120, width:680, height:200, text:'"', fontSize:240, fontFamily:'Inter', fontWeight:'bold', fill:'rgba(108,99,255,0.3)', textAlign:'left', angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:80, top:240, width:640, height:220, text:'Ваша надихаюча цитата або мотиваційний вислів для аудиторії', fontSize:34, fontFamily:'Inter', fontStyle:'italic', fill:'#ffffff', textAlign:'center', angle:0, opacity:1, selectable:true, evented:true },
      { type:'rect', left:340, top:488, width:120, height:3, fill:'#6c63ff', stroke:null, strokeWidth:1, angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:80, top:510, width:640, height:35, text:'— Автор цитати', fontSize:22, fontFamily:'Inter', fill:'rgba(255,255,255,0.6)', textAlign:'center', angle:0, opacity:1, selectable:true, evented:true },
    ],
    thumb: enc(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
      <rect width="120" height="120" fill="#1a1a2e"/>
      <text x="18" y="72" fill="rgba(108,99,255,0.4)" font-size="80" font-family="sans-serif" font-weight="bold">"</text>
      <text x="60" y="62" text-anchor="middle" fill="#fff" font-size="8" font-family="sans-serif" font-style="italic">Ваша надихаюча</text>
      <text x="60" y="74" text-anchor="middle" fill="#fff" font-size="8" font-family="sans-serif" font-style="italic">цитата тут</text>
      <line x1="46" y1="84" x2="74" y2="84" stroke="#6c63ff" stroke-width="1.5"/>
      <text x="60" y="96" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-size="7" font-family="sans-serif">— Автор</text>
    </svg>`),
  },
  {
    id: 'countdown',
    label: 'Відлік / Анонс',
    category: 'Публікації',
    width: 800, height: 600,
    background: '#0f0f1a',
    objects: [
      { type:'ellipse', left:400, top:300, rx:380, ry:280, fill:'rgba(108,99,255,0.08)', stroke:null, strokeWidth:1, angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:60, top:60, width:680, height:60, text:'НЕЗАБАРОМ', fontSize:48, fontFamily:'Inter', fontWeight:'bold', fill:'#6c63ff', textAlign:'center', angle:0, opacity:1, selectable:true, evented:true },
      { type:'rect', left:80, top:168, width:140, height:140, fill:'rgba(108,99,255,0.2)', stroke:'#6c63ff', strokeWidth:2, rx:12, ry:12, angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:80, top:188, width:140, height:80, text:'30', fontSize:64, fontFamily:'Inter', fontWeight:'bold', fill:'#ffffff', textAlign:'center', angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:80, top:282, width:140, height:22, text:'ДНІВ', fontSize:14, fontFamily:'Inter', fill:'rgba(255,255,255,0.5)', textAlign:'center', angle:0, opacity:1, selectable:true, evented:true },
      { type:'rect', left:330, top:168, width:140, height:140, fill:'rgba(108,99,255,0.2)', stroke:'#6c63ff', strokeWidth:2, rx:12, ry:12, angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:330, top:188, width:140, height:80, text:'12', fontSize:64, fontFamily:'Inter', fontWeight:'bold', fill:'#ffffff', textAlign:'center', angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:330, top:282, width:140, height:22, text:'ГОДИН', fontSize:14, fontFamily:'Inter', fill:'rgba(255,255,255,0.5)', textAlign:'center', angle:0, opacity:1, selectable:true, evented:true },
      { type:'rect', left:580, top:168, width:140, height:140, fill:'rgba(108,99,255,0.2)', stroke:'#6c63ff', strokeWidth:2, rx:12, ry:12, angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:580, top:188, width:140, height:80, text:'45', fontSize:64, fontFamily:'Inter', fontWeight:'bold', fill:'#ffffff', textAlign:'center', angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:580, top:282, width:140, height:22, text:'ХВИЛИН', fontSize:14, fontFamily:'Inter', fill:'rgba(255,255,255,0.5)', textAlign:'center', angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:80, top:380, width:640, height:45, text:'Назва події або продукту', fontSize:28, fontFamily:'Inter', fill:'rgba(255,255,255,0.85)', textAlign:'center', angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:80, top:432, width:640, height:30, text:'yourwebsite.com', fontSize:20, fontFamily:'Inter', fill:'rgba(108,99,255,0.8)', textAlign:'center', angle:0, opacity:1, selectable:true, evented:true },
    ],
    thumb: enc(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120">
      <rect width="160" height="120" fill="#0f0f1a"/>
      <text x="80" y="24" text-anchor="middle" fill="#6c63ff" font-size="12" font-family="sans-serif" font-weight="bold">НЕЗАБАРОМ</text>
      <rect x="14" y="34" width="38" height="38" fill="rgba(108,99,255,0.2)" stroke="#6c63ff" stroke-width="1" rx="4"/>
      <text x="33" y="60" text-anchor="middle" fill="#fff" font-size="20" font-family="sans-serif" font-weight="bold">30</text>
      <text x="33" y="74" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-size="5" font-family="sans-serif">ДНІВ</text>
      <rect x="61" y="34" width="38" height="38" fill="rgba(108,99,255,0.2)" stroke="#6c63ff" stroke-width="1" rx="4"/>
      <text x="80" y="60" text-anchor="middle" fill="#fff" font-size="20" font-family="sans-serif" font-weight="bold">12</text>
      <text x="80" y="74" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-size="5" font-family="sans-serif">ГОДИН</text>
      <rect x="108" y="34" width="38" height="38" fill="rgba(108,99,255,0.2)" stroke="#6c63ff" stroke-width="1" rx="4"/>
      <text x="127" y="60" text-anchor="middle" fill="#fff" font-size="20" font-family="sans-serif" font-weight="bold">45</text>
      <text x="127" y="74" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-size="5" font-family="sans-serif">ХВ</text>
      <text x="80" y="96" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-size="8" font-family="sans-serif">Назва події</text>
    </svg>`),
  },
  {
    id: 'dark-announcement',
    label: 'Оголошення',
    category: 'Публікації',
    width: 800, height: 500,
    background: '#111111',
    objects: [
      { type:'rect', left:0, top:0, width:6, height:500, fill:'#6c63ff', stroke:null, strokeWidth:1, angle:0, opacity:1, selectable:true, evented:true },
      { type:'rect', left:794, top:0, width:6, height:500, fill:'#6c63ff', stroke:null, strokeWidth:1, angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:60, top:80, width:680, height:50, text:'ВАЖЛИВЕ ОГОЛОШЕННЯ', fontSize:36, fontFamily:'Inter', fontWeight:'bold', fill:'#6c63ff', textAlign:'center', angle:0, opacity:1, selectable:true, evented:true },
      { type:'rect', left:200, top:146, width:400, height:2, fill:'rgba(108,99,255,0.4)', stroke:null, strokeWidth:1, angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:60, top:175, width:680, height:120, text:'Тут розміщується основний текст оголошення. Повідомте вашу аудиторію про важливу новину чи зміну.', fontSize:22, fontFamily:'Inter', fill:'rgba(255,255,255,0.85)', textAlign:'center', angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:60, top:350, width:680, height:35, text:'Дата набрання чинності: 1 січня 2026', fontSize:18, fontFamily:'Inter', fill:'rgba(255,255,255,0.5)', textAlign:'center', angle:0, opacity:1, selectable:true, evented:true },
      { type:'textbox', left:60, top:420, width:680, height:35, text:'Питання? Зв\'яжіться: info@company.com', fontSize:16, fontFamily:'Inter', fill:'rgba(108,99,255,0.7)', textAlign:'center', angle:0, opacity:1, selectable:true, evented:true },
    ],
    thumb: enc(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 100">
      <rect width="160" height="100" fill="#111"/>
      <rect x="0" y="0" width="3" height="100" fill="#6c63ff"/>
      <rect x="157" y="0" width="3" height="100" fill="#6c63ff"/>
      <text x="80" y="28" text-anchor="middle" fill="#6c63ff" font-size="9" font-family="sans-serif" font-weight="bold">ВАЖЛИВЕ ОГОЛОШЕННЯ</text>
      <line x1="40" y1="36" x2="120" y2="36" stroke="rgba(108,99,255,0.4)" stroke-width="1"/>
      <text x="80" y="52" text-anchor="middle" fill="rgba(255,255,255,0.85)" font-size="6.5" font-family="sans-serif">Текст важливого</text>
      <text x="80" y="62" text-anchor="middle" fill="rgba(255,255,255,0.85)" font-size="6.5" font-family="sans-serif">оголошення тут</text>
      <text x="80" y="80" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-size="5.5" font-family="sans-serif">Дата · info@company.com</text>
    </svg>`),
  },
];

import React, { useState } from 'react';

interface Props {
  onApply: (tpl: Template | any) => void;
  onApplyCustom: (w: number, h: number) => void;
  onClose: () => void;
  userTemplates?: any[];
  onSaveAsTemplate?: () => void;
  onDeleteUserTemplate?: (id: string) => void;
  savingTemplate?: boolean;
}

const BG     = '#16162a';
const BORDER = '#2d2d45';

const categories = Array.from(new Set(TEMPLATES.map(t => t.category)));

const PRESETS = [
  { label: 'HD (1920×1080)',    w: 1920, h: 1080 },
  { label: 'A4 (794×1123)',     w: 794,  h: 1123 },
  { label: 'Square (800×800)',  w: 800,  h: 800  },
  { label: 'Story (1080×1920)', w: 1080, h: 1920 },
];

export default function TemplatesPanel({ onApply, onApplyCustom, onClose, userTemplates = [], onSaveAsTemplate, onDeleteUserTemplate, savingTemplate }: Props) {
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customW, setCustomW] = useState(800);
  const [customH, setCustomH] = useState(600);

  const numStyle: React.CSSProperties = {
    width: '100%', padding: '7px 10px', borderRadius: 8,
    border: `1px solid ${BORDER}`, fontSize: 14,
    background: '#1e1e30', color: '#ddd', outline: 'none',
  };

  return (
    <div style={{
      width: 272, background: BG, borderRight: `1px solid ${BORDER}`,
      display: 'flex', flexDirection: 'column', flexShrink: 0, zIndex: 10,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 12px 6px', borderBottom: `1px solid ${BORDER}`, flexShrink: 0,
      }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#ddd' }}>Шаблони</span>
        <button onClick={onClose} style={{
          background: 'transparent', border: 'none', color: '#666', cursor: 'pointer', fontSize: 18, lineHeight: 1, padding: '0 2px',
        }}>×</button>
      </div>

      <div style={{ overflowY: 'auto', flex: 1, padding: '8px 10px 16px' }}>

        {/* Мої шаблони */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0 6px' }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '.06em' }}>
              Мої шаблони
            </div>
            {onSaveAsTemplate && (
              <button
                onClick={onSaveAsTemplate}
                disabled={savingTemplate}
                title="Зберегти поточне полотно як шаблон"
                style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  padding: '3px 8px', borderRadius: 5, border: `1px solid ${BORDER}`,
                  background: 'var(--primary)', color: '#fff', fontSize: 10,
                  fontWeight: 600, cursor: 'pointer', opacity: savingTemplate ? 0.6 : 1,
                }}
              >
                {savingTemplate ? '…' : '+ Зберегти поточний'}
              </button>
            )}
          </div>

          {userTemplates.length === 0 ? (
            <div style={{ fontSize: 11, color: '#555', padding: '4px 0 8px', fontStyle: 'italic' }}>
              Немає збережених шаблонів
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
              {userTemplates.map((tpl: any) => (
                <div key={tpl.id} style={{ position: 'relative' }}>
                  <button
                    onClick={() => onApply(tpl)}
                    title={tpl.name}
                    style={{
                      width: '100%', background: '#1e1e30', border: `1.5px solid ${BORDER}`,
                      borderRadius: 8, padding: 0, cursor: 'pointer', overflow: 'hidden',
                      textAlign: 'left', transition: 'border-color .15s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.borderColor = 'var(--primary)'}
                    onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.borderColor = BORDER}
                  >
                    {tpl.thumbnail ? (
                      <img src={tpl.thumbnail} alt={tpl.name} style={{ width: '100%', display: 'block', aspectRatio: '4/3', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', aspectRatio: '4/3', background: '#2d2d45', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: 20 }}>📋</span>
                      </div>
                    )}
                    <div style={{ padding: '4px 6px 6px', fontSize: 10, color: '#aaa', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {tpl.name}
                    </div>
                  </button>
                  {onDeleteUserTemplate && (
                    <button
                      onClick={(e) => { e.stopPropagation(); onDeleteUserTemplate(tpl.id); }}
                      title="Видалити шаблон"
                      style={{
                        position: 'absolute', top: 4, right: 4,
                        width: 18, height: 18, borderRadius: '50%',
                        background: 'rgba(220,50,50,0.85)', border: 'none',
                        color: '#fff', fontSize: 10, lineHeight: '18px', textAlign: 'center',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: 0,
                      }}
                    >×</button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Власний розмір */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '.06em', padding: '10px 0 6px' }}>
            Власний розмір
          </div>
          <button onClick={() => setShowCustomModal(true)} style={{
            width: '100%', padding: '7px 0', borderRadius: 7, border: `1px solid ${BORDER}`,
            background: 'transparent', color: '#aaa', fontSize: 12, fontWeight: 600, cursor: 'pointer',
          }}>
            ✏ Задати розміри вручну…
          </button>
        </div>

        {/* Вбудовані шаблони по категоріях */}
        {categories.map(cat => (
          <div key={cat}>
            <div style={{ fontSize: 10, fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '.06em', padding: '10px 0 6px' }}>
              {cat}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {TEMPLATES.filter(t => t.category === cat).map(tpl => (
                <button
                  key={tpl.id}
                  onClick={() => onApply(tpl)}
                  title={tpl.label}
                  style={{
                    background: '#1e1e30', border: `1.5px solid ${BORDER}`, borderRadius: 8,
                    padding: 0, cursor: 'pointer', overflow: 'hidden', textAlign: 'left',
                    transition: 'border-color .15s, transform .1s',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--primary)';
                    (e.currentTarget as HTMLElement).style.transform = 'scale(1.02)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = BORDER;
                    (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
                  }}
                >
                  <img src={tpl.thumb} alt={tpl.label} style={{ width: '100%', display: 'block' }} />
                  <div style={{ padding: '4px 6px 6px', fontSize: 10, color: '#aaa', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {tpl.label}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Модальне вікно власного розміру */}
      {showCustomModal && (
        <div
          onClick={() => setShowCustomModal(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.55)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#1a1a2e', border: `1px solid ${BORDER}`, borderRadius: 14,
              padding: 28, width: 340, boxShadow: '0 16px 48px rgba(0,0,0,.6)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#ddd' }}>Власний розмір полотна</span>
              <button onClick={() => setShowCustomModal(false)} style={{ background: 'none', border: 'none', color: '#666', fontSize: 20, cursor: 'pointer', lineHeight: 1 }}>×</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 12, color: '#888', marginBottom: 6 }}>Ширина (px)</div>
                <input type="number" min={1} max={10000} value={customW}
                  onChange={e => setCustomW(Math.max(1, parseInt(e.target.value) || 1))}
                  style={numStyle} />
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#888', marginBottom: 6 }}>Висота (px)</div>
                <input type="number" min={1} max={10000} value={customH}
                  onChange={e => setCustomH(Math.max(1, parseInt(e.target.value) || 1))}
                  style={numStyle} />
              </div>
            </div>

            <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>Швидкий вибір</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
              {PRESETS.map(p => (
                <button key={p.label} onClick={() => { setCustomW(p.w); setCustomH(p.h); }} style={{
                  fontSize: 11, padding: '5px 10px', borderRadius: 6,
                  border: `1px solid ${BORDER}`, background: customW === p.w && customH === p.h ? 'var(--primary)' : 'transparent',
                  color: customW === p.w && customH === p.h ? '#fff' : '#999', cursor: 'pointer',
                }}>
                  {p.label}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setShowCustomModal(false)} style={{
                flex: 1, padding: '9px 0', borderRadius: 8, border: `1px solid ${BORDER}`,
                background: 'transparent', color: '#aaa', fontSize: 13, cursor: 'pointer',
              }}>
                Скасувати
              </button>
              <button onClick={() => { onApplyCustom(customW, customH); setShowCustomModal(false); }} style={{
                flex: 2, padding: '9px 0', borderRadius: 8, border: 'none',
                background: 'var(--primary)', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer',
              }}>
                Застосувати {customW} × {customH}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
