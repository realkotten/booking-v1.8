import React from 'react';
import { Clock, CalendarClock, XCircle, QrCode } from 'lucide-react';
import { Appointment } from '../../types';
import { toPersianDigits, formatAppointmentDate } from '../../utils/dateUtils';
import { formatPrice } from '../../utils/formatUtils';

interface UpcomingAppointmentCardProps {
  appointment: Appointment;
  relativeTimingText?: string | null;
  onReschedule: (apt: Appointment) => void;
  onCancel: (apt: Appointment) => void;
  onOpenPass: (apt: Appointment) => void;
}

export const UpcomingAppointmentCard: React.FC<UpcomingAppointmentCardProps> = ({
  appointment,
  onReschedule,
  onCancel,
  onOpenPass,
}) => {
  return (
    <>
      {/* Appointment Main Info */}
      <div className="py-1 flex items-start justify-between gap-3">
        <div className="space-y-1">
          <span className="text-[10px] font-medium text-stone-500 block">
            سرویس رزرو شده شما:
          </span>
          <h2 className="text-base font-bold text-stone-900 leading-snug">
            {appointment.service?.name || 'اصلاح مو و پیرایش'}
          </h2>
          <div className="flex items-center gap-2 pt-0.5 w-[186.18px]">
            {(() => {
              const effectiveServicePrice = appointment.service?.price ?? appointment.servicePrice ?? 0;
              const effectiveRealPrice = (appointment.service?.realPrice && appointment.service.realPrice > 0)
                ? appointment.service.realPrice
                : (appointment.originalServicePrice || effectiveServicePrice);
              const extrasTotal = (appointment.additionalAccoutrements && appointment.additionalAccoutrements.length > 0)
                ? appointment.additionalAccoutrements.reduce((sum, a) => sum + (a.price || 0), 0)
                : (appointment.accoutrementsPrice || 0);

              const hasDiscount = Boolean(effectiveRealPrice > effectiveServicePrice && effectiveServicePrice > 0);
              const payableTotal = appointment.priceSummary?.total ?? (effectiveServicePrice + extrasTotal);
              const originalTotal = appointment.priceSummary?.originalTotal ?? (effectiveRealPrice + extrasTotal);

              return (
                <>
                  {hasDiscount && originalTotal > payableTotal && (
                    <span className="line-through text-stone-400 text-[10px] tabular-nums">
                      {formatPrice(originalTotal)}
                    </span>
                  )}
                  <span className="font-bold text-stone-900 text-xs tabular-nums w-[129.93px]">
                    {formatPrice(payableTotal)}
                  </span>
                  {hasDiscount && (
                    <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100 px-1.5 pt-[3px] text-center w-[62.5px] h-[20px] ml-0 -mt-[70px] inline-flex items-center justify-center rounded-full leading-none">
                      تخفیف ویژه
                    </span>
                  )}
                </>
              );
            })()}
          </div>
        </div>

        {/* Tactile Date & Time Card */}
        <div className="tactile-tile-3d rounded-2xl p-2.5 text-center shrink-0 min-w-[96px]">
          <div className="flex items-center justify-center gap-1 text-[10px] text-stone-600 font-medium mb-0.5">
            <Clock className="w-3 h-3 text-[#4e3b6e]" />
            <span>ساعت</span>
          </div>
          <span
            className="text-sm font-black text-stone-900 block"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            {toPersianDigits(appointment.startTime)}
          </span>
          <span className="text-[10px] text-[#4e3b6e] font-bold block mt-0.5">
            {formatAppointmentDate(appointment)}
          </span>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="pt-2.5 border-t border-stone-200/70 grid grid-cols-3 gap-2">
        <button
          id="home-reschedule-btn"
          type="button"
          onClick={() => onReschedule(appointment)}
          className="py-2 px-2 tactile-tile-3d text-stone-800 rounded-xl text-[11px] font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
          title="تغییر تاریخ یا ساعت نوبت"
        >
          <CalendarClock className="w-3.5 h-3.5 text-[#4e3b6e]" />
          <span>تغییر زمان</span>
        </button>

        <button
          id="home-cancel-btn"
          type="button"
          onClick={() => onCancel(appointment)}
          className="py-2 px-2 bg-gradient-to-b from-[#fadfe8] to-[#f6cfdc] border border-white/80 text-[#8a3350] rounded-xl text-[11px] font-medium flex items-center justify-center gap-1.5 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.9),0_4px_10px_-2px_rgba(244,63,94,0.15)] transition-all cursor-pointer active:scale-95"
          title="لغو این نوبت"
        >
          <XCircle className="w-3.5 h-3.5 text-[#a83256]" />
          <span>لغو نوبت</span>
        </button>

        <button
          id="home-pass-btn"
          type="button"
          onClick={() => onOpenPass(appointment)}
          className="py-2 px-2 bg-gradient-to-b from-[#e8e0f8] to-[#dbd0f4] border border-white/80 text-[#3e2c5d] rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.95),0_4px_10px_-2px_rgba(78,59,110,0.18)] transition-all cursor-pointer active:scale-95"
          title="مشاهده کارت ورود دیجیتال"
        >
          <QrCode className="w-3.5 h-3.5 text-[#4e3b6e]" />
          <span>کارت نوبت</span>
        </button>
      </div>
    </>
  );
};
