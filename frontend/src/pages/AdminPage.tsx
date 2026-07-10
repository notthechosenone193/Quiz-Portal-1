import { useNavigate } from 'react-router-dom';
import { BookOpen, Dices } from 'lucide-react';
import { PageWrapper } from '../components/layout/PageWrapper';

const cards = [
  {
    id: 'quiz',
    icon: BookOpen,
    eyebrow: 'AI Powered',
    title: 'Create Quiz',
    desc: 'Use AI to generate a quiz on any topic. Set a timer, define question count, and share a live link for real-time competitive play.',
    route: '/admin/create-quiz',
    cta: 'Generate Quiz',
    accent: '#4B286D',
    bg: '#F2EFF4',
  },
  {
    id: 'tambola',
    icon: Dices,
    eyebrow: 'Classic Game',
    title: 'Tambola',
    desc: 'Host a digital Tambola game with auto-generated tickets, live number draws, and instant win verification for all claim types.',
    route: '/admin/tambola',
    cta: 'Create Tambola',
    accent: '#2B8000',
    bg: '#F4F9F2',
  },
];

export default function AdminPage() {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#4B286D' }}>Main Menu</h1>
          <p className="text-sm mt-1" style={{ color: '#71757B' }}>Select a game type to get started</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className="bg-white rounded-xl border border-[#D8D8D8] flex flex-col hover:shadow-lg transition-all"
                style={{ padding: '20px', margin: '20px' }}
              >
                {/* Icon */}
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: card.bg, marginBottom: '16px' }}>
                  <Icon size={20} style={{ color: card.accent }} />
                </div>

                {/* Text */}
                <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: card.accent, marginBottom: '16px' }}>{card.eyebrow}</p>
                <h2 className="text-base font-bold" style={{ color: '#2A2C2E', marginBottom: '12px' }}>{card.title}</h2>
                <p className="text-xs leading-relaxed" style={{ color: '#71757B', marginBottom: '20px' }}>{card.desc}</p>

                {/* CTA — left aligned, below description */}
                <button
                  onClick={() => navigate(card.route)}
                  className="self-start text-sm font-semibold px-5 py-2 rounded-full transition-all hover:opacity-90 active:scale-95"
                  style={{
                    backgroundColor: card.accent,
                    color: '#FFFFFF',
                  }}
                >
                  {card.cta}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </PageWrapper>
  );
}
