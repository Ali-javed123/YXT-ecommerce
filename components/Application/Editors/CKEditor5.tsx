'use client';

import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
  ClassicEditor,
  Base64UploadAdapter,
  SimpleUploadAdapter,
} from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';
import { useTheme } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import Typography from '@mui/material/Typography';

import {
  CODE_LANGUAGES,
  FONT_FAMILIES,
  FONT_SIZES,
  PRESET_PLUGINS,
  PRESET_TOOLBARS,
  STYLE_DEFINITIONS,
  TEXT_PART_LANGUAGES,
} from './presets5';
import type {
  Editor5Config,
  Editor5Instance,
  RichTextEditor5Handle,
  RichTextEditor5Props,
} from './editor5.type';

interface Stats {
  words: number;
  chars: number;
}

export default function CKEditor5({
  value = '',
  onChange,
  onBlur,
  onFocus,
  onReady,
  preset = 'full',
  disabled = false,
  placeholder,
  minHeight = 300,
  maxHeight = 700,
  toolbarOffset = 0,
  allowFullscreen = true,
  uploadUrl,
  uploadWithCredentials = false,
  deferImageUpload = false,
  direction = 'ltr',
  language = 'en',
  maxLength,
  showCounter = true,
  allowAnyHtml = false,
  debounceMs = 0,
  label,
  helperText,
  error,
  required,
  config: configOverride,
  extraPlugins,
  name,
  className,
  handleRef,
}: RichTextEditor5Props) {
  const editorRef = useRef<Editor5Instance | null>(null);
  const lastData = useRef(value);
  const latestValue = useRef(value);
  const initialData = useRef(value); // editor ko sirf pehli baar data dena hai
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [stats, setStats] = useState<Stats>({ words: 0, chars: 0 });
  const [fullscreen, setFullscreen] = useState(false);

  /* ---------- Dark mode ---------- */
  const { palette } = useTheme();
  const isDark = palette.mode === 'dark';
  const darkClass = isDark ? 'dark' : '';

  latestValue.current = value;

  // Callbacks ka latest version
  const callbacks = useRef({ onChange, onBlur, onFocus, onReady });
  useEffect(() => {
    callbacks.current = { onChange, onBlur, onFocus, onReady };
  });

  /* ---------- Config ---------- */
  const config = useMemo<Editor5Config>(() => {
    const useServerUpload = Boolean(uploadUrl) && !deferImageUpload;

    return {
      licenseKey: 'GPL',
      placeholder,
      language: {
        ui: language,
        content: direction === 'rtl' ? 'ur' : language,
        textPartLanguage: TEXT_PART_LANGUAGES,
      },

      plugins: [
        ...PRESET_PLUGINS[preset],
        useServerUpload ? SimpleUploadAdapter : Base64UploadAdapter,
        ...(extraPlugins ?? []),
      ],

      // Fixed header ho to toolbar uske neeche chipke
      ui: { viewportTopOffset: { top: toolbarOffset } },

      // Toolbar ... mein collapse hone ki jagah wrap ho
      toolbar: {
        items: PRESET_TOOLBARS[preset],
        shouldNotGroupWhenFull: true,
      },

      // Headings
      heading: {
        options: [
          { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
          { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
          { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
          { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
          { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
          { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
          { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' },
        ],
      },

      // Fonts / colors / highlight
      fontFamily: { options: FONT_FAMILIES, supportAllValues: true },
      fontSize: { options: FONT_SIZES, supportAllValues: true },
      fontColor: { columns: 6, documentColors: 12 },
      fontBackgroundColor: { columns: 6, documentColors: 12 },

      // Alignment
      alignment: { options: ['left', 'center', 'right', 'justify'] },

      // Links
      link: {
        addTargetToExternalLinks: true,
        defaultProtocol: 'https://',
        decorators: {
          openInNewTab: {
            mode: 'manual',
            label: 'Open in a new tab',
            attributes: { target: '_blank', rel: 'noopener noreferrer' },
          },
          nofollow: {
            mode: 'manual',
            label: 'Nofollow (SEO)',
            attributes: { rel: 'nofollow' },
          },
        },
      },

      // Lists
      list: {
        properties: { styles: true, startIndex: true, reversed: true },
      },

      // Images
      image: {
        toolbar: [
          'imageStyle:inline',
          'imageStyle:block',
          'imageStyle:side',
          '|',
          'toggleImageCaption',
          'imageTextAlternative',
          '|',
          'linkImage',
          '|',
          'resizeImage',
        ],
        insert: { integrations: ['upload', 'url'], type: 'auto' },
        resizeUnit: '%',
        resizeOptions: [
          { name: 'resizeImage:original', value: null, label: 'Original' },
          { name: 'resizeImage:25', value: '25', label: '25%' },
          { name: 'resizeImage:50', value: '50', label: '50%' },
          { name: 'resizeImage:75', value: '75', label: '75%' },
        ],
      },
      ...(useServerUpload && {
        simpleUpload: {
          uploadUrl: uploadUrl!,
          withCredentials: uploadWithCredentials,
        },
      }),

      // Tables
      table: {
        contentToolbar: [
          'tableColumn',
          'tableRow',
          'mergeTableCells',
          'tableProperties',
          'tableCellProperties',
          'toggleTableCaption',
        ],
      },

      // Code block, media, style dropdown, HTML embed
      codeBlock: { languages: CODE_LANGUAGES },
      mediaEmbed: { previewsInData: true },
      style: { definitions: STYLE_DEFINITIONS },
      htmlEmbed: { showPreviews: true },

      // HTML rules (allowAnyHtml = XSS risk)
      htmlSupport: {
        allow: allowAnyHtml
          ? [{ name: /.*/, attributes: true, classes: true, styles: true }]
          : [
              {
                name: /^(div|span|p|h[1-6]|img|table|td|th|a|blockquote)$/,
                attributes: ['id', 'dir', 'lang'],
                classes: true,
                styles: true,
              },
            ],
      },

      // Counter apna hai, plugin sirf stats deta hai
      wordCount: { displayWords: false, displayCharacters: false },

      ...configOverride,
    } as Editor5Config;
  }, [
    preset,
    placeholder,
    language,
    direction,
    extraPlugins,
    toolbarOffset,
    uploadUrl,
    uploadWithCredentials,
    deferImageUpload,
    allowAnyHtml,
    configOverride,
  ]);

  /* ---------- Helpers ---------- */
  const emit = useCallback((editor: Editor5Instance) => {
    const html = editor.getData();
    lastData.current = html;
    callbacks.current.onChange?.(html);
  }, []);

  const handleChange = useCallback(
    (editor: Editor5Instance) => {
      if (debounceMs <= 0) {
        emit(editor);
        return;
      }
      clearTimeout(timer.current);
      timer.current = setTimeout(() => emit(editor), debounceMs);
    },
    [debounceMs, emit],
  );

  const handleReady = useCallback((editor: Editor5Instance) => {
    editorRef.current = editor;

    // Value editor ready hone se pehle badal gayi ho (edit page, API se data)
    if (latestValue.current !== editor.getData()) {
      lastData.current = latestValue.current;
      editor.setData(latestValue.current);
    }

    // Word / char count (official plugin)
    const wc = editor.plugins.get('WordCount');
    setStats({ words: wc.words, chars: wc.characters });
    wc.on('update', (_evt: unknown, s: { words: number; characters: number }) => {
      setStats({ words: s.words, chars: s.characters });
    });

    callbacks.current.onReady?.(editor);
  }, []);

  /* ---------- Bahar se value badle to sync ---------- */
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor || value === lastData.current) return;
    lastData.current = value;
    if (editor.getData() !== value) {
      editor.setData(value);
    }
  }, [value]);

  /* ---------- Esc se fullscreen band ---------- */
  useEffect(() => {
    if (!fullscreen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setFullscreen(false);
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [fullscreen]);

  /* ---------- Cleanup ---------- */
  useEffect(
    () => () => {
      clearTimeout(timer.current);
      editorRef.current = null;
    },
    [],
  );

  /* ---------- Imperative API ---------- */
  useImperativeHandle(
    handleRef,
    (): RichTextEditor5Handle => ({
      getEditor: () => editorRef.current,
      getData: () => editorRef.current?.getData() ?? lastData.current,
      setData: (html) => {
        const editor = editorRef.current;
        if (!editor) return;
        editor.setData(html);
        emit(editor);
      },
      insertHtml: (html) => {
        const editor = editorRef.current;
        if (!editor) return;
        const viewFragment = editor.data.processor.toView(html);
        const modelFragment = editor.data.toModel(viewFragment);
        editor.model.insertContent(modelFragment);
      },
      focus: () => editorRef.current?.editing.view.focus(),
      clear: () => {
        const editor = editorRef.current;
        if (!editor) return;
        editor.setData('');
        emit(editor);
      },
    }),
    [emit],
  );

  const overLimit = maxLength !== undefined && stats.chars > maxLength;
  const editableMaxHeight = fullscreen ? 'calc(100vh - 190px)' : `${maxHeight}px`;
  const editableMinHeight = fullscreen ? 'calc(100vh - 190px)' : `${minHeight}px`;

  return (
    <FormControl
      error={Boolean(error)}
      required={required}
      disabled={disabled}
      className={[darkClass, className].filter(Boolean).join(' ')}
      sx={
        fullscreen
          ? {
              position: 'fixed',
              inset: 0,
              zIndex: 1300,
              bgcolor: 'background.paper',
              p: 2,
              width: '100%',
              maxWidth: 'none',
              overflow: 'auto',
            }
          : { width: '100%', maxWidth: 900 }
      }
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 1,
        }}
      >
        {label ? (
          <FormLabel className="text-black text-md dark:text-white">
            {label}
          </FormLabel>
        ) : (
          <span />
        )}
        {allowFullscreen && (
          <Button
            size="small"
            onClick={() => setFullscreen((f) => !f)}
            type="button"
          >
            {fullscreen ? 'Exit fullscreen (Esc)' : 'Fullscreen'}
          </Button>
        )}
      </Box>

      <Box
        sx={{
          width: '100%',
          '--ck-z-default': 1400,
          // MUI Dialog (1300) se thoda upar, lekin MUI popover (1500) se neeche
          '--ck-z-modal': 1450,

          // Editor content area
          '& .ck.ck-editor__main > .ck-editor__editable': {
            minHeight: editableMinHeight,
            maxHeight: editableMaxHeight,
            overflowY: 'auto',
            borderColor: error ? 'error.main' : undefined,
          },
          '& .ck.ck-editor__top .ck-sticky-panel .ck-toolbar': {
            borderColor: error ? 'error.main' : undefined,
          },

          // Images content ke andar fit rahein
          '& .ck-content img': { maxWidth: '100%', height: 'auto' },

          // RTL font
          '& .ck-content':
            direction === 'rtl'
              ? { fontFamily: 'Noto Nastaliq Urdu, serif' }
              : {},

          // Style dropdown ke classes ka preview (theme-aware)
          '& .ck-content .info-box': {
            p: 1.5,
            bgcolor: isDark ? 'hsl(220, 40%, 18%)' : '#eef6ff',
            borderLeft: '4px solid #3b82f6',
            borderRadius: 1,
          },
          '& .ck-content .marker': {
            bgcolor: isDark ? 'hsl(50, 60%, 35%)' : '#fff59d',
          },
          '& .ck-content .spoiler': { bgcolor: '#000', color: '#000' },
          '& .ck-content .spoiler:hover': { color: '#fff' },
          '& .ck-content .side-quote': {
            float: 'right',
            width: '35%',
            ml: 2,
            fontStyle: 'italic',
            borderLeft: '3px solid #999',
            pl: 1.5,
          },
        }}
      >
        <CKEditor
          editor={ClassicEditor}
          data={initialData.current}
          config={config}
          disabled={disabled}
          onReady={handleReady}
          onChange={(_evt, editor) => handleChange(editor as Editor5Instance)}
          onFocus={() => callbacks.current.onFocus?.()}
          onBlur={(_evt, editor) => {
            clearTimeout(timer.current);
            emit(editor as Editor5Instance);
            callbacks.current.onBlur?.((editor as Editor5Instance).getData());
          }}
        />

        {/* hidden input: native form submit ke liye */}
        {name && (
          <input
            type="hidden"
            name={name}
            value={lastData.current}
            readOnly
          />
        )}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mt: 0.5 }}>
        <FormHelperText sx={{ m: 0 }}>{error ?? helperText}</FormHelperText>
        {showCounter && (
          <Typography
            variant="caption"
            color={overLimit ? 'error' : 'text.secondary'}
            sx={{ whiteSpace: 'nowrap' }}
          >
            {stats.words} words · {stats.chars}
            {maxLength !== undefined ? ` / ${maxLength}` : ''} chars
          </Typography>
        )}
      </Box>
    </FormControl>
  );
}