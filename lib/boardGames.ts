export interface BoardGame {
  id: string;
  name: string;
  publisher?: string;
  year?: number;
}

export const popularBoardGames: BoardGame[] = [
  { id: "catan", name: "Catan", publisher: "Kosmos", year: 1995 },
  { id: "ticket-to-ride", name: "Ticket to Ride", publisher: "Days of Wonder", year: 2004 },
  { id: "pandemic", name: "Pandemic", publisher: "Z-Man Games", year: 2008 },
  { id: "scythe", name: "Scythe", publisher: "Stonemaier Games", year: 2016 },
  { id: "gloomhaven", name: "Gloomhaven", publisher: "Cephalofair Games", year: 2017 },
  { id: "terraforming-mars", name: "Terraforming Mars", publisher: "FryxGames", year: 2016 },
  { id: "wingspan", name: "Wingspan", publisher: "Stonemaier Games", year: 2019 },
  { id: "azul", name: "Azul", publisher: "Plan B Games", year: 2017 },
  { id: "spirit-island", name: "Spirit Island", publisher: "Greater Than Games", year: 2017 },
  { id: "root", name: "Root", publisher: "Leder Games", year: 2018 },
  { id: "brass-birmingham", name: "Brass: Birmingham", publisher: "Roxley", year: 2018 },
  { id: "7-wonders", name: "7 Wonders", publisher: "Repos Production", year: 2010 },
  { id: "dominion", name: "Dominion", publisher: "Rio Grande Games", year: 2008 },
  { id: "cosmic-encounter", name: "Cosmic Encounter", publisher: "Fantasy Flight Games", year: 1977 },
  { id: "concordia", name: "Concordia", publisher: "PD-Verlag", year: 2013 },
  { id: "agricola", name: "Agricola", publisher: "Lookout Games", year: 2007 },
  { id: "power-grid", name: "Power Grid", publisher: "Rio Grande Games", year: 2004 },
  { id: "arkham-horror-lcg", name: "Arkham Horror: The Card Game", publisher: "Fantasy Flight Games", year: 2016 },
  { id: "mysterium", name: "Mysterium", publisher: "Libellud", year: 2015 },
  { id: "twilight-imperium", name: "Twilight Imperium", publisher: "Fantasy Flight Games", year: 1997 },
  { id: "everdell", name: "Everdell", publisher: "Starling Games", year: 2018 },
  { id: "blood-rage", name: "Blood Rage", publisher: "CMON", year: 2015 },
  { id: "splendor", name: "Splendor", publisher: "Space Cowboys", year: 2014 },
  { id: "codenames", name: "Codenames", publisher: "Czech Games Edition", year: 2015 },
  { id: "settlers-of-catan", name: "The Settlers of Catan", publisher: "Kosmos", year: 1995 },
  { id: "puerto-rico", name: "Puerto Rico", publisher: "Alea", year: 2002 },
  { id: "carcassonne", name: "Carcassonne", publisher: "Hans im Glück", year: 2000 },
  { id: "dixit", name: "Dixit", publisher: "Libellud", year: 2008 },
  { id: "patchwork", name: "Patchwork", publisher: "Lookout Games", year: 2014 },
  { id: "century-spice-road", name: "Century: Spice Road", publisher: "Plan B Games", year: 2017 },
  { id: "kingdomino", name: "Kingdomino", publisher: "Blue Orange Games", year: 2016 },
  { id: "betrayal-house-hill", name: "Betrayal at House on the Hill", publisher: "Avalon Hill", year: 2004 },
  { id: "dead-winter", name: "Dead of Winter", publisher: "Plaid Hat Games", year: 2014 },
  { id: "clank", name: "Clank!", publisher: "Renegade Game Studios", year: 2016 },
  { id: "tzolkin", name: "Tzolk'in: The Mayan Calendar", publisher: "Czech Games Edition", year: 2012 },
  { id: "terra-mystica", name: "Terra Mystica", publisher: "Feuerland Spiele", year: 2012 },
  { id: "too-many-bones", name: "Too Many Bones", publisher: "Chip Theory Games", year: 2017 },
  { id: "great-western-trail", name: "Great Western Trail", publisher: "eggertspiele", year: 2016 },
  { id: "forbidden-island", name: "Forbidden Island", publisher: "Gamewright", year: 2010 },
  { id: "lords-of-waterdeep", name: "Lords of Waterdeep", publisher: "Wizards of the Coast", year: 2012 }
]; 