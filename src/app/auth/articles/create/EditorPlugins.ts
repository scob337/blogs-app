import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/js/plugins/image.min.js';
import 'froala-editor/js/plugins/link.min.js';
import 'froala-editor/js/plugins/colors.min.js';
import 'froala-editor/js/plugins/code_view.min.js';
import 'froala-editor/js/plugins/code_beautifier.min.js';
import 'froala-editor/js/plugins/paragraph_format.min.js';
import 'froala-editor/js/plugins/quote.min.js';
import 'froala-editor/js/plugins/draggable.min.js';
import 'froala-editor/js/plugins/align.min.js';
import 'froala-editor/js/plugins/lists.min.js';
import 'froala-editor/js/plugins/paragraph_style.min.js';
import 'froala-editor/js/plugins/line_breaker.min.js';
import 'froala-editor/js/plugins/inline_style.min.js';
import 'froala-editor/js/plugins/entities.min.js';
import 'froala-editor/js/plugins/char_counter.min.js';
import 'froala-editor/js/plugins/word_paste.min.js';
import 'froala-editor/js/plugins/help.min.js';
import 'froala-editor/js/plugins/print.min.js';
import 'froala-editor/js/plugins/special_characters.min.js';
import 'froala-editor/js/plugins/url.min.js';
import 'froala-editor/js/plugins/quick_insert.min.js';
import 'froala-editor/js/plugins/save.min.js';
import 'froala-editor/js/plugins/table.min.js';
import 'froala-editor/js/plugins/video.min.js';
import 'froala-editor/js/plugins/fullscreen.min.js';
import 'froala-editor/js/plugins/line_height.min.js';
import 'froala-editor/js/plugins/font_size.min.js';
import 'froala-editor/js/plugins/font_family.min.js';
import 'froala-editor/js/plugins/emoticons.min.js';
import 'froala-editor/js/plugins/file.min.js';

// تكوين المحرر الافتراضي
export const defaultEditorConfig = {
  placeholderText: 'اكتب محتوى المقال هنا...',
  charCounterCount: true,
  toolbarButtons: {
    moreText: {
      buttons: ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize', 'textColor', 'backgroundColor', 'inlineClass', 'inlineStyle', 'clearFormatting'],
    },
    moreParagraph: {
      buttons: ['alignLeft', 'alignCenter', 'alignRight', 'alignJustify', 'formatOL', 'formatUL', 'paragraphFormat', 'paragraphStyle', 'lineHeight', 'outdent', 'indent', 'quote'],
    },
    moreRich: {
      buttons: ['insertLink', 'insertImage', 'insertVideo', 'insertTable', 'emoticons', 'specialCharacters', 'insertHR', 'insertFile'],
    },
    moreMisc: {
      buttons: ['undo', 'redo', 'fullscreen', 'print', 'getPDF', 'spellChecker', 'selectAll', 'html', 'help'],
      align: 'right',
      buttonsVisible: 2,
    },
  },
  direction: 'rtl',
  heightMin: 300,
  imageUploadURL: '/api/upload/image',
  fileUploadURL: '/api/upload/file',
  // إضافة المزيد من الإعدادات
  imageUploadParams: {
    token: 'true'
  },
  fileUploadParams: {
    token: 'true'
  },
  imageMaxSize: 5 * 1024 * 1024, // 5MB
  fileMaxSize: 10 * 1024 * 1024, // 10MB
  language: 'ar',
  zIndex: 9999,
  attribution: false, // إزالة علامة Froala
  // إعدادات الألوان
  colorsBackground: [
    '#61BD6D', '#1ABC9C', '#54ACD2', '#2C82C9', '#9365B8', '#475577',
    '#CCCCCC', '#41A85F', '#00A885', '#3D8EB9', '#2969B0', '#553982',
    '#28324E', '#000000', '#F7DA64', '#FBA026', '#EB6B56', '#E25041',
    '#A38F84', '#EFEFEF', '#FFFFFF', '#FAC51C', '#F37934', '#D14841',
    '#B8312F', '#7C706B', '#D1D5D8', 'REMOVE'
  ],
  colorsText: [
    '#61BD6D', '#1ABC9C', '#54ACD2', '#2C82C9', '#9365B8', '#475577',
    '#CCCCCC', '#41A85F', '#00A885', '#3D8EB9', '#2969B0', '#553982',
    '#28324E', '#000000', '#F7DA64', '#FBA026', '#EB6B56', '#E25041',
    '#A38F84', '#EFEFEF', '#FFFFFF', '#FAC51C', '#F37934', '#D14841',
    '#B8312F', '#7C706B', '#D1D5D8', 'REMOVE'
  ],
  // إعدادات الروابط
  linkAlwaysBlank: true,
  linkAlwaysNoFollow: false,
  // إعدادات الفيديو
  videoAllowedTypes: ['youtube', 'vimeo'],
  // إعدادات الجداول
  tableStyles: {
    'table-bordered': 'Bordered Table',
    'table-striped': 'Striped Table',
    'table-hover': 'Hover Table'
  },
  // إعدادات الصور
  imageStyles: {
    'fr-rounded': 'Rounded',
    'fr-bordered': 'Bordered',
    'fr-shadow': 'Shadow'
  },
  // إعدادات التحقق من الإملاء
  spellcheck: true,
  // إعدادات الحفظ التلقائي
  saveInterval: 10000, // حفظ كل 10 ثوانٍ
  // إعدادات الأمان
  htmlAllowedTags: ['a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'blockquote', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hgroup', 'hr', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'menu', 'menuitem', 'meter', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'pre', 'progress', 'queue', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strike', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr'],
  htmlAllowedAttrs: ['accept', 'accept-charset', 'accesskey', 'action', 'align', 'allowfullscreen', 'allowtransparency', 'alt', 'async', 'autocomplete', 'autofocus', 'autoplay', 'autosave', 'background', 'bgcolor', 'border', 'charset', 'cellpadding', 'cellspacing', 'checked', 'cite', 'class', 'color', 'cols', 'colspan', 'content', 'contenteditable', 'contextmenu', 'controls', 'coords', 'data', 'data-.*', 'datetime', 'default', 'defer', 'dir', 'dirname', 'disabled', 'download', 'draggable', 'dropzone', 'enctype', 'for', 'form', 'formaction', 'frameborder', 'headers', 'height', 'hidden', 'high', 'href', 'hreflang', 'http-equiv', 'icon', 'id', 'ismap', 'itemprop', 'keytype', 'kind', 'label', 'lang', 'language', 'list', 'loop', 'low', 'max', 'maxlength', 'media', 'method', 'min', 'mozallowfullscreen', 'multiple', 'muted', 'name', 'novalidate', 'open', 'optimum', 'pattern', 'ping', 'placeholder', 'playsinline', 'poster', 'preload', 'pubdate', 'radiogroup', 'readonly', 'rel', 'required', 'reversed', 'rows', 'rowspan', 'sandbox', 'scope', 'scoped', 'scrolling', 'seamless', 'selected', 'shape', 'size', 'sizes', 'span', 'src', 'srcdoc', 'srclang', 'srcset', 'start', 'step', 'summary', 'spellcheck', 'style', 'tabindex', 'target', 'title', 'type', 'translate', 'usemap', 'value', 'valign', 'webkitallowfullscreen', 'width', 'wrap']
};

