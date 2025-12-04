import React, { useState } from 'react';
import { Customer, FollowUpStatus } from '../types';
import { X, Sparkles, Loader2, Save } from 'lucide-react';
import { generateFollowUpScript } from '../services/geminiService';

interface Props {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, status: FollowUpStatus, notes: string) => Promise<void>;
}

export const FollowUpModal: React.FC<Props> = ({ customer, isOpen, onClose, onSave }) => {
  const [status, setStatus] = useState<FollowUpStatus>(FollowUpStatus.Pending);
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiScript, setAiScript] = useState('');

  // Reset state when modal opens
  React.useEffect(() => {
    if (customer) {
      setStatus(customer.status);
      setNotes(customer.notes || '');
      setAiScript('');
    }
  }, [customer]);

  if (!isOpen || !customer) return null;

  const handleSave = async () => {
    setIsSaving(true);
    await onSave(customer.id, status, notes);
    setIsSaving(false);
    onClose();
  };

  const handleGenerateScript = async () => {
    setIsGeneratingAI(true);
    const script = await generateFollowUpScript(customer);
    setAiScript(script);
    setIsGeneratingAI(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-fade-in">
        <div className="bg-teal-600 p-4 flex justify-between items-center text-white">
          <h2 className="text-lg font-bold">อัพเดทการติดตาม: {customer.name}</h2>
          <button onClick={onClose} className="hover:bg-teal-700 p-1 rounded-full">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            <div>
              <span className="font-semibold block text-gray-800">เบอร์โทรศัพท์:</span>
              <a href={`tel:${customer.phone}`} className="text-teal-600 hover:underline">{customer.phone}</a>
            </div>
            <div>
              <span className="font-semibold block text-gray-800">ทรีตเม้นท์ล่าสุด:</span>
              {customer.lastTreatment}
            </div>
             <div>
              <span className="font-semibold block text-gray-800">วันที่รับบริการ:</span>
              {customer.serviceDate}
            </div>
          </div>

          {/* AI Helper Section */}
          <div className="border border-indigo-100 bg-indigo-50 rounded-lg p-3">
             <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-indigo-800 flex items-center gap-1">
                   <Sparkles size={14} /> AI ผู้ช่วยร่างบทพูด
                </span>
                <button 
                  onClick={handleGenerateScript}
                  disabled={isGeneratingAI}
                  className="text-xs bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-1 transition-colors"
                >
                  {isGeneratingAI ? <Loader2 className="animate-spin" size={12} /> : 'สร้างสคริปต์'}
                </button>
             </div>
             {aiScript && (
               <div className="bg-white p-2 rounded text-sm text-gray-700 border border-indigo-100 italic">
                 "{aiScript}"
               </div>
             )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">สถานะ</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(FollowUpStatus).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`py-2 px-3 rounded-md text-sm border transition-all ${
                    status === s
                      ? 'bg-teal-50 border-teal-500 text-teal-700 ring-1 ring-teal-500 font-medium'
                      : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">บันทึกเพิ่มเติม</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-teal-500 focus:border-teal-500 min-h-[100px]"
              placeholder="ใส่รายละเอียดการคุย..."
            />
          </div>
        </div>

        <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md text-sm font-medium"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-50 text-sm font-bold shadow-sm"
          >
            {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
            บันทึก
          </button>
        </div>
      </div>
    </div>
  );
};