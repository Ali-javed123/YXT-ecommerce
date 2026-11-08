import { cpSync, existsSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(root, 'node_modules', 'ckeditor4');
const dest = path.join(root, 'public', 'ckeditor4');

const force = process.argv.includes('--force');

if (!existsSync(path.join(src, 'ckeditor.js'))) {
  console.error(
    '[ckeditor4] node_modules/ckeditor4/ckeditor.js nahi mila. Pehle chalayein: npm install ckeditor4@4.22.1 --save-exact --legacy-peer-deps',
  );
  process.exit(0); // install ko fail na karein
}

if (!force && existsSync(path.join(dest, 'ckeditor.js'))) {
  console.log('[ckeditor4] public/ckeditor4 pehle se maujood hai, skip');
  process.exit(0);
}

if (existsSync(dest)) rmSync(dest, { recursive: true, force: true });
cpSync(src, dest, { recursive: true });
console.log('[ckeditor4] public/ckeditor4 mein copy ho gaya');