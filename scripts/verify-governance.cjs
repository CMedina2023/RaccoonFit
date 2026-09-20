const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const sourceRoot = path.join(root, 'src');
const testRoot = path.join(root, '__tests__');
const sourceExtensions = new Set(['.ts', '.tsx']);
const packageManifest = require(path.join(root, 'package.json'));

function collectFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return collectFiles(entryPath);
    return sourceExtensions.has(path.extname(entry.name)) ? [entryPath] : [];
  });
}

function relative(filePath) {
  return path.relative(root, filePath).replace(/\\/g, '/');
}

function fail(message) {
  console.error(`FAIL: ${message}`);
  process.exitCode = 1;
}

for (const toolingPackage of ['@types/jest', '@types/react', 'jest', 'typescript']) {
  if (packageManifest.dependencies?.[toolingPackage]) {
    fail(`${toolingPackage} es una herramienta de desarrollo y debe declararse únicamente en devDependencies.`);
  }

  if (!packageManifest.devDependencies?.[toolingPackage]) {
    fail(`${toolingPackage} debe estar declarado en devDependencies.`);
  }
}

if (packageManifest.devDependencies.typescript !== '~5.9.2') {
  fail('Expo SDK 54 requiere TypeScript ~5.9.2 para esta configuración.');
}


const files = collectFiles(sourceRoot);

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const fileName = relative(file);

  if (/\bany\b/.test(content)) {
    fail(`${fileName} contiene 'any'. Use un tipo explícito o unknown con estrechamiento.`);
  }

  if (fileName !== 'src/store/useAppStore.ts' && /useAppStore\s*\(\s*\)/.test(content)) {
    fail(`${fileName} consume useAppStore() completo. Use un selector de src/store/selectors.ts.`);
  }

  if (fileName !== 'src/core/storage/AsyncStorageAdapter.ts'
    && content.includes('@react-native-async-storage/async-storage')) {
    fail(`${fileName} importa AsyncStorage fuera de AsyncStorageAdapter.`);
  }

  if (fileName === 'src/core/exerciseCatalog.ts' && /gifUrl:\s*['"]https?:\/\//.test(content)) {
    fail('src/core/exerciseCatalog.ts no puede almacenar URLs remotas; use exerciseDbId y ExerciseMediaProvider.');
  }
}

if (!fs.existsSync(path.join(sourceRoot, 'core/exerciseMedia/ExerciseMediaProvider.ts'))) {
  fail('Falta ExerciseMediaProvider: los medios remotos deben estar detrás de una abstracción.');
}

const mediaCachePath = path.join(sourceRoot, 'core/exerciseMedia/MediaLoadCache.ts');
if (!fs.existsSync(mediaCachePath)) {
  fail('Falta MediaLoadCache: el estado de carga de medios debe ser acotado e intercambiable.');
}

const gifPlayerPath = path.join(sourceRoot, 'components/animations/GifCanvasPlayer.tsx');
if (/loadedUrlsCache|new\s+Set\s*</.test(fs.readFileSync(gifPlayerPath, 'utf8'))) {
  fail('GifCanvasPlayer no puede mantener un Set global ilimitado; use MediaLoadCache inyectado.');
}

const gifMediaSourcePath = path.join(sourceRoot, 'components/animations/gifMediaSource.ts');
if (!fs.existsSync(gifMediaSourcePath)
  || !fs.readFileSync(gifMediaSourcePath, 'utf8').includes("cache: 'force-cache'")) {
  fail('Los GIF remotos deben preferir el caché persistente nativo y conservar el fallback SVG.');
}

const exercisePlayerPath = path.join(sourceRoot, 'components/ExerciseAnimationPlayer.tsx');
if (!fs.readFileSync(exercisePlayerPath, 'utf8').includes('setHasImageError(false)')) {
  fail('ExerciseAnimationPlayer debe restablecer el fallback al cambiar de medio.');
}

const legacyCatalogPath = path.join(sourceRoot, 'core/catalogs.ts');
if (/export\s+const\s+EXERCISES_CATALOG/.test(fs.readFileSync(legacyCatalogPath, 'utf8'))) {
  fail('src/core/catalogs.ts no puede definir EXERCISES_CATALOG; exerciseCatalog.ts es la fuente única.');
}

const planEnginePath = path.join(sourceRoot, 'core/planEngine.ts');
const planEngineSource = fs.readFileSync(planEnginePath, 'utf8');
if (planEngineSource.includes("from './exerciseCatalog'")) {
  fail('planEngine.ts no puede depender directamente de exerciseCatalog.ts; use ExerciseProvider.');
}

const appStoreFactoryPath = path.join(sourceRoot, 'store/createAppStore.ts');
const appStoreFactorySource = fs.readFileSync(appStoreFactoryPath, 'utf8');
if (appStoreFactorySource.includes('AsyncStorageAdapter') || appStoreFactorySource.includes('defaultStorageAdapter')) {
  fail('createAppStore.ts no puede conocer AsyncStorage; debe recibir StorageAdapter.');
}

const presentationFiles = [path.join(root, 'App.tsx'), ...collectFiles(path.join(sourceRoot, 'screens'))];
for (const presentationFile of presentationFiles) {
  const content = fs.readFileSync(presentationFile, 'utf8');
  if (/from\s+['"].*core\/(bmiCalculator|calorieCalculator)['"]/.test(content)) {
    fail(`${relative(presentationFile)} no puede importar calculadores de dominio; use un hook de presentación.`);
  }
}

for (const testFile of collectFiles(testRoot)) {
  const content = fs.readFileSync(testFile, 'utf8');
  if (/EXERCISES_CATALOG\.length\s*\)\s*\.toBe\s*\(\s*\d+/.test(content)) {
    fail(`${relative(testFile)} fija el tamaño del catálogo de ejercicios. Valide contratos, no una cantidad.`);
  }
}

console.log('PASS: reglas de arquitectura verificadas. El catálogo no contiene URLs remotas.');
