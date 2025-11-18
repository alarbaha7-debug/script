// 20 Niches for FacelessScriptPro

export const NICHES = [
  // ========================================
  // EMOTIONAL (4 niches)
  // ========================================
  {
    id: 'motivational',
    name: 'Motivational & Inspirational',
    category: 'emotional',
    styleType: 'Emotional - Inspiring',
    icon: '🔥',
    description: 'Inspiring stories that motivate and uplift viewers'
  },
  {
    id: 'heartwarming',
    name: 'Heartwarming Stories',
    category: 'emotional',
    styleType: 'Emotional - Heartwarming',
    icon: '❤️',
    description: 'Touching stories that warm the heart'
  },
  {
    id: 'tragic',
    name: 'Tragic Events',
    category: 'emotional',
    styleType: 'Emotional - Tragic',
    icon: '😢',
    description: 'Emotional stories of tragedy and loss'
  },
  {
    id: 'uplifting',
    name: 'Uplifting Journeys',
    category: 'emotional',
    styleType: 'Emotional - Uplifting',
    icon: '🌟',
    description: 'Stories of triumph and positive transformation'
  },

  // ========================================
  // HORROR (4 niches)
  // ========================================
  {
    id: 'paranormal',
    name: 'Paranormal Horror',
    category: 'horror',
    styleType: 'Horror - Paranormal',
    icon: '👻',
    description: 'Supernatural and ghostly encounters'
  },
  {
    id: 'psychological',
    name: 'Psychological Horror',
    category: 'horror',
    styleType: 'Horror - Psychological',
    icon: '🧠',
    description: 'Mind-bending psychological terror'
  },
  {
    id: 'creepypasta',
    name: 'Creepypasta Tales',
    category: 'horror',
    styleType: 'Horror - Creepypasta',
    icon: '🌐',
    description: 'Internet horror stories and urban legends'
  },
  {
    id: 'survival-horror',
    name: 'Survival Horror',
    category: 'horror',
    styleType: 'Horror - Survival',
    icon: '⚠️',
    description: 'Terrifying survival scenarios'
  },

  // ========================================
  // MYSTERY (4 niches)
  // ========================================
  {
    id: 'true-crime',
    name: 'True Crime',
    category: 'mystery',
    styleType: 'Mystery - True Crime',
    icon: '🔍',
    description: 'Real criminal cases and investigations'
  },
  {
    id: 'conspiracy',
    name: 'Conspiracy Theories',
    category: 'mystery',
    styleType: 'Mystery - Conspiracy',
    icon: '🕵️',
    description: 'Hidden truths and conspiracy theories'
  },
  {
    id: 'unexplained',
    name: 'Unexplained Phenomena',
    category: 'mystery',
    styleType: 'Mystery - Unexplained',
    icon: '🛸',
    description: 'Mysterious events without clear explanations'
  },
  {
    id: 'cold-case',
    name: 'Cold Cases',
    category: 'mystery',
    styleType: 'Mystery - Cold Case',
    icon: '📁',
    description: 'Unsolved mysteries and cold cases'
  },

  // ========================================
  // ADVENTURE (4 niches)
  // ========================================
  {
    id: 'survival',
    name: 'Survival Stories',
    category: 'adventure',
    styleType: 'Adventure - Survival',
    icon: '🏔️',
    description: 'Extreme survival situations'
  },
  {
    id: 'exploration',
    name: 'Exploration & Discovery',
    category: 'adventure',
    styleType: 'Adventure - Exploration',
    icon: '🗺️',
    description: 'Journeys of exploration and discovery'
  },
  {
    id: 'historical-adventure',
    name: 'Historical Adventures',
    category: 'adventure',
    styleType: 'Adventure - Historical',
    icon: '⚔️',
    description: 'Epic historical adventures and quests'
  },
  {
    id: 'extreme-sports',
    name: 'Extreme Challenges',
    category: 'adventure',
    styleType: 'Adventure - Extreme',
    icon: '🪂',
    description: 'Extreme sports and daring challenges'
  },

  // ========================================
  // EDUCATIONAL (4 niches)
  // ========================================
  {
    id: 'science',
    name: 'Science & Nature',
    category: 'educational',
    styleType: 'Educational - Science',
    icon: '🔬',
    description: 'Scientific discoveries and natural phenomena'
  },
  {
    id: 'history',
    name: 'Historical Events',
    category: 'educational',
    styleType: 'Educational - History',
    icon: '📜',
    description: 'Important historical events and figures'
  },
  {
    id: 'philosophy',
    name: 'Philosophy & Psychology',
    category: 'educational',
    styleType: 'Educational - Philosophy',
    icon: '💭',
    description: 'Philosophical concepts and psychological insights'
  },
  {
    id: 'technology',
    name: 'Technology & Future',
    category: 'educational',
    styleType: 'Educational - Tech',
    icon: '🤖',
    description: 'Technology innovations and future predictions'
  }
];

// Group niches by category
export const NICHES_BY_CATEGORY = {
  emotional: NICHES.filter(n => n.category === 'emotional'),
  horror: NICHES.filter(n => n.category === 'horror'),
  mystery: NICHES.filter(n => n.category === 'mystery'),
  adventure: NICHES.filter(n => n.category === 'adventure'),
  educational: NICHES.filter(n => n.category === 'educational')
};

// Category labels
export const CATEGORIES = [
  { id: 'emotional', name: 'Emotional', icon: '❤️' },
  { id: 'horror', name: 'Horror', icon: '👻' },
  { id: 'mystery', name: 'Mystery', icon: '🔍' },
  { id: 'adventure', name: 'Adventure', icon: '🗺️' },
  { id: 'educational', name: 'Educational', icon: '📚' }
];

// Target character count options
export const TARGET_LENGTHS = [
  { value: 10000, label: '10K Characters (~2,000 words)', recommended: 'Quick video' },
  { value: 30000, label: '30K Characters (~6,000 words)', recommended: 'Standard video' },
  { value: 50000, label: '50K Characters (~10,000 words)', recommended: 'Long video' },
  { value: 75000, label: '75K Characters (~15,000 words)', recommended: 'Extended video' },
  { value: 100000, label: '100K Characters (~20,000 words)', recommended: 'Epic video' }
];
