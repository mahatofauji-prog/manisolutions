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
  
  // solutionsStorage
  content = content.replace(
    /delete\(id: string\): boolean \{[\s\S]*?deleteDoc\(doc\(db, 'portfolio_solutions', id\)\)\.catch\(err => \{[\s\S]*?console\.error\('Firestore delete portfolio solution sync failed:', err\);[\s\S]*?\}\);[\s\S]*?notifyListeners\(\);[\s\S]*?return true;[\s\S]*?\}/m,
    `async delete(id: string): Promise<boolean> {
    if (!this.isAdminAuthenticated()) {
      throw new Error('Unauthorized attempt to delete solution');
    }
    try {
      await deleteDoc(doc(db, 'portfolio_solutions', id));
      return true;
    } catch (err) {
      console.error('Failed to delete solution', err);
      throw err;
    }
  }`
  );

  // businessAiStorage
  content = content.replace(
    /delete\(id: string\): void \{[\s\S]*?deleteDoc\(doc\(db, 'business_ai_solutions', id\)\)\.catch\(err => \{[\s\S]*?console\.error\('Firestore delete business AI item error:', err\);[\s\S]*?\}\);[\s\S]*?notifyListeners\(\);[\s\S]*?\}/m,
    `async delete(id: string): Promise<void> {
    if (!solutionsStorage.isAdminAuthenticated()) {
      throw new Error('Unauthorized: Admin credentials required');
    }
    try {
      await deleteDoc(doc(db, 'business_ai_solutions', id));
    } catch (err) {
      console.error('Firestore delete business AI item error:', err);
      throw err;
    }
  }`
  );

  // readySolutionsStorage
  content = content.replace(
    /delete\(id: string\): void \{[\s\S]*?deleteDoc\(doc\(db, 'ready_solutions', id\)\)\.catch\(err => \{[\s\S]*?console\.error\('Firestore delete ready solution error:', err\);[\s\S]*?\}\);[\s\S]*?notifyListeners\(\);[\s\S]*?\}/m,
    `async delete(id: string): Promise<void> {
    if (!solutionsStorage.isAdminAuthenticated()) {
      throw new Error('Unauthorized: Admin credentials required');
    }
    try {
      await deleteDoc(doc(db, 'ready_solutions', id));
    } catch (err) {
      console.error('Firestore delete ready solution error:', err);
      throw err;
    }
  }`
  );

  // workStorage
  content = content.replace(
    /delete\(id: string\): void \{[\s\S]*?deleteDoc\(doc\(db, 'work_applications', id\)\)\.catch\(err => \{[\s\S]*?console\.error\('Firestore delete work app error:', err\);[\s\S]*?\}\);[\s\S]*?notifyListeners\(\);[\s\S]*?\}/m,
    `async delete(id: string): Promise<void> {
    if (!solutionsStorage.isAdminAuthenticated()) {
      throw new Error('Unauthorized: Admin credentials required');
    }
    try {
      await deleteDoc(doc(db, 'work_applications', id));
    } catch (err) {
      console.error('Firestore delete work app error:', err);
      throw err;
    }
  }`
  );

  // customSolutionOrderStorage
  content = content.replace(
    /delete\(id: string\): boolean \{[\s\S]*?deleteDoc\(doc\(db, 'custom_solution_orders', id\)\)\.catch\(err => \{[\s\S]*?console\.error\('Firestore delete order error:', err\);[\s\S]*?\}\);[\s\S]*?notifyListeners\(\);[\s\S]*?return true;[\s\S]*?\}/m,
    `async delete(id: string): Promise<boolean> {
    if (!solutionsStorage.isAdminAuthenticated()) {
      throw new Error('Unauthorized: Admin credentials required');
    }
    try {
      await deleteDoc(doc(db, 'custom_solution_orders', id));
      return true;
    } catch (err) {
      console.error('Firestore delete order error:', err);
      throw err;
    }
  }`
  );

  // enquiryStorage
  content = content.replace(
    /delete\(id: string\): boolean \{[\s\S]*?deleteDoc\(doc\(db, 'enquiries', id\)\)\.catch\(err => \{[\s\S]*?console\.error\('Firestore delete enquiry error:', err\);[\s\S]*?\}\);[\s\S]*?notifyListeners\(\);[\s\S]*?return true;[\s\S]*?\}/m,
    `async delete(id: string): Promise<boolean> {
    if (!solutionsStorage.isAdminAuthenticated()) {
      throw new Error('Unauthorized: Admin credentials required');
    }
    try {
      await deleteDoc(doc(db, 'enquiries', id));
      return true;
    } catch (err) {
      console.error('Firestore delete enquiry error:', err);
      throw err;
    }
  }`
  );

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Updated ${file}`);
}
