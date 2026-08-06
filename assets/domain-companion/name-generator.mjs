import { normalizeLabel, uniqueLabels, words } from "./normalization.mjs";

function initials(...values) {
  return values.flatMap(words).map((word) => word[0]).join("");
}

export function generateLabels(portrait = {}) {
  const first = normalizeLabel(portrait.firstName);
  const middle = normalizeLabel(portrait.middleName);
  const last = normalizeLabel(portrait.lastName);
  const nickname = normalizeLabel(portrait.nickname);
  const territory = normalizeLabel(portrait.territory);
  const projects = (portrait.projects || []).map(normalizeLabel).filter(Boolean);
  const passions = (portrait.passions || []).map(normalizeLabel).filter(Boolean);
  const activity = normalizeLabel(portrait.activity);
  const identity = uniqueLabels([
    [first, last].filter(Boolean).join("-"),
    [first, middle, last].filter(Boolean).join("-"),
    [last, first].filter(Boolean).join("-"),
    [first?.[0], last].filter(Boolean).join(""),
    [first, last?.[0]].filter(Boolean).join(""),
    initials(portrait.firstName, portrait.middleName, portrait.lastName),
    nickname,
    [nickname, last].filter(Boolean).join("-"),
    last
  ]);

  const professional = uniqueLabels([
    last,
    [last, activity].filter(Boolean).join("-"),
    [nickname || first, activity].filter(Boolean).join("-"),
    [last, projects[0]].filter(Boolean).join("-"),
    [nickname || first, projects[0]].filter(Boolean).join("-"),
    activity,
    ...projects
  ]);

  const creative = uniqueLabels([
    [nickname || first, passions[0]].filter(Boolean).join("-"),
    [territory, passions[0]].filter(Boolean).join("-"),
    [nickname || first, territory].filter(Boolean).join("-"),
    ...passions,
    ...projects.map((project) => [project, territory].filter(Boolean).join("-"))
  ]);

  const rare = uniqueLabels([
    [initials(portrait.firstName, portrait.lastName), passions[0]].filter(Boolean).join("-"),
    [nickname || first, projects[0], territory].filter(Boolean).join("-"),
    [last, passions[0]].filter(Boolean).join("-"),
    [territory, nickname || first].filter(Boolean).join("-")
  ]);

  return { identity, professional, creative, rare };
}
