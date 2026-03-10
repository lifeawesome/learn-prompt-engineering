import raw from "./lab-scenarios.json";

export type LabScenarioBase = {
  id: string;
  title: string;
  brief: string;
  instructions: string[];
  starterCode: string;
  hint: string;
  whyItMatters: string;
};

export type LabScenario =
  | (LabScenarioBase & { checkType: "regex"; pattern: RegExp })
  | (LabScenarioBase & {
      checkType: "substrings";
      requiredSubstrings: string[];
    });

type RawScenario = {
  id: string;
  title: string;
  brief: string;
  instructions: string[];
  starterCode: string;
  hint: string;
  checkType: "regex" | "substrings";
  whyItMatters: string;
} & (
  | { checkType: "regex"; pattern: string }
  | { checkType: "substrings"; requiredSubstrings: string[] }
);

function compileScenario(rawScenario: RawScenario): LabScenario {
  const base: LabScenarioBase = {
    id: rawScenario.id,
    title: rawScenario.title,
    brief: rawScenario.brief,
    instructions: rawScenario.instructions,
    starterCode: rawScenario.starterCode,
    hint: rawScenario.hint,
    whyItMatters: rawScenario.whyItMatters,
  };
  if (rawScenario.checkType === "regex") {
    return {
      ...base,
      checkType: "regex",
      pattern: new RegExp(rawScenario.pattern),
    };
  }
  return {
    ...base,
    checkType: "substrings",
    requiredSubstrings: rawScenario.requiredSubstrings,
  };
}

export const labScenarios: LabScenario[] = (
  raw as { scenarios: RawScenario[] }
).scenarios.map(compileScenario);
