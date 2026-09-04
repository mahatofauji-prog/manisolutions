const fs = require('fs');
const path = require('path');

const files = [
  'src/services/solutionsStorage.ts',
  'src/services/businessAiStorage.ts',
  'src/services/readySolutionsStorage.ts',
  'src/services/workStorage.ts',
  'src/services/customSolutionOrderStorage.ts',
  'src/services/enquiryStorage.ts'
];

for (const file of files) {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) continue;
  
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // 1. Remove INITIAL_ data fallbacks
  content = content.replace(/let inMemorySolutions: SolutionItem\[\] = \[\.\.\.INITIAL_SOLUTIONS\];/, 'let inMemorySolutions: SolutionItem[] = [];');
  content = content.replace(/let memoryCache: BusinessAiItem\[\] = \[\.\.\.INITIAL_DATA\];/, 'let memoryCache: BusinessAiItem[] = [];');
  content = content.replace(/let inMemoryReadySolutions: ReadySolutionItem\[\] = \[\.\.\.INITIAL_READY_SOLUTIONS\];/, 'let inMemoryReadySolutions: ReadySolutionItem[] = [];');
  content = content.replace(/let memoryCache: WorkApplicationItem\[\] = \[\.\.\.INITIAL_APPLICATIONS\];/, 'let memoryCache: WorkApplicationItem[] = [];');
  content = content.replace(/let inMemoryCustomOrders: CustomSolutionOrder\[\] = \[\.\.\.INITIAL_SAMPLE_ORDERS\];/, 'let inMemoryCustomOrders: CustomSolutionOrder[] = [];');
  content = content.replace(/let inMemoryEnquiries: EnquiryItem\[\] = \[\];/, 'let inMemoryEnquiries: EnquiryItem[] = [];');

  // 2. Fix delete methods to actually await deleteDoc and NOT optimistically update local cache.
  // Wait, instead of rewriting delete methods, what if we just remove the optimistic update?
  // Let's first fix the snapshot.empty issue.
  
  // A regex to match the if (snapshot.empty) block and replace it with just the else block.
  // We can use a regex that matches `if (snapshot.empty) { ... } else {` and removes it, then removes the closing `}`.
  
  // Actually, I can just replace `if (snapshot.empty)` with `if (false)` to disable it, and let the `else` block handle empty states. But wait, `if(false)` means `else` runs, which is `const items = snapshot.docs.map(...)`. That's perfect because if it's empty, `docs.map` is empty array `[]`, which is exactly what we want!
  
  content = content.replace(/if \(snapshot\.empty\) \{/g, 'if (false) { // snapshot.empty logic removed to prevent auto-reseeding\n');

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Updated ${file}`);
}
