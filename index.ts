import { Project, SyntaxKind } from 'ts-morph'
const kaskoPath = '../../work/kasko-forms/'
const project = new Project({
  tsConfigFilePath: `${kaskoPath}tsconfig.json`,
})

const file = project.getSourceFileOrThrow(
  `${kaskoPath}packages/kasko-core/plugins/ProfilePlugin.ts`
)

const param = file
  .getClassOrThrow('ProfilePlugin')
  .getPropertyOrThrow('fillFromProfile')
  .getFirstChildByKindOrThrow(SyntaxKind.ArrowFunction)
  .getParameterOrThrow('profile')
const refs = param.findReferences()
const res = refs.map((refSymbol) =>
  refSymbol.getReferences().map((ref) => {
    const sourceFile = ref.getSourceFile()
    const node = ref.getNode()
    return {
      file: sourceFile.getFilePath() + ':' + node.getStartLineNumber(),
      kind: node.getParentOrThrow().getKindName(),
    }
  })
)

console.log('res: ', res)

let aff = [3,4,5]

const c = [...aff]
