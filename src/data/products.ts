export interface Product {
  name: string
  description: string
  image: string
  rating: number
  reviews: number
  bookmarks: number
  tags: string[]
  categories: string[]
  featured: boolean
  link: string
}

export const products: Product[] = [
  {
    name: 'AI Writer Pro',
    description: 'Advanced AI writing assistant for content creation and editing with support for multiple languages.',
    image: 'https://picsum.photos/seed/aiwriter/60',
    rating: 4.5,
    reviews: 128,
    bookmarks: 74,
    tags: ['Writing', 'Content Creation', 'AI Assistant'],
    categories: ['Writing & Editing'],
    featured: true,
    link: 'https://aiwriter.example.com'
  },
  {
    name: 'DataBot Analytics',
    description: 'Powerful data analysis and visualization tool powered by artificial intelligence.',
    image: 'https://picsum.photos/seed/databot/60',
    rating: 4.8,
    reviews: 256,
    bookmarks: 145,
    tags: ['Analytics', 'Data Science', 'Business Intelligence'],
    categories: ['Back Office', 'Operations'],
    featured: true,
    link: 'https://databot.example.com'
  },
  {
    name: 'SmartFlow Automation',
    description: 'No-code automation platform for streamlining business processes with AI capabilities.',
    image: 'https://picsum.photos/seed/smartflow/60',
    rating: 4.2,
    reviews: 96,
    bookmarks: 37,
    tags: ['Automation', 'Workflow', 'No-Code'],
    categories: ['Workflow Automation', 'Operations'],
    featured: false,
    link: 'https://smartflow.example.com'
  },
  {
    name: 'DesignAI Studio',
    description: 'AI-powered design tool for creating professional graphics and illustrations instantly.',
    image: 'https://picsum.photos/seed/designai/60',
    rating: 4.6,
    reviews: 184,
    bookmarks: 128,
    tags: ['Design', 'Graphics', 'Creative'],
    categories: ['Design & Creative'],
    featured: true,
    link: 'https://designai.example.com'
  },
  {
    name: 'AI Code Assistant',
    description: 'Intelligent coding companion that helps developers write better code faster with real-time suggestions.',
    image: 'https://picsum.photos/seed/codecomp/60',
    rating: 4.7,
    reviews: 312,
    bookmarks: 189,
    tags: ['Development', 'Coding', 'Productivity'],
    categories: ['Technology & IT'],
    featured: true,
    link: 'https://codeassistant.example.com'
  }
] 