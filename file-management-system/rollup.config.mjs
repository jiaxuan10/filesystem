import svelte from 'rollup-plugin-svelte';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import terser from '@rollup/plugin-terser';
import replace from '@rollup/plugin-replace';

const production = !process.env.ROLLUP_WATCH;

export default {
    input: 'src/main.js',
    output: {
        sourcemap: true,
        format: 'esm',
        dir: 'public/build',
    },
    plugins: [
        replace({
            preventAssignment: true,
            'process.env.NODE_ENV': JSON.stringify(production ? 'production' : 'development'),
        }),
        svelte({
            preprocess: sveltePreprocess({ typescript: true }),
            compilerOptions: {
                dev: !production,
            },
        }),
        resolve({
            browser: true,
            dedupe: ['svelte'],
            preferBuiltins: false, // 如果库是 Node.js 环境为主，可以尝试启用
          }),
        commonjs(),
        typescript({
            sourceMap: !production,
            tsconfig: './tsconfig.json',
        }),
        !production && livereload('public'),
        production && terser(),
    ],
    watch: {
        clearScreen: false,
    },
};
