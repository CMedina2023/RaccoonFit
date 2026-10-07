import { readFileSync } from 'fs';
import { join } from 'path';

const authScreenSource = readFileSync(
  join(process.cwd(), 'src/screens/AuthScreen.tsx'),
  'utf8'
);

function getStyleBody(styleName: string): string {
  return authScreenSource.match(new RegExp(`${styleName}: \\{([\\s\\S]*?)\\n  \\},`))?.[1] ?? '';
}

describe('Layout de preferencias alimentarias', () => {
  it('mantiene la lista y cada tarjeta al ancho del bloque de onboarding', () => {
    expect(authScreenSource).toContain('<View style={styles.dietaryOptions}>');
    expect(getStyleBody('dietaryOptions')).toContain("width: '100%'");
    expect(getStyleBody('dietaryCard')).toContain("width: '100%'");
  });

  it('permite que el contenido textual se ajuste sin colapsar', () => {
    expect(authScreenSource).toContain('<View style={styles.dietaryCardContent}>');
    expect(getStyleBody('dietaryCardContent')).toContain('flex: 1');
    expect(getStyleBody('dietaryCardContent')).toContain('minWidth: 0');
  });

  it.each(['Balanceado', 'Pescetariano', 'Vegetariano', 'Vegano'])(
    'conserva la opción %s',
    (label) => {
      expect(authScreenSource).toContain(`title: '${label}'`);
    }
  );
});
