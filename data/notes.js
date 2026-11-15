// Sample data (acts as our "database"). Served to the app through /api/notes.
export const CATEGORIES = ["Computer Science", "Mathematics", "Physics", "Chemistry", "Business", "Biology"];

export const notes = [
  { id: "1", title: "Data Structures: Complete Unit Notes", subject: "Computer Science", sellerName: "Aanya S.", price: 99, type: "Handwritten", pages: 42,
    description: "Arrays to graphs, with dry runs and exam-style questions.",
    preview: ["Linked List: each node stores data + address of next node.", "Stack = LIFO. push() adds on top, pop() removes from top.", "Binary Tree traversals: Inorder, Preorder, Postorder."], baseSum: 46, baseCount: 10 },
  { id: "2", title: "Calculus Formula Sheet + Solved Examples", subject: "Mathematics", sellerName: "Rohan K.", price: 49, type: "PDF", pages: 18,
    description: "Limits, derivatives and integrals on one page per topic.",
    preview: ["d/dx (x^n) = n·x^(n-1)", "∫ sin x dx = -cos x + C", "Chain rule: d/dx f(g(x)) = f'(g(x))·g'(x)"], baseSum: 38, baseCount: 9 },
  { id: "3", title: "Operating Systems Quick Revision", subject: "Computer Science", sellerName: "Meera P.", price: 79, type: "Handwritten", pages: 30,
    description: "Scheduling, deadlocks, memory management with diagrams.",
    preview: ["Process vs Thread: a thread is a lightweight process.", "FCFS, SJF, Round Robin scheduling with Gantt charts.", "Deadlock needs 4 conditions: mutual exclusion, hold & wait, no pre-emption, circular wait."], baseSum: 27, baseCount: 6 },
  { id: "4", title: "Physics: Electromagnetism Summary", subject: "Physics", sellerName: "Kabir D.", price: 59, type: "PDF", pages: 24,
    description: "Maxwell's equations explained in plain language.",
    preview: ["Coulomb's law: F = k q1 q2 / r²", "Gauss's law relates flux to enclosed charge.", "Faraday's law: changing flux induces EMF."], baseSum: 21, baseCount: 5 },
  { id: "5", title: "Organic Chemistry Reaction Map", subject: "Chemistry", sellerName: "Simran G.", price: 89, type: "Handwritten", pages: 36,
    description: "Named reactions and mechanisms, colour coded.",
    preview: ["SN1 vs SN2: SN2 is one step, inversion of configuration.", "Aldol condensation forms C–C bond between carbonyls.", "Markovnikov's rule decides where H adds."], baseSum: 44, baseCount: 10 },
  { id: "6", title: "Principles of Management Notes", subject: "Business", sellerName: "Aditya M.", price: 39, type: "PDF", pages: 20,
    description: "Fayol, Taylor, planning and organising in short points.",
    preview: ["Fayol's 14 principles of management.", "Taylor's scientific management: one best way.", "SWOT: Strengths, Weaknesses, Opportunities, Threats."], baseSum: 14, baseCount: 4 },
];
