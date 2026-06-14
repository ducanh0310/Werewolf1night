import React from 'react';
import { MessageSquare, ChevronRight, Sun } from 'lucide-react';
import Header from './Header';

interface DayDiscussionProps {
  onComplete: () => void;
}

export default function DayDiscussion({ onComplete }: DayDiscussionProps) {
  return (
    <div className="w-full max-w-xl mx-auto px-4 py-6" id="day-discussion-container">
      <Header subtitle="Giai đoạn Thảo luận ban ngày" />

      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl space-y-6">
        
        {/* Morning Discussion Banner */}
        <div className="bg-slate-950/80 border border-slate-850 rounded-2xl p-6 text-center space-y-4">
          <div className="flex items-center justify-center space-x-2 text-amber-400">
            <Sun className="w-6 h-6 animate-pulse" />
            <span className="text-xs uppercase font-mono tracking-widest font-black">Trời Đã Sáng!</span>
          </div>

          <div className="text-xl font-black text-slate-100 leading-snug">
            Mọi người bắt đầu thảo luận tìm ra Ma Sói
          </div>

          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            Thảo luận tự do và không giới hạn thời gian. Khi mọi người đã sẵn sàng bỏ phiếu bầu treo cổ, hãy nhấn nút phía dưới!
          </p>
        </div>

        {/* Discussion helper tips */}
        <div className="bg-slate-950/40 p-4 border border-slate-850 rounded-xl space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-800/60 pb-2">
            <MessageSquare className="w-4.5 h-4.5 text-indigo-400" />
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-200">Gợi ý thảo luận thôn làng:</h4>
          </div>

          <ul className="space-y-3 text-xs text-slate-400 list-inside leading-relaxed">
            <li className="flex items-start">
              <span className="text-indigo-400 mr-1.5 select-none font-bold">•</span>
              <span><strong>Hỏi Tiên Tri:</strong> Nếu có Tiên Tri thật sự, họ đã xem trúng quân bài dư nào? Liệu có Sói nằm ở xấp bài dư không?</span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-400 mr-1.5 select-none font-bold">•</span>
              <span><strong>Hỏi Kẻ Trộm:</strong> Bán cá trộm bài của ai? Nhận vai trò gì? Cho biết người bị trộm bây giờ đã chuyển thành <strong>Phe Dân</strong>.</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-400 mr-1.5 select-none font-bold">•</span>
              <span><strong>Nghi vấn Ma Sói:</strong> Có ai đột nhiên thay đổi thái độ, cáo buộc người khác hoặc lúng túng khi hỏi vai trò cũ?</span>
            </li>
            <li className="flex items-start">
              <span className="text-fuchsia-400 mr-1.5 select-none font-bold">•</span>
              <span><strong>Kẻ Chán Đời:</strong> Cẩn thận với người cố tình nhận mình là Sói hoặc chọc phá gàn dở dể dụ mọi người vote chết!</span>
            </li>
          </ul>
        </div>

        {/* Go to Voting */}
        <button
          onClick={onComplete}
          className="w-full py-4 px-6 rounded-xl font-bold uppercase tracking-wider text-sm transition-all shadow-lg hover:shadow-indigo-500/10 active:scale-[0.99] cursor-pointer bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white flex items-center justify-center space-x-1.5"
          id="go-to-voting-btn"
        >
          <span>Tiến hành Bầu Chọn (Bỏ Phiếu)</span>
          <ChevronRight className="w-4.5 h-4.5" />
        </button>

      </div>
    </div>
  );
}
