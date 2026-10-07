import { readFileSync } from 'fs';
import { join } from 'path';

function readProjectFile(path: string): string {
  return readFileSync(join(process.cwd(), path), 'utf8');
}

function getReactNativeNamedImports(source: string): string {
  return source.match(/import\s*\{([\s\S]*?)\}\s*from 'react-native';/)?.[1] ?? '';
}

describe('Áreas seguras multiplataforma', () => {
  it('declara la dependencia compatible con Expo SDK 54', () => {
    const packageJson = JSON.parse(readProjectFile('package.json')) as {
      dependencies: Record<string, string>;
    };

    expect(packageJson.dependencies['react-native-safe-area-context']).toBe('~5.6.0');
  });

  it('monta un único provider en la raíz de la aplicación', () => {
    const entrypoint = readProjectFile('index.ts');

    expect(entrypoint).toContain("import { SafeAreaProvider } from 'react-native-safe-area-context';");
    expect(entrypoint).toContain('SafeAreaProvider,');
    expect(entrypoint).toContain('registerRootComponent(RootApp);');
  });

  it.each(['App.tsx', 'src/screens/AuthScreen.tsx'])(
    '%s usa la superficie segura multiplataforma en las cuatro aristas',
    (path) => {
      const source = readProjectFile(path);

      expect(getReactNativeNamedImports(source)).not.toContain('SafeAreaView');
      expect(source).toContain("import { SafeAreaView } from 'react-native-safe-area-context';");
      expect(source).toContain("edges={['top', 'right', 'bottom', 'left']}");
    }
  );
});
