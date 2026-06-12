export const targetText = "Code Typing Speed";

export const typingTimeline = [
  { text: "", delay: 1000 },
  { text: "C", delay: 180 },
  { text: "Co", delay: 150 },
  { text: "Cod", delay: 120 },
  { text: "Code", delay: 160 },
  { text: "Code ", delay: 200 },
  { text: "Code T", delay: 220 },
  { text: "Code Ty", delay: 140 },
  { text: "Code Typ", delay: 130 },
  { text: "Code Typo", delay: 500 }, // Error state
  { text: "Code Typ", delay: 200 },  // Backspace
  { text: "Code Typi", delay: 250 }, // Corrected type
  { text: "Code Typin", delay: 140 },
  { text: "Code Typing", delay: 160 },
  { text: "Code Typing ", delay: 185 },
  { text: "Code Typing S", delay: 220 },
  { text: "Code Typing Sp", delay: 130 },
  { text: "Code Typing Spe", delay: 120 },
  { text: "Code Typing Spee", delay: 150 },
  { text: "Code Typing Speed", delay: 3500 }, // Hold complete state
];
