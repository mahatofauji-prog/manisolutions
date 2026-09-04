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
  
  // 1. Remove the fallback to INITIAL_... in the initial cache setup
  // e.g. let inMemorySolutions = [...INITIAL_SOLUTIONS]; -> let inMemorySolutions: SolutionItem[] = [];
  content = content.replace(/let inMemorySolutions: SolutionItem\[\] = \[\.\.\.INITIAL_SOLUTIONS\];/, 'let inMemorySolutions: SolutionItem[] = [];');
  content = content.replace(/let memoryCache: BusinessAiItem\[\] = \[\.\.\.INITIAL_DATA\];/, 'let memoryCache: BusinessAiItem[] = [];');
  content = content.replace(/let inMemoryReadySolutions: ReadySolutionItem\[\] = \[\.\.\.INITIAL_READY_SOLUTIONS\];/, 'let inMemoryReadySolutions: ReadySolutionItem[] = [];');
  content = content.replace(/let memoryCache: WorkApplicationItem\[\] = \[\.\.\.INITIAL_APPLICATIONS\];/, 'let memoryCache: WorkApplicationItem[] = [];');
  content = content.replace(/let inMemoryCustomOrders: CustomSolutionOrder\[\] = \[\.\.\.INITIAL_SAMPLE_ORDERS\];/, 'let inMemoryCustomOrders: CustomSolutionOrder[] = [];');

  // 2. Remove the snapshot.empty reseeding block in onSnapshot
  // This is tricky because it has varying variable names. I will use a regex to match the if (snapshot.empty) { ... } block up to the else.
  // Generally it looks like:
  /*
      if (snapshot.empty) {
        if (INITIAL_SOLUTIONS.length > 0) {
           ...
        }
        inMemorySolutions = [...INITIAL_SOLUTIONS];
        notifyListeners();
      } else {
        const items = snapshot.docs.map...
  */
  
  // We can just replace the entire if (snapshot.empty) { ... } else { ... } with just the content of the else block plus an empty check if we want, or just let the map return empty.
  // Actually, if snapshot.empty is true, snapshot.docs.map returns []. So we don't even need the if/else! We can just do:
  // const items = snapshot.docs.map(...)
  // update cache
  // notifyListeners()
  
  // Let's manually write replacements for the 5 files to be safe.
}
