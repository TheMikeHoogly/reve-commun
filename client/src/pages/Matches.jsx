import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MapPin, Sparkles } from 'lucide-react';
import api from '../hooks/useApi';

export default function Matches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/matches?limit=20')
      .then(res => setMatches(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="animate-pulse text-dream-400">Calcul des résonances...</div>;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Heart className="text-pink-500" size={24} />
        <div>
          <h1 className="section-title mb-0">Résonances</h1>
          <p className="text-dream-500 text-sm">Âmes avec qui vous vibrez en harmonie</p>
        </div>
      </div>

      {matches.length === 0 ? (
        <div className="card p-12 text-center">
          <Sparkles className="text-dream-300 mx-auto mb-4" size={48} />
          <p className="text-dream-500 font-display text-lg">Votre constellation s'éveille...</p>
          <p className="text-dream-400 text-sm mt-2">
            Complétez votre profil de valeurs pour voir vos résonances apparaître.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {matches.map((match, i) => (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="card p-5 flex items-start gap-4"
            >
              {/* Avatar */}
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-dream-300 to-dream-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                {match.name?.[0]?.toUpperCase()}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-dream-900">{match.name}</h3>
                  <div className="flex items-center gap-1 bg-pink-50 text-pink-600 px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0">
                    <Heart size={10} fill="currentColor" />
                    {match.shared_values_count} valeurs
                  </div>
                </div>

                {match.location && (
                  <p className="text-dream-400 text-xs flex items-center gap-1 mt-0.5">
                    <MapPin size={10} /> {match.location}
                  </p>
                )}

                {match.bio && (
                  <p className="text-dream-600 text-sm mt-2 line-clamp-2">{match.bio}</p>
                )}

                {match.shared_values?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {match.shared_values.slice(0, 4).map(v => (
                      <span key={v} className="badge-dream text-xs">{v}</span>
                    ))}
                    {match.shared_values.length > 4 && (
                      <span className="badge bg-dream-50 text-dream-400 text-xs">
                        +{match.shared_values.length - 4}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
