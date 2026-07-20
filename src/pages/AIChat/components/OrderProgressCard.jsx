import { CheckCircle2, Circle } from 'lucide-react';

const LABELS = { phone: 'Phone', address: 'Address', city: 'City' };

export default function OrderProgressCard({ progress }) {
  if (!progress) return null;

  const { collected = {}, missing = [], current } = progress;
  const allFields = ['phone', 'address', 'city'];

  return (
    <div className="ai-order-progress">
      <p className="ai-order-progress__title">Order details</p>
      <div className="ai-order-progress__steps">
        {allFields.map((field) => {
          const done = !missing.includes(field) && collected[field];
          const active = current === field;
          return (
            <div key={field} className={`ai-order-progress__step ${done ? 'done' : ''} ${active ? 'active' : ''}`}>
              {done ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              ) : (
                <Circle className={`w-4 h-4 ${active ? 'text-pink-500' : 'text-slate-300'}`} />
              )}
              <span>{LABELS[field]}</span>
              {done && <span className="ai-order-progress__val">{collected[field]}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
