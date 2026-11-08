import {
  // Core / typing
  Essentials, Paragraph, Autoformat, TextTransformation, PasteFromOffice,
  // Text styles
  Bold, Italic, Underline, Strikethrough, Subscript, Superscript, Code, RemoveFormat,
  // Links
  Link, AutoLink, LinkImage, Bookmark,
  // Lists / indent
  List, ListProperties, TodoList, Indent, IndentBlock,
  // Tables
  Table, TableToolbar, TableProperties, TableCellProperties, TableColumnResize, TableCaption,
  // Blocks
  BlockQuote, CodeBlock, Heading, Alignment,
  // Fonts / colors
  FontSize, FontFamily, FontColor, FontBackgroundColor, Highlight,
  // Insert
  HorizontalLine, PageBreak,
  SpecialCharacters, SpecialCharactersEssentials, SpecialCharactersArrows,
  SpecialCharactersCurrency, SpecialCharactersLatin, SpecialCharactersMathematical,
  SpecialCharactersText,
  // Images / media
  Image, ImageToolbar, ImageCaption, ImageStyle, ImageResize, ImageTextAlternative,
  ImageInsert, ImageUpload, AutoImage, MediaEmbed,
  // Tools
  FindAndReplace, SelectAll, ShowBlocks, SourceEditing, Undo,
  // HTML
  GeneralHtmlSupport, HtmlEmbed, HtmlComment, Style, TextPartLanguage,
  // Misc
  WordCount, AccessibilityHelp,
} from 'ckeditor5';
import type { Editor5Plugin, Editor5Preset } from './editor5.type';

/* ---------- Plugins ---------- */
const BASIC_PLUGINS: Editor5Plugin[] = [
  Essentials, Paragraph, Autoformat, TextTransformation, PasteFromOffice,
  Bold, Italic, Underline, Strikethrough, RemoveFormat,
  Link, AutoLink, List, BlockQuote, Undo,
  GeneralHtmlSupport, WordCount,
];

const IMAGE_PLUGINS: Editor5Plugin[] = [
  Image, ImageToolbar, ImageCaption, ImageStyle, ImageResize,
  ImageTextAlternative, ImageInsert, ImageUpload, AutoImage, LinkImage,
];

const STANDARD_PLUGINS: Editor5Plugin[] = [
  ...BASIC_PLUGINS,
  Heading, Alignment,
  FontSize, FontFamily, FontColor, FontBackgroundColor, Highlight,
  ListProperties, Indent, IndentBlock,
  Table, TableToolbar,
  HorizontalLine, SourceEditing,
  ...IMAGE_PLUGINS,
];

const FULL_PLUGINS: Editor5Plugin[] = [
  ...STANDARD_PLUGINS,
  Subscript, Superscript, Code, CodeBlock, TodoList,
  TableProperties, TableCellProperties, TableColumnResize, TableCaption,
  MediaEmbed, PageBreak, Bookmark,
  SpecialCharacters, SpecialCharactersEssentials, SpecialCharactersArrows,
  SpecialCharactersCurrency, SpecialCharactersLatin, SpecialCharactersMathematical,
  SpecialCharactersText,
  FindAndReplace, SelectAll, ShowBlocks, AccessibilityHelp,
  HtmlEmbed, HtmlComment, Style, TextPartLanguage,
];

export const PRESET_PLUGINS: Record<Editor5Preset, Editor5Plugin[]> = {
  basic: BASIC_PLUGINS,
  standard: STANDARD_PLUGINS,
  full: FULL_PLUGINS,
};

/* ---------- Toolbars ---------- */
export const PRESET_TOOLBARS: Record<Editor5Preset, string[]> = {
  basic: [
    'undo', 'redo', '|',
    'bold', 'italic', 'underline', 'strikethrough', 'removeFormat', '|',
    'bulletedList', 'numberedList', 'blockQuote', '|',
    'link',
  ],
  standard: [
    'undo', 'redo', '|',
    'heading', '|',
    'bold', 'italic', 'underline', 'strikethrough', 'removeFormat', '|',
    'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor', 'highlight', '|',
    'alignment', '|',
    'bulletedList', 'numberedList', 'outdent', 'indent', '|',
    'link', 'insertImage', 'insertTable', 'blockQuote', 'horizontalLine', '|',
    'sourceEditing',
  ],
  full: [
    'undo', 'redo', '|',
    'findAndReplace', 'selectAll', '|',
    'heading', 'style', '|',
    'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor', 'highlight', '|',
    'bold', 'italic', 'underline', 'strikethrough', 'subscript', 'superscript', 'code', 'removeFormat', '|',
    'alignment', '|',
    'bulletedList', 'numberedList', 'todoList', 'outdent', 'indent', '|',
    'link', 'bookmark', 'insertImage', 'insertTable', 'mediaEmbed', 'blockQuote', 'codeBlock', '|',
    'horizontalLine', 'pageBreak', 'specialCharacters', 'htmlEmbed', 'textPartLanguage', '|',
    'showBlocks', 'sourceEditing', 'accessibilityHelp',
  ],
};

/* ---------- Fonts ---------- */
export const FONT_FAMILIES = [
  'default',
  'Arial, Helvetica, sans-serif',
  'Georgia, serif',
  'Tahoma, Geneva, sans-serif',
  'Times New Roman, Times, serif',
  'Verdana, Geneva, sans-serif',
  'Courier New, Courier, monospace',
  'Noto Nastaliq Urdu, serif',
];

export const FONT_SIZES: (number | 'default')[] = [10, 12, 14, 'default', 18, 24, 32, 48, 64];

export const CODE_LANGUAGES = [
  { language: 'plaintext', label: 'Plain text' },
  { language: 'html', label: 'HTML' },
  { language: 'css', label: 'CSS' },
  { language: 'javascript', label: 'JavaScript' },
  { language: 'typescript', label: 'TypeScript' },
  { language: 'json', label: 'JSON' },
  { language: 'python', label: 'Python' },
  { language: 'bash', label: 'Bash' },
  { language: 'sql', label: 'SQL' },
];

/* "Style" dropdown ke liye ready-made styles */
export const STYLE_DEFINITIONS = [
  { name: 'Article title', element: 'h1', classes: ['article-title'] },
  { name: 'Subtitle', element: 'h3', classes: ['article-subtitle'] },
  { name: 'Info box', element: 'p', classes: ['info-box'] },
  { name: 'Side quote', element: 'blockquote', classes: ['side-quote'] },
  { name: 'Marker', element: 'span', classes: ['marker'] },
  { name: 'Spoiler', element: 'span', classes: ['spoiler'] },
];

/* Alag language wala text (RTL/LTR switch ke saath) */
export const TEXT_PART_LANGUAGES = [
  { title: 'English', languageCode: 'en' },
  { title: 'Urdu', languageCode: 'ur' },
  { title: 'Arabic', languageCode: 'ar' },
  { title: 'Hindi', languageCode: 'hi' },
];