import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Info } from 'lucide-react';
import { ConsultationRequest } from '../../lib/supabase';

interface AICaseNotePopoverProps {
  lead: ConsultationRequest;
  isVisible: boolean;
}

export const AICaseNotePopover: React.FC<AICaseNotePopoverProps> = ({ lead, isVisible }) => {
  // Mock dynamic reasoning based on lead data
  const getReasoning = () => {
    const service = lead.service?.toLowerCase() || "";
    if (service.includes("ortho") || service.includes("brace")) {
      return `환자가 교정 관련 상담 페이지에서 4회 이상의 체류 기록을 보였고, 유사 연령대 평균 대비 고관여 행동 패턴을 보임.`;
    }
    if (service.includes("implant")) {
      return `과거 임플란트 시술 상담 이력이 있으며, 최근 자사 디지털 전후 사진 갤러리 탭을 3회 반복 조회함.`;
    }
    return `환자의 입력 데이터 및 행동 패턴을 분석한 결과, 해당 시술 분야에서 £${(lead.potential_value || 1000).toLocaleString()} 규모의 잠재 가치를 보유한 것으로 산출됨.`;
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="absolute z-[100] bottom-full mb-3 right-0 w-64 p-4 bg-white/95 backdrop-blur-md border-[0.5px] border-slate-200/60 rounded-2xl shadow-luxury pointer-events-none"
        >
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">
              AI Value Reasoning
            </span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-600 font-medium">
            {getReasoning()}
          </p>
          <div className="absolute top-full right-6 w-3 h-3 bg-white border-r border-b border-slate-200/60 rotate-45 -translate-y-[6px]" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
