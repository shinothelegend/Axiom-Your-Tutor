import { DoubtSolutionResponse, VaultItem } from '../types';

export function exportSolutionToMarkdown(solution: DoubtSolutionResponse, query?: string): string {
  let md = `# Axiom Doubt Resolution: ${solution.identifiedTopic}\n\n`;
  if (query) {
    md += `> **Question:** ${query}\n\n`;
  }
  md += `**Core Concept:** ${solution.coreConcept}\n\n`;
  
  if (solution.prerequisites && solution.prerequisites.length > 0) {
    md += `### Prerequisites\n`;
    solution.prerequisites.forEach((p) => {
      md += `- ${p}\n`;
    });
    md += `\n`;
  }

  md += `## Step-by-Step Derivation\n\n`;
  solution.steps.forEach((step) => {
    md += `### Step ${step.stepNumber}: ${step.title}\n`;
    md += `${step.explanation}\n\n`;
    if (step.mathLatex) {
      md += `$$\n${step.mathLatex}\n$$\n\n`;
    }
    if (step.examMarksAllocated) {
      md += `*Exam Allocation:* \`${step.examMarksAllocated}\`\n\n`;
    }
  });

  if (solution.socraticHints && solution.socraticHints.length > 0) {
    md += `## Socratic Guidance\n\n`;
    solution.socraticHints.forEach((hint, idx) => {
      md += `**Hint ${idx + 1}:** ${hint}\n\n`;
    });
  }

  if (solution.commonMistakes && solution.commonMistakes.length > 0) {
    md += `## Common Pitfalls & Exam Traps\n\n`;
    solution.commonMistakes.forEach((m) => {
      md += `- ${m}\n`;
    });
    md += `\n`;
  }

  if (solution.practiceChallenge) {
    md += `## Practice Challenge\n\n`;
    md += `**Question:** ${solution.practiceChallenge.question}\n\n`;
    if (solution.practiceChallenge.mathLatex) {
      md += `$$\n${solution.practiceChallenge.mathLatex}\n$$\n\n`;
    }
    md += `**Hint:** ${solution.practiceChallenge.hint}\n\n`;
    md += `**Answer:** ${solution.practiceChallenge.answer}\n`;
  }

  return md;
}

export function downloadFile(filename: string, content: string, contentType: string) {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportVaultToJSON(vault: VaultItem[]) {
  const jsonStr = JSON.stringify(vault, null, 2);
  const filename = `axiom_vault_backup_${new Date().toISOString().slice(0, 10)}.json`;
  downloadFile(filename, jsonStr, 'application/json');
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Clipboard copy error:', err);
    return false;
  }
}
