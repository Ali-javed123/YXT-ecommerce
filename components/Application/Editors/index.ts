'use client';

import dynamic from 'next/dynamic';
import { createElement } from 'react';

// Naya CKEditor 5 (SSR off)
export const RichTextEditor5 = dynamic(() => import('./CKEditor5'), {
  ssr: false,
  loading: () => createElement('div', { style: { minHeight: 300 } }),
});

export type {
  RichTextEditor5Props,
  RichTextEditor5Handle,
  Editor5Config,
  Editor5Instance,
  Editor5Preset,
} from './editor5.type';