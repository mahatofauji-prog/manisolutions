import React, { useState } from 'react';
import { Download, Calendar, Loader2 } from 'lucide-react';
import * as XLSX from 'xlsx';

import { customSolutionOrderStorage } from '../../services/customSolutionOrderStorage';
import { enquiryStorage } from '../../services/enquiryStorage';
import { workStorage } from '../../services/workStorage';

interface AdminDataExportDashboardProps {
  onBackToSite: () => void;
}

export const AdminDataExportDashboard: React.FC<AdminDataExportDashboardProps> = ({
  onBackToSite
}) => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [exportingTarget, setExportingTarget] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const filterByDate = (item: any) => {
    if (!fromDate && !toDate) return true;
    
    const itemDate = new Date(item.createdAt);
    
    if (fromDate) {
      const from = new Date(fromDate);
      from.setHours(0, 0, 0, 0);
      if (itemDate < from) return false;
    }
    
    if (toDate) {
      const to = new Date(toDate);
      to.setHours(23, 59, 59, 999);
      if (itemDate > to) return false;
    }
    
    return true;
  };

  const generateExcel = (sheetsData: { name: string; data: any[] }[], filename: string) => {
    try {
      const wb = XLSX.utils.book_new();
      
      sheetsData.forEach(sheet => {
        const ws = XLSX.utils.json_to_sheet(sheet.data);
        XLSX.utils.book_append_sheet(wb, ws, sheet.name);
      });
      
      XLSX.writeFile(wb, filename);
    } catch (err) {
      console.error('Export error:', err);
      throw new Error('Failed to generate Excel file');
    }
  };

  const getCustomerOrdersData = () => {
    const orders = customSolutionOrderStorage.getAllRaw().filter(filterByDate);
    return orders.map(order => ({
      'Order ID': order.id,
      'Customer Name': order.fullName,
      'Business Name': order.businessName || 'N/A',
      'Mobile Number': order.mobileNumber,
      'WhatsApp Number': order.whatsappNumber,
      'Email': order.email,
      'Full Address': order.locationCity || 'N/A',
      'City': order.locationCity || 'N/A',
      'Business Category': order.businessCategory || 'N/A',
      'Selected Solution': order.requiredSolution || 'N/A',
      'Requirements': order.projectRequirements,
      'Budget': order.budget || 'N/A',
      'Timeline': order.expectedTimeline || 'N/A',
      'Reference URL': order.referenceUrl || 'N/A',
      'Additional Message': order.additionalNotes || 'N/A',
      'Order Date': new Date(order.createdAt).toLocaleDateString(),
      'Order Time': new Date(order.createdAt).toLocaleTimeString(),
      'Status': order.status,
      'Admin Notes': order.adminNotes || ''
    }));
  };

  const getEnquiriesData = () => {
    const enquiries = enquiryStorage.getAllRaw().filter(filterByDate);
    return enquiries.map(enq => ({
      'Enquiry ID': enq.id,
      'Name': enq.fullName || '',
      'Mobile Number': enq.phone,
      'Email': enq.email,
      'Service / Subject': enq.service || 'N/A',
      'Requirements': enq.projectRequirements || 'N/A',
      'Date': new Date(enq.createdAt).toLocaleDateString(),
      'Time': new Date(enq.createdAt).toLocaleTimeString(),
      'Status': enq.status,
      'Admin Notes': enq.internalNotes || ''
    }));
  };

  const getWorkWithUsData = () => {
    const apps = workStorage.getAll().filter(filterByDate);
    return apps.map(app => ({
      'Application Number': app.id,
      'Applicant Name': app.fullName,
      'Mobile Number': app.mobileNumber,
      'WhatsApp Number': app.whatsappNumber,
      'Email': app.email,
      'Full Address': app.fullAddress,
      'City': app.city,
      'State': app.state,
      'Pincode': app.pinCode,
      'Work Categories': app.workCategories?.join(', ') || 'N/A',
      'Skills': app.skills?.join(', ') || app.skillsText || 'N/A',
      'Previous Work': app.previousWorkDetails || 'N/A',
      'Tools & Tech': app.toolsAndTechnologies || 'N/A',
      'Application Date': new Date(app.createdAt).toLocaleDateString(),
      'Application Time': new Date(app.createdAt).toLocaleTimeString(),
      'Application Status': app.status,
      'Contributor ID': app.contributorId || 'N/A',
      'ID Card Issued': app.isIdCardEnabled ? 'Yes' : 'No',
      'Selection Date': app.selectionDate ? new Date(app.selectionDate).toLocaleDateString() : 'N/A',
      'Admin Notes': app.adminNotes || ''
    }));
  };

  const handleExportOrders = async () => {
    if (exportingTarget) return;
    setExportingTarget('orders');
    setErrorMsg('');
    try {
      // Small timeout to allow UI to update to "Exporting..." state
      await new Promise(resolve => setTimeout(resolve, 100));
      const data = getCustomerOrdersData();
      generateExcel([{ name: 'Customer Solution Orders', data }], 'MANI_Solution_Customer_Orders.xlsx');
    } catch (err) {
      setErrorMsg('Unable to export data. Please try again.');
    } finally {
      setExportingTarget(null);
    }
  };

  const handleExportEnquiries = async () => {
    if (exportingTarget) return;
    setExportingTarget('enquiries');
    setErrorMsg('');
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      const data = getEnquiriesData();
      generateExcel([{ name: 'Enquiries', data }], 'MANI_Solution_Enquiries.xlsx');
    } catch (err) {
      setErrorMsg('Unable to export data. Please try again.');
    } finally {
      setExportingTarget(null);
    }
  };

  const handleExportWorkWithUs = async () => {
    if (exportingTarget) return;
    setExportingTarget('work');
    setErrorMsg('');
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      const data = getWorkWithUsData();
      generateExcel([{ name: 'Work With Us', data }], 'MANI_Solution_Work_With_Us.xlsx');
    } catch (err) {
      setErrorMsg('Unable to export data. Please try again.');
    } finally {
      setExportingTarget(null);
    }
  };

  const handleExportAll = async () => {
    if (exportingTarget) return;
    setExportingTarget('all');
    setErrorMsg('');
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      const orders = getCustomerOrdersData();
      const enquiries = getEnquiriesData();
      const work = getWorkWithUsData();
      
      generateExcel([
        { name: 'Customer Solution Orders', data: orders },
        { name: 'Enquiries', data: enquiries },
        { name: 'Work With Us', data: work }
      ], 'MANI_Solution_All_Data.xlsx');
    } catch (err) {
      setErrorMsg('Unable to export data. Please try again.');
    } finally {
      setExportingTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#171A1F]">Data Export</h2>
          <p className="text-sm text-[#626873] mt-1">Download system records as Excel files (.xlsx)</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#E4E1DA] p-6 space-y-8">
        
        {/* Date Filter */}
        <div className="bg-[#F8F9FA] p-4 rounded-xl border border-[#E4E1DA] flex flex-col md:flex-row items-center gap-4">
          <div className="flex items-center gap-2 text-[#171A1F] font-bold">
            <Calendar className="w-5 h-5 text-[#2563EB]" />
            <span>Optional Date Filter:</span>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-[#626873] font-medium">From:</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="px-3 py-2 border border-[#E4E1DA] rounded-lg text-sm outline-none focus:border-[#171A1F]"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-[#626873] font-medium">To:</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="px-3 py-2 border border-[#E4E1DA] rounded-lg text-sm outline-none focus:border-[#171A1F]"
              />
            </div>
            
            {(fromDate || toDate) && (
              <button
                onClick={() => { setFromDate(''); setToDate(''); }}
                className="text-xs font-bold text-red-500 hover:underline"
              >
                Clear Filter
              </button>
            )}
          </div>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
            {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Customer Orders Export Card */}
          <div className="bg-white border border-[#E4E1DA] rounded-xl p-5 hover:shadow-md transition-shadow flex flex-col h-full">
            <h3 className="font-bold text-lg text-[#171A1F] mb-2">Customer Solution Orders</h3>
            <p className="text-sm text-[#626873] mb-6 flex-grow">
              Download all requested custom solution orders including client details, project requirements, and status.
            </p>
            <button
              onClick={handleExportOrders}
              disabled={exportingTarget !== null}
              className="w-full bg-[#171A1F] hover:bg-[#2D313A] text-white px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {exportingTarget === 'orders' ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Exporting...</>
              ) : (
                <><Download className="w-4 h-4" /> Export Customer Orders</>
              )}
            </button>
          </div>

          {/* Enquiries Export Card */}
          <div className="bg-white border border-[#E4E1DA] rounded-xl p-5 hover:shadow-md transition-shadow flex flex-col h-full">
            <h3 className="font-bold text-lg text-[#171A1F] mb-2">Enquiries</h3>
            <p className="text-sm text-[#626873] mb-6 flex-grow">
              Download all general enquiries, contact form submissions, and ready solution requests.
            </p>
            <button
              onClick={handleExportEnquiries}
              disabled={exportingTarget !== null}
              className="w-full bg-[#171A1F] hover:bg-[#2D313A] text-white px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {exportingTarget === 'enquiries' ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Exporting...</>
              ) : (
                <><Download className="w-4 h-4" /> Export Enquiries</>
              )}
            </button>
          </div>

          {/* Work With Us Export Card */}
          <div className="bg-white border border-[#E4E1DA] rounded-xl p-5 hover:shadow-md transition-shadow flex flex-col h-full">
            <h3 className="font-bold text-lg text-[#171A1F] mb-2">Work With Us</h3>
            <p className="text-sm text-[#626873] mb-6 flex-grow">
              Download all contributor applications including skills, experience, and selection status.
            </p>
            <button
              onClick={handleExportWorkWithUs}
              disabled={exportingTarget !== null}
              className="w-full bg-[#171A1F] hover:bg-[#2D313A] text-white px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {exportingTarget === 'work' ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Exporting...</>
              ) : (
                <><Download className="w-4 h-4" /> Export Work With Us</>
              )}
            </button>
          </div>

        </div>

        {/* Export All Data Banner */}
        <div className="bg-[#171A1F] rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 mt-4">
          <div>
            <h3 className="text-white font-bold text-lg">Export All System Data</h3>
            <p className="text-gray-400 text-sm mt-1">
              Download a single Excel workbook containing all Customer Orders, Enquiries, and Work With Us applications on separate sheets.
            </p>
          </div>
          <button
            onClick={handleExportAll}
            disabled={exportingTarget !== null}
            className="whitespace-nowrap bg-white text-[#171A1F] hover:bg-gray-100 px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {exportingTarget === 'all' ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Exporting...</>
            ) : (
              <><Download className="w-4 h-4" /> Export All Data</>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
