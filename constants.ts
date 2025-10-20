
import type { UseCase } from './types';
import { GamingIcon, VideoEditingIcon, CodeIcon, AiResearchIcon, CadIcon } from './components/icons/UseCaseIcons';

export const USE_CASES: UseCase[] = [
  {
    id: 'gaming',
    name: 'Gaming',
    description: 'High FPS, low latency. Prioritizes GPU and high-speed CPU.',
    icon: GamingIcon,
  },
  {
    id: 'video-editing',
    name: 'Video Editing',
    description: 'Smooth timeline scrubbing. Focuses on CPU cores, RAM, and fast storage.',
    icon: VideoEditingIcon,
  },
  {
    id: 'software-dev',
    name: 'Software Development',
    description: 'Fast compile times. Emphasizes CPU performance and ample RAM.',
    icon: CodeIcon,
  },
  {
    id: 'ai-research',
    name: 'AI Research',
    description: 'For deep learning models. Heavily relies on a powerful GPU with lots of VRAM.',
    icon: AiResearchIcon,
  },
  {
    id: 'cad',
    name: 'CAD',
    description: 'For 3D modeling and design. Balances single-core CPU speed and a professional GPU.',
    icon: CadIcon,
  },
];
