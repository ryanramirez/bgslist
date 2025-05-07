export interface BoardGameGenre {
  id: string;
  name: string;
  description?: string;
}

export const boardGameGenres: BoardGameGenre[] = [
  {
    id: "eurogame",
    name: "Eurogame",
    description: "Strategy games that emphasize indirect conflict and economic mechanics"
  },
  {
    id: "ameritrash",
    name: "Ameritrash",
    description: "Thematic games with direct conflict, often featuring dice and luck"
  },
  {
    id: "worker-placement",
    name: "Worker Placement",
    description: "Games where players allocate limited workers to various actions"
  },
  {
    id: "deck-building",
    name: "Deck Building",
    description: "Players build a personal deck of cards throughout the game"
  },
  {
    id: "cooperative",
    name: "Cooperative",
    description: "Players work together against the game to achieve a common goal"
  },
  {
    id: "area-control",
    name: "Area Control",
    description: "Players compete to control territories or regions on a map"
  },
  {
    id: "dungeon-crawler",
    name: "Dungeon Crawler",
    description: "Adventure games where players explore dungeons and fight monsters"
  },
  {
    id: "abstract",
    name: "Abstract Strategy",
    description: "Games with minimal theme and luck, focused on pure strategy"
  },
  {
    id: "legacy",
    name: "Legacy",
    description: "Games that change permanently as you play through multiple sessions"
  },
  {
    id: "engine-building",
    name: "Engine Building",
    description: "Players create increasingly efficient systems throughout the game"
  },
  {
    id: "drafting",
    name: "Drafting",
    description: "Players select cards or other components from a shared pool"
  },
  {
    id: "roll-write",
    name: "Roll & Write",
    description: "Games where players roll dice and write results on sheets"
  },
  {
    id: "4x",
    name: "4X",
    description: "Games involving eXploration, eXpansion, eXploitation, and eXtermination"
  },
  {
    id: "party",
    name: "Party Game",
    description: "Light, social games designed for large groups and casual play"
  },
  {
    id: "wargame",
    name: "Wargame",
    description: "Games simulating military conflicts and battles"
  },
  {
    id: "dexterity",
    name: "Dexterity",
    description: "Games requiring physical skill and coordination"
  },
  {
    id: "push-your-luck",
    name: "Push Your Luck",
    description: "Games where players risk current gains for potentially greater rewards"
  },
  {
    id: "social-deduction",
    name: "Social Deduction",
    description: "Games where players deduce hidden roles or information through social interaction"
  },
  {
    id: "trick-taking",
    name: "Trick-Taking",
    description: "Card games where players compete to win tricks"
  },
  {
    id: "tile-placement",
    name: "Tile Placement",
    description: "Games where players strategically place tiles to build patterns or maps"
  }
]; 