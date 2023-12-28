import path from 'path';
import { defineConfig } from 'vite';
import Inspect from 'vite-plugin-inspect';
import CustomHMR from './vite-plugin-custom-hmr';

export default defineConfig( ( { mode } ) => {
  return {
    build: {
      target: 'esnext',
    },
    plugins: [
      Inspect(),
      CustomHMR({
        hotBaseClasses: new Set(['Component']),
        observersName: 'hotComponentObservers',
        tsConfigFilePath: path.resolve('./tsconfig.json'),
      }),
    ],
  };
} );
