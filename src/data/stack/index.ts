import {
  TSIcon,
  NodeIcon,
  PythonIcon,
  PyTorchIcon,
  ArgoIcon,
  KubernetesIcon,
  AWSIcon,
  LangchainIcon,
  ReactIcon,
  DockerIcon,
  WBIcon,
  CSSIcon,
  HTMLIcon,
} from '~/components/Icon'

export interface StackItem {
  title: string
  Icon: React.ReactElement
}

const TS: StackItem = {
  title: 'TypeScript',
  Icon: TSIcon(),
}

const node: StackItem = {
  title: 'NodeJS',
  Icon: NodeIcon(),
}

const python: StackItem = {
  title: 'Python',
  Icon: PythonIcon(),
}

const argo: StackItem = {
  title: 'ArgoCD',
  Icon: ArgoIcon(),
}

const pyTorch: StackItem = {
  title: 'PyTorch',
  Icon: PyTorchIcon(),
}

const kube: StackItem = {
  title: 'Kubernetes',
  Icon: KubernetesIcon(),
}
const aws: StackItem = {
  title: 'AWS',
  Icon: AWSIcon(),
}
const react: StackItem = {
  title: 'React',
  Icon: ReactIcon(),
}
const html: StackItem = {
  title: 'HTML',
  Icon: HTMLIcon(),
}
const css: StackItem = {
  title: 'CSS',
  Icon: CSSIcon(),
}
const wb: StackItem = {
  title: 'Weights and Biases',
  Icon: WBIcon(),
}
const docker: StackItem = {
  title: 'Docker',
  Icon: DockerIcon(),
}
const langchain: StackItem = {
  title: 'LangChain',
  Icon: LangchainIcon(),
}
export default [
  TS,
  node,
  python,
  pyTorch,
  argo,
  kube,
  aws,
  react,
  html,
  css,
  wb,
  docker,
  langchain,
]
