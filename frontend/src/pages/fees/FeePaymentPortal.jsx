import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { feeService } from '../../services';
import {
  CreditCard,
  QrCode,
  Landmark,
  Receipt,
  CheckCircle2,
  AlertCircle,
  Clock,
  Printer,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  TrendingUp,
  DollarSign,
  Download,
  Calendar,
  Layers,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';

export default function FeePaymentPortal() {
  const { user } = useSelector((state) => state.auth);
  const isPrincipalOrCoord = user?.roles?.some((r) => r === 'PRINCIPAL' || r === 'COORDINATOR');

  const [invoices, setInvoices] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // Pay Modal State
  const [activeInvoice, setActiveInvoice] = useState(null);
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [payMethod, setPayMethod] = useState('UPI'); // 'UPI' | 'CARD' | 'NET_BANKING'
  const [payAmount, setPayAmount] = useState('');
  const [processing, setProcessing] = useState(false);

  // Card details state
  const [cardNumber, setCardNumber] = useState('4532 8901 2345 6789');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('888');
  const [cardHolder, setCardHolder] = useState(user?.fullName || 'Arun Sharma');
  const [upiId, setUpiId] = useState('student@okaxis');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // Receipt Modal State
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState(null);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      if (isPrincipalOrCoord) {
        const sumData = await feeService.getFeeSummary();
        setSummary(sumData);
        setInvoices(sumData?.recentInvoices || []);
      } else {
        const studentId = user?.profileId || 1;
        const invList = await feeService.getStudentInvoices(studentId);
        setInvoices(invList || []);
      }
    } catch (err) {
      console.error('Failed to load fee data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPayModal = (invoice) => {
    setActiveInvoice(invoice);
    setPayAmount(invoice.balanceAmount);
    setPayModalOpen(true);
  };

  const handleProcessPayment = async (e) => {
    e.preventDefault();
    if (!activeInvoice) return;

    try {
      setProcessing(true);
      const req = {
        invoiceId: activeInvoice.id,
        amount: Number(payAmount),
        paymentMethod: payMethod,
        transactionReference: `TXN-${payMethod}-${Date.now()}`,
        remarks: `Simulated ${payMethod} payment for ${activeInvoice.title}`
      };

      const receipt = await feeService.processPayment(req);

      // Trigger Confetti!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (cErr) {
        // Safe fallback
      }

      setPayModalOpen(false);
      setActiveReceipt(receipt);
      setReceiptModalOpen(true);
      await loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Payment failed to process');
    } finally {
      setProcessing(false);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  // KPIs
  const totalBilled = invoices.reduce((acc, i) => acc + Number(i.totalAmount || 0), 0);
  const totalPaid = invoices.reduce((acc, i) => acc + Number(i.paidAmount || 0), 0);
  const totalBalance = invoices.reduce((acc, i) => acc + Number(i.balanceAmount || 0), 0);

  const displayedInvoices = selectedStatus === 'ALL'
    ? invoices
    : invoices.filter((i) => i.status === selectedStatus);

  return (
    <div className="space-y-6 pb-12 print:p-0 animate-fade-in">
      {/* Header Banner */}
      <div className="liquid-glass p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Direct Fee Settlement Gateway
            </span>
            <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Auto-Generated Tax Invoices
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Receipt className="w-7 h-7 text-indigo-600" />
            Fee Management & Online Payment Portal
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Secure multi-channel institutional tuition, laboratory, sports & examination fee gateway.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-4 py-2 bg-emerald-50/90 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            256-Bit Encrypted Simulated Gateway
          </span>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:hidden">
        <StatCard
          title="Total Invoiced"
          value={`₹${(summary?.totalBilled || totalBilled).toLocaleString()}`}
          subtitle="All Academic Categories"
          icon={Layers}
          color="indigo"
        />
        <StatCard
          title="Total Paid"
          value={`₹${(summary?.totalCollected || totalPaid).toLocaleString()}`}
          subtitle="Receipts Cleared"
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Pending Dues"
          value={`₹${(summary?.totalPending || totalBalance).toLocaleString()}`}
          subtitle="Outstanding Balance"
          icon={AlertCircle}
          color="amber"
        />
        <StatCard
          title="Collection Rate"
          value={`${summary?.collectionRatePercentage || (totalBilled > 0 ? Math.round((totalPaid / totalBilled) * 100) : 100)}%`}
          subtitle="Settlement Ratio"
          icon={TrendingUp}
          color="purple"
        />
      </div>

      {/* Invoice Management Matrix */}
      <div className="liquid-glass rounded-3xl shadow-lg border border-white/90 overflow-hidden print:hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-indigo-600" />
            <span className="font-bold text-sm text-slate-800">Student Fee Invoices & Receipts</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-slate-100/90 rounded-2xl border border-slate-200">
            {['ALL', 'PENDING', 'PARTIAL', 'PAID', 'OVERDUE'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedStatus === st
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm font-black'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400 font-semibold">
            Fetching fee records...
          </div>
        ) : displayedInvoices.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400 font-semibold">
            No fee invoices found for the selected filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 text-slate-500 font-bold border-b border-slate-200/80 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-5">Invoice #</th>
                  <th className="py-3.5 px-5">Fee Category & Title</th>
                  <th className="py-3.5 px-5">Student</th>
                  <th className="py-3.5 px-5">Due Date</th>
                  <th className="py-3.5 px-5">Total (₹)</th>
                  <th className="py-3.5 px-5">Paid (₹)</th>
                  <th className="py-3.5 px-5">Balance (₹)</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {displayedInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-5 font-mono font-bold text-slate-900">{inv.invoiceNumber}</td>
                    <td className="py-3.5 px-5 font-bold text-slate-800">
                      <div>{inv.title}</div>
                      <span className="text-[11px] text-slate-400 font-normal">{inv.feeCategoryName}</span>
                    </td>
                    <td className="py-3.5 px-5 text-slate-600">
                      <div className="font-bold text-slate-800">{inv.studentName}</div>
                      <span className="text-[11px] text-slate-400">Roll: #{inv.rollNumber} • {inv.className}</span>
                    </td>
                    <td className="py-3.5 px-5 text-slate-600 font-mono font-medium">{inv.dueDate}</td>
                    <td className="py-3.5 px-5 font-black text-slate-900">₹{Number(inv.totalAmount).toLocaleString()}</td>
                    <td className="py-3.5 px-5 font-bold text-emerald-600">₹{Number(inv.paidAmount).toLocaleString()}</td>
                    <td className="py-3.5 px-5 font-black text-slate-900">
                      {Number(inv.balanceAmount) > 0 ? (
                        <span className="text-rose-600">₹{Number(inv.balanceAmount).toLocaleString()}</span>
                      ) : (
                        <span className="text-slate-400">₹0</span>
                      )}
                    </td>
                    <td className="py-3.5 px-5">
                      <Badge
                        variant={
                          inv.status === 'PAID' ? 'success' :
                          inv.status === 'PARTIAL' ? 'info' :
                          inv.status === 'OVERDUE' ? 'danger' : 'warning'
                        }
                      >
                        {inv.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {inv.status !== 'PAID' && (
                          <button
                            onClick={() => handleOpenPayModal(inv)}
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1 cursor-pointer"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>Pay Online</span>
                          </button>
                        )}
                        {inv.payments?.length > 0 && (
                          <button
                            onClick={() => {
                              setActiveReceipt(inv.payments[0]);
                              setReceiptModalOpen(true);
                            }}
                            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer border border-slate-200"
                          >
                            <Receipt className="w-3.5 h-3.5" />
                            <span>Receipt</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL 1: PAY ONLINE MODAL */}
      <Modal
        isOpen={payModalOpen}
        onClose={() => setPayModalOpen(false)}
        title="Simulated SchoolTrack Payment Gateway"
      >
        {activeInvoice && (
          <form onSubmit={handleProcessPayment} className="space-y-4">
            <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200 text-xs">
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-500 font-semibold">Invoice:</span>
                <span className="font-mono font-bold text-slate-800">{activeInvoice.invoiceNumber}</span>
              </div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-500 font-semibold">Fee Item:</span>
                <span className="font-bold text-slate-800">{activeInvoice.title}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-semibold">Remaining Balance:</span>
                <span className="font-black text-rose-600">₹{Number(activeInvoice.balanceAmount).toLocaleString()}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Payment Amount (₹)</label>
              <input
                type="number"
                required
                min={1}
                max={activeInvoice.balanceAmount}
                value={payAmount}
                onChange={(e) => setPayAmount(e.target.value)}
                className="liquid-glass-input w-full px-3 py-2 text-sm font-bold text-slate-900"
              />
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Select Payment Mode</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPayMethod('UPI')}
                  className={`p-2.5 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    payMethod === 'UPI'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-200 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <QrCode className="w-5 h-5 text-emerald-600" />
                  <span>UPI / QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPayMethod('CARD')}
                  className={`p-2.5 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    payMethod === 'CARD'
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-800 ring-2 ring-indigo-200 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-indigo-600" />
                  <span>Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPayMethod('NET_BANKING')}
                  className={`p-2.5 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    payMethod === 'NET_BANKING'
                      ? 'bg-purple-50 border-purple-500 text-purple-800 ring-2 ring-purple-200 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <Landmark className="w-5 h-5 text-purple-600" />
                  <span>Net Banking</span>
                </button>
              </div>
            </div>

            {/* Form Fields for Selected Method */}
            {payMethod === 'UPI' && (
              <div className="p-3 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-900">Scan QR Code or Enter VPA</span>
                  <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full font-bold">Instant</span>
                </div>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="name@okaxis"
                  className="liquid-glass-input w-full px-3 py-2 text-xs font-semibold"
                />
              </div>
            )}

            {payMethod === 'CARD' && (
              <div className="space-y-2 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="liquid-glass-input w-full px-3 py-2 font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Expiry</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="liquid-glass-input w-full px-3 py-2 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-0.5">CVV</label>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="liquid-glass-input w-full px-3 py-2 font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {payMethod === 'NET_BANKING' && (
              <div className="text-xs">
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Select Bank</label>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="liquid-glass-input w-full px-3 py-2 font-semibold"
                >
                  <option value="HDFC Bank">HDFC Bank</option>
                  <option value="State Bank of India">State Bank of India</option>
                  <option value="ICICI Bank">ICICI Bank</option>
                  <option value="Axis Bank">Axis Bank</option>
                  <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={processing}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-3"
            >
              {processing ? (
                <span>Simulating Bank Authorization...</span>
              ) : (
                <>
                  <span>Pay ₹{Number(payAmount || 0).toLocaleString()} Now</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </Modal>

      {/* MODAL 2: OFFICIAL DIGITAL RECEIPT VIEWER */}
      <Modal
        isOpen={receiptModalOpen}
        onClose={() => setReceiptModalOpen(false)}
        title="Official Digital Fee Receipt"
      >
        {activeReceipt && (
          <div className="space-y-4">
            {/* Printable Tax Receipt Body */}
            <div className="p-6 border-2 border-dashed border-slate-300 rounded-2xl bg-white space-y-4 text-xs font-sans shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <h3 className="font-black text-slate-900 text-base">SchoolTrack Institution</h3>
                  <p className="text-[11px] text-slate-500">Autonomous Senior Secondary Academic Board</p>
                </div>
                <div className="text-right">
                  <Badge variant="success">PAYMENT CLEARED</Badge>
                  <p className="font-mono text-[10px] text-slate-400 mt-0.5">Ref: {activeReceipt.receiptNumber}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-400 block">Student Name:</span>
                  <strong className="text-slate-800">{activeReceipt.studentName}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Roll / Admission:</span>
                  <strong className="text-slate-800">{activeReceipt.rollNumber} • {activeReceipt.admissionNumber}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Class:</span>
                  <strong className="text-slate-800">{activeReceipt.className}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Payment Mode:</span>
                  <strong className="text-slate-800">{activeReceipt.paymentMethod}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Transaction Reference:</span>
                  <strong className="font-mono text-slate-800">{activeReceipt.transactionReference}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Date & Time:</span>
                  <strong className="text-slate-800">{new Date(activeReceipt.paymentDate).toLocaleString()}</strong>
                </div>
              </div>

              <div className="border-t border-b border-slate-200 py-3 my-2 flex justify-between items-center">
                <span className="font-bold text-slate-700 text-sm">Amount Paid:</span>
                <span className="font-black text-lg text-emerald-600">₹{Number(activeReceipt.amount).toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center text-[11px] text-slate-400">
                <span>Remaining Dues: ₹{Number(activeReceipt.remainingBalance || 0).toLocaleString()}</span>
                <span>Digitally Signed System Stamp</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handlePrintReceipt}
                className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Tax Receipt</span>
              </button>
              <button
                onClick={() => setReceiptModalOpen(false)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
