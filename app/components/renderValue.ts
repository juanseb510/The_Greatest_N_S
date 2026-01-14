// app/components/renderValue.ts

// Renders a value string into HTML for jsPsych stimuli.
// Key requirement: fractions must be displayed vertically (stacked), not "a/b".

export function renderValueHTML(raw: string): string {
  const value = (raw ?? "").trim();

  // Detect simple fractions like "13/20"
  const fracMatch = value.match(/^(\d+)\s*\/\s*(\d+)$/);
  if (fracMatch) {
    const n = fracMatch[1];
    const d = fracMatch[2];

    // Inline styles so this works inside jsPsych HTML strings (no Tailwind reliance)
    return `
      <span aria-label="${n} over ${d}" style="
        display:inline-flex;
        flex-direction:column;
        align-items:center;
        justify-content:center;
        font-family:'Courier New', monospace;
        font-weight:900;
        color:black;
        line-height:1;
      ">
        <span style="padding:0 6px; border-bottom:4px solid black; font-size:46px;">
          ${n}
        </span>
        <span style="padding:0 6px; font-size:46px;">
          ${d}
        </span>
      </span>
    `;
  }

  // Default: decimals, percents, whole numbers, etc.
  // Keep the same “monster math” bold look.
  return `
    <span style="
      font-family:'Courier New', monospace;
      font-weight:900;
      color:black;
      font-size:50px;
    ">
      ${escapeHtml(value)}
    </span>
  `;
}

// Prevent HTML injection inside jsPsych strings
function escapeHtml(input: string): string {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
