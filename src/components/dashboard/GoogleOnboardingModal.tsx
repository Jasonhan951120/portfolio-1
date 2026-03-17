import React, { useEffect } from 'react';

interface GoogleOnboardingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const GoogleOnboardingModal: React.FC<GoogleOnboardingModalProps> = ({ isOpen, onClose }) => {
  // 1. 배경 스크롤 잠금 (Body Scroll Lock)
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    // 모달 언마운트 시 스크롤 복구
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // 2. 실제 Google OAuth 2.0 리다이렉트 로직
  const handleGoogleAuthRedirect = () => {
    const clientId = "401672125235-qu53kh0tnu8guolq1u6ksjsc7bl9uah6.apps.googleusercontent.com";
    const redirectUri = "https://www.hanlanoc.com/admin";
    const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=email%20profile`;
    
    window.location.href = oauthUrl;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto py-10">
      {/* 최상위 고정 컨테이너: 대통령 계급장 z-[100]으로 무조건 최상단 노출 */}
      {/* 까만색 반투명 배경 (Dark Overlay) */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* 하얀색 모달 박스 알맹이: 배경보다 한 칸 위인 z-[101] 부여 */}
      <div className="relative z-[101] max-w-lg w-full bg-white rounded-[32px] shadow-2xl border border-white/20 transform transition-all p-10 pb-8 flex flex-col gap-8 max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
        
        {/* 모달 헤더 및 텍스트 */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-blue-50 flex items-center justify-center mb-2">
            <svg className="w-8 h-8 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">
            Reputation Intelligence
          </h2>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
            Connect Google Business to unlock high-intent patient insights.
          </p>
        </div>

        {/* 액션 버튼 푸터 */}
        <div className="mt-4 flex flex-col sm:flex-row justify-end gap-3 border-t border-slate-100 pt-5">
          <button 
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleGoogleAuthRedirect}
            className="px-6 py-3 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-black hover:to-slate-900 text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-slate-200 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
          >
            Connect Safely with Google
          </button>
        </div>
      </div>
    </div>
  );
};
