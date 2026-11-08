import type { Ref } from 'react';
import type { ClassicEditor, EditorConfig } from 'ckeditor5';

export type Editor5Instance = ClassicEditor;
export type Editor5Config = EditorConfig;
export type Editor5Preset = 'basic' | 'standard' | 'full';
export type Editor5Plugin = NonNullable<EditorConfig['plugins']>[number];

export interface RichTextEditor5Handle {
  getEditor: () => Editor5Instance | null;
  getData: () => string;
  setData: (html: string) => void;
  insertHtml: (html: string) => void;
  focus: () => void;
  clear: () => void;
}

export interface RichTextEditor5Props {
  /** HTML (controlled) */
  value?: string;
  onChange?: (html: string) => void;
  onBlur?: (html: string) => void;
  onFocus?: () => void;
  onReady?: (editor: Editor5Instance) => void;

  preset?: Editor5Preset;
  disabled?: boolean;
  placeholder?: string;

  minHeight?: number;
  maxHeight?: number;

  /** Fixed header ho to toolbar ka top offset (px) */
  toolbarOffset?: number;
  /** Fullscreen toggle button (default true) */
  allowFullscreen?: boolean;

  /** Server upload endpoint. Response: { url } */
  uploadUrl?: string;
  uploadWithCredentials?: boolean;
  /** true = image base64 ban kar HTML mein hi rahegi */
  deferImageUpload?: boolean;

  direction?: 'ltr' | 'rtl';
  /** UI language (translation file import karni hogi) */
  language?: string;

  maxLength?: number;
  showCounter?: boolean;

  /** true = koi bhi HTML allow (XSS risk). Default false */
  allowAnyHtml?: boolean;
  /** onChange debounce (ms). 0 = instant */
  debounceMs?: number;

  label?: string;
  helperText?: string;
  error?: string;
  required?: boolean;

  /** Default config ke upar override (stable reference rakhein) */
  config?: Editor5Config;
  /** Extra plugins (imported classes) */
  extraPlugins?: Editor5Plugin[];

  name?: string;
  className?: string;

  /** Imperative handle (next/dynamic ke saath safe) */
  handleRef?: Ref<RichTextEditor5Handle>;
}