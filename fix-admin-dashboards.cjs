const fs = require('fs');
const path = require('path');

const dashboards = [
  'AdminDashboard.tsx',
  'AdminAiAutomationDashboard.tsx',
  'AdminReadySolutionsDashboard.tsx',
  'AdminWorkApplicationsDashboard.tsx',
  'AdminCustomOrdersDashboard.tsx',
  'AdminEnquiriesDashboard.tsx'
];

for (const dbName of dashboards) {
  const filePath = path.join(__dirname, 'src/components/admin', dbName);
  if (!fs.existsSync(filePath)) continue;
  
  let content = fs.readFileSync(filePath, 'utf-8');

  // AdminDashboard.tsx
  if (dbName === 'AdminDashboard.tsx') {
    content = content.replace(
      /const handleDelete = \(id: string\) => \{[\s\S]*?solutionsStorage\.delete\(id\);[\s\S]*?setDeleteConfirmId\(null\);[\s\S]*?loadData\(\);[\s\S]*?\};/m,
      `const handleDelete = async (id: string) => {
    try {
      await solutionsStorage.delete(id);
      setDeleteConfirmId(null);
      alert('Solution deleted successfully.');
    } catch (err) {
      console.error(err);
      alert('Failed to delete solution. Please try again.');
    }
  };`
    );
  }

  // AdminAiAutomationDashboard.tsx
  if (dbName === 'AdminAiAutomationDashboard.tsx') {
    content = content.replace(
      /const confirmDelete = async \(\) => \{[\s\S]*?if \(\!deleteTarget\) return;[\s\S]*?return new Promise<void>\(\(resolve, reject\) => \{[\s\S]*?try \{[\s\S]*?businessAiStorage\.delete\(deleteTarget\.id\);[\s\S]*?setDeleteTarget\(null\);[\s\S]*?loadData\(\);[\s\S]*?resolve\(\);[\s\S]*?\} catch \(err\) \{[\s\S]*?reject\(err\);[\s\S]*?\}[\s\S]*?\}\);[\s\S]*?\};/m,
      `const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await businessAiStorage.delete(deleteTarget.id);
      setDeleteTarget(null);
      alert('Solution deleted successfully.');
    } catch (err) {
      console.error(err);
      alert('Failed to delete solution. Please try again.');
    }
  };`
    );
  }

  // AdminReadySolutionsDashboard.tsx
  if (dbName === 'AdminReadySolutionsDashboard.tsx') {
    content = content.replace(
      /const confirmDelete = async \(\) => \{[\s\S]*?if \(\!deleteTarget\) return;[\s\S]*?return new Promise<void>\(\(resolve, reject\) => \{[\s\S]*?try \{[\s\S]*?if \(deleteTarget\.type === 'solution'\) \{[\s\S]*?readySolutionsStorage\.delete\(deleteTarget\.id\);[\s\S]*?\} else \{[\s\S]*?readySolutionsStorage\.deleteRequest\(deleteTarget\.id\);[\s\S]*?\}[\s\S]*?setDeleteTarget\(null\);[\s\S]*?loadData\(\);[\s\S]*?resolve\(\);[\s\S]*?\} catch \(err\) \{[\s\S]*?reject\(err\);[\s\S]*?\}[\s\S]*?\}\);[\s\S]*?\};/m,
      `const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.type === 'solution') {
        await readySolutionsStorage.delete(deleteTarget.id);
      } else {
        await readySolutionsStorage.deleteRequest(deleteTarget.id);
      }
      setDeleteTarget(null);
      alert('Item deleted successfully.');
    } catch (err) {
      console.error(err);
      alert('Failed to delete item. Please try again.');
    }
  };`
    );
  }

  // AdminWorkApplicationsDashboard.tsx
  if (dbName === 'AdminWorkApplicationsDashboard.tsx') {
    content = content.replace(
      /const handleDelete = \(id: string\) => \{[\s\S]*?if \(window\.confirm\('Are you sure you want to delete this application\?'\)\) \{[\s\S]*?workStorage\.delete\(id\);[\s\S]*?loadData\(\);[\s\S]*?\}[\s\S]*?\};/m,
      `const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to permanently delete this application?')) {
      try {
        await workStorage.delete(id);
        alert('Application deleted successfully.');
      } catch (err) {
        console.error(err);
        alert('Failed to delete application. Please try again.');
      }
    }
  };`
    );
  }

  // AdminCustomOrdersDashboard.tsx
  if (dbName === 'AdminCustomOrdersDashboard.tsx') {
    content = content.replace(
      /const handleDelete = \(id: string\) => \{[\s\S]*?if \(window\.confirm\('Are you sure you want to delete this order\?'\)\) \{[\s\S]*?customSolutionOrderStorage\.delete\(id\);[\s\S]*?loadOrders\(\);[\s\S]*?\}[\s\S]*?\};/m,
      `const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to permanently delete this order?')) {
      try {
        await customSolutionOrderStorage.delete(id);
        alert('Order deleted successfully.');
      } catch (err) {
        console.error(err);
        alert('Failed to delete order. Please try again.');
      }
    }
  };`
    );
  }

  // AdminEnquiriesDashboard.tsx
  if (dbName === 'AdminEnquiriesDashboard.tsx') {
    content = content.replace(
      /const handleDelete = \(id: string\) => \{[\s\S]*?if \(window\.confirm\('Are you sure you want to delete this enquiry\?'\)\) \{[\s\S]*?enquiryStorage\.delete\(id\);[\s\S]*?loadEnquiries\(\);[\s\S]*?\}[\s\S]*?\};/m,
      `const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to permanently delete this enquiry?')) {
      try {
        await enquiryStorage.delete(id);
        alert('Enquiry deleted successfully.');
      } catch (err) {
        console.error(err);
        alert('Failed to delete enquiry. Please try again.');
      }
    }
  };`
    );
  }

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Updated ${dbName}`);
}
