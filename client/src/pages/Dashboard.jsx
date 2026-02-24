import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Users, Lightbulb, Scroll, Map, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../hooks/useApi';

const DAILY_QUOTES = [
  'Et si le but du jeu était simplement de jouer avec joie ?',
  'La conscience est le terrain ; la joie est la boussole.',
  'Chaque rencontre est une invitation à s\'éveiller un peu plus.',
  'Nous ne trouvons pas notre chemin — nous le créons ensemble.',
  'La douceur est une forme de courage.',
];

const quote = DAILY_QUOTES[new Date().getDay() % DAILY_QUOTES.length];

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ matches: 0, circles: 0, projects: 0 });
  const [revelation, setRevelation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [matchRes, circleRes, projectRes, revelationRes] = await Promise.all([
          api.get('/matches?limit=3'),
          api.get('/circles'),
          api.get('/projects'),
          api.get('/matches/revelation'),
        ]);
        setStats({
          matches: matchRes.data.length,
          circles: circleRes.data.length,
          projects: projectRes.data.length,
        });
        setRevelation(revelationRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const cards = [
    { to: '/matches', icon: Heart, label: 'Résonances', count: stats.matches, color: 'bg-pink-50 text-pink-600', desc: 'Âmes proches' },
    { to: '/circles', icon: Users, label: 'Cercles', count: stats.circles, color: 'bg-dream-50 text-dream-600', desc: 'Actifs' },
    { to: '/projects', icon: Lightbulb, label: 'Projets', count: stats.projects, color: 'bg-amber-50 text-amber-600', desc: 'En germination' },
    { to: '/map', icon: Map, label: 'Constellation', count: null, color: 'bg-indigo-50 text-indigo-600', desc: 'Explorer' },
  ];

  return (
    <div className="max-w-4xl">
      {/* Salutation */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-3xl text-dream-900 mb-1">
          Bonjour, {user?.name?.split(' ')[0]} ✨
        </h1>
        <p className="text-dream-500 italic">"{quote}"</p>
      </motion.div>

      {/* Révélation */}
      {revelation && revelation.count > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-dream-500 to-dream-700 text-white rounded-2xl p-6 mb-8 shadow-lg"
        >
          <div className="flex items-start gap-4">
            <Sparkles size={28} className="flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold text-lg">Saviez-vous que...</p>
              <p className="text-dream-100 mt-1">{revelation.message}</p>
              <Link to="/matches" className="inline-flex items-center gap-1 mt-3 text-white font-medium hover:underline text-sm">
                Voir mes résonances <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </motion.div>
      )}

      {/* Cartes stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {cards.map(({ to, icon: Icon, label, count, color, desc }, i) => (
          <motion.div
            key={to}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
          >
            <Link to={to} className="card p-5 flex flex-col items-center text-center hover:scale-105 transition-transform block">
              <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-3`}>
                <Icon size={22} />
              </div>
              {count !== null && <p className="font-bold text-2xl text-dream-900">{loading ? '...' : count}</p>}
              <p className="font-medium text-dream-700 text-sm">{label}</p>
              <p className="text-dream-400 text-xs">{desc}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Actions rapides */}
      <div className="card p-6">
        <h2 className="font-semibold text-dream-800 mb-4">Prochaines étapes</h2>
        <div className="space-y-3">
          {!user?.value_ids?.length && (
            <Link to="/profile" className="flex items-center gap-3 p-3 rounded-xl bg-dream-50 hover:bg-dream-100 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-dream-200 flex items-center justify-center text-dream-600 font-bold">1</div>
              <div>
                <p className="font-medium text-dream-800 text-sm">Compléter votre profil de valeurs</p>
                <p className="text-dream-500 text-xs">Choisissez vos valeurs pour améliorer votre matching</p>
              </div>
              <ArrowRight size={16} className="ml-auto text-dream-400" />
            </Link>
          )}
          <Link to="/pact" className="flex items-center gap-3 p-3 rounded-xl bg-dream-50 hover:bg-dream-100 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-dream-200 flex items-center justify-center text-dream-600">
              <Scroll size={16} />
            </div>
            <div>
              <p className="font-medium text-dream-800 text-sm">Signer le Pacte de Résonance</p>
              <p className="text-dream-500 text-xs">Rejoignez les signataires engagés pour la joie</p>
            </div>
            <ArrowRight size={16} className="ml-auto text-dream-400" />
          </Link>
          <Link to="/circles" className="flex items-center gap-3 p-3 rounded-xl bg-dream-50 hover:bg-dream-100 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-dream-200 flex items-center justify-center text-dream-600">
              <Users size={16} />
            </div>
            <div>
              <p className="font-medium text-dream-800 text-sm">Trouver un cercle local</p>
              <p className="text-dream-500 text-xs">Rejoignez ou créez un groupe dans votre région</p>
            </div>
            <ArrowRight size={16} className="ml-auto text-dream-400" />
          </Link>
        </div>
      </div>
    </div>
  );
}
