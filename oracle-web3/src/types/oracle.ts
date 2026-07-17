export type OracleCard = {
  id: string;
  number: number;
  name: string;
  subtitle: string;
  category: string;
  web2Problem: string;
  livedSituation: string;
  web3Benefit: string;
  practicalChange: string;
  caution: string;
  keywords: string[];
};

export type OracleReading = {
  title: string;
  introduction: string;
  past: string;
  present: string;
  future: string;
  synthesis: string;
  caution: string;
  conclusion: string;
};

export type OracleStage = "selection" | "revealing" | "reading";
