import { Plugin } from 'vite';
import { Project, ClassDeclaration, InterfaceDeclaration } from 'ts-morph';

function getAncestorClasses(node: ClassDeclaration): ClassDeclaration[] {
  const baseClass = node.getBaseClass();
  if (baseClass == null) {
    return [];
  }

  return [baseClass, ...getAncestorClasses(baseClass)];
}

function isClassInheritedFrom(node: ClassDeclaration, baseClassNames: Set<string>): boolean {
  const ancestorClasses = getAncestorClasses(node);

  for (const ancestorClass of ancestorClasses) {
    if (baseClassNames.has(ancestorClass.getName())) {
      return true;
    }
  }

  return false;
}

export default function CustomHMR({ hotBaseClasses, observersName, tsConfigFilePath }: {
  hotBaseClasses: Set<string>;
  observersName: string;
  tsConfigFilePath: string;
}): Plugin {
  return {
    name: 'hmr',

    transform(code, id, options) {
      if (!id.endsWith('.ts')) {
        return undefined;
      }

      const project = new Project({
        tsConfigFilePath: tsConfigFilePath,
      });

      const classNames: string[] = [];

      const tsFile = project.getSourceFileOrThrow(id);

      // let's look at exported declarations
      const exported = tsFile.getExportedDeclarations();


      // it's not able to HMR if:
      // - there's an exported declaration that's not a class or interface
      // - there's an exported class which doesn't inherit from any of the hotBaseClasses
      for (const [name, declarations] of exported.entries()) {
        for (const declaration of declarations) {
          if (declaration instanceof InterfaceDeclaration) {
            // interfaces, doesn't affect the behavior, good
          } else if (declaration instanceof ClassDeclaration) {
            if (isClassInheritedFrom(declaration, hotBaseClasses)) {
              // classes that inherit from hotBaseClasses, good
              classNames.push(name);
            } else {
              // classes that don't inherit from hotBaseClasses, bad
              return undefined;
            }
          } else {
            // anything else (functions, variables, etc), bad
            return undefined;
          }
        }
      }

      if (classNames.length === 0) {
        return undefined;
      }

      // inject hmr code
      const hotAccept = `if (import.meta.hot) {
  import.meta.hot.accept((mod) => {
    if (window.${observersName} == null) {
      return;
    }

    const event = {
      classNames: ${JSON.stringify(classNames)},
      mod,
    };

    for (const observer of window.${observersName}) {
      observer(event);
    }
  });
}`;

      return {
        code: `${code}\n\n${hotAccept}`,
        map: null,
      };
    },
  };
}
