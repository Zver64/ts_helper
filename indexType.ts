import { Project, SyntaxKind, Node } from 'ts-morph'
const kaskoPath = '../../work/kasko-forms/'
const project = new Project({
  tsConfigFilePath: `${kaskoPath}tsconfig.json`,
})

type Ref = {
  path: string
  kindName: string
  kind: number
}

const PRIMITIVE_TYPES = ['string', 'number', 'undefined']

const file = project.getSourceFileOrThrow(
  `${kaskoPath}packages/kasko-core/types.ts`
)

const typeInstance = file.getTypeAliasOrThrow('ActualContact')

const typeProps = typeInstance
  .getFirstChildByKindOrThrow(SyntaxKind.TypeLiteral)
  .getFirstChildByKindOrThrow(SyntaxKind.SyntaxList)
  .getChildren()
  .map(printRef)

function printRef(typeProp: Node) {
  const type = typeProp.getType()
  const typeText = type.getText()
  // проверяем что тип не простой
  if (!PRIMITIVE_TYPES.includes(typeText)) {
  }
  const refs = typeProp
    .getFirstChildByKindOrThrow(SyntaxKind.Identifier)
    .findReferences()

  return {
    typeString: typeText,
    prop: typeProp.getText(),
    refs: refs.map((ref) =>
      ref.getReferences().reduce<Ref[]>((acc, ref) => {
        const node = ref.getNode()
        const kind = node.getParentOrThrow().getKind()
        if (kind !== SyntaxKind.PropertySignature) {
          acc.push({
            path:
              ref.getSourceFile().getFilePath() +
              ':' +
              node.getStartLineNumber(),
            kind,
            kindName: node.getParentOrThrow().getKindName(),
          })
        }
        return acc
      }, [])
    ),
  }
}

console.log('res: ', JSON.stringify(typeProps, null, 2))
