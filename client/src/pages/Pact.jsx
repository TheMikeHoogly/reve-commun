import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Scroll, CheckCircle, Users, Sparkles } from 'lucide-react';
import api from '../hooks/useApi';

export default function Pact() {
  const [pact, setPact] = useState(null);
  const [signatories, setSignatories] = useState([]);
  const [signing, setSigning] = useState(false);

  useEffect(() => {
    Promise.all([api.get('/pact'), api.get('/pact/signatories')])
      .then(([pRes, sRes]) => {
        setPact(pRes.data);
        setSignatories(sRes.data);
      })
      .catch(console.error);
  }, []);

  const sign = async () => {
    setSigning(true);
    try {
      await api.post('/pact/sign');
      const res = await api.get('/pact');
      setPact(res.data);
      toast.success('Pacte signé avec joie ! ✨');
    } catch {
      toast.error('Erreur lors de la signature');
    } finally {
      setSigning(false);
    }
  };

  if (!pact) return <div className="animate-pulse text-dream-400">Chargement du Pacte...</div>;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Scroll className="text-dream-500" size={24} />
        <div>
          <h1 className="section-title mb-0">Pacte de Résonance</h1>
          <p className="text-dream-500 text-sm">{pact.total_signatories} signataires engagés</p>
        </div>
      </div>

      {/* Texte du pacte */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-8 mb-6 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-dream-400 to-dream-600" />
        <Sparkles className="text-dream-300 absolute top-4 right-4" size={48} />

        <h2 className="font-display text-2xl text-dream-900 mb-6">Je m'engage à...</h2>

        <div className="space-y-3 text-dream-700 leading-relaxed">
          {pact.text.split('\n').filter(Boolean).map((line, i) => (
            <p key={i} className={line.startsWith('"') ? 'italic text-dream-500 font-display text-lg border-l-2 border-dream-300 pl-4' : ''}>
              {line}
            </p>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-dream-100">
          {pact.signed ? (
            <div className="flex items-center gap-3 text-green-600">
              <CheckCircle size={24} />
              <div>
                <p className="font-semibold">Vous avez signé ce pacte</p>
                <p className="text-sm text-green-500">
                  {new Date(pact.signed_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
          ) : (
            <button
              onClick={sign}
              disabled={signing}
              className="btn-primary flex items-center gap-2"
            >
              <Scroll size={18} />
              {signing ? 'Signature en cours...' : 'Signer le Pacte avec joie'}
            </button>
          )}
        </div>
      </motion.div>

      {/* Signataires récents */}
      {signatories.length > 0 && (
        <div className="card p-6">
          <h2 className="font-semibold text-dream-800 flex items-center gap-2 mb-4">
            <Users size={18} /> Signataires récents
          </h2>
          <div className="space-y-2">
            {signatories.slice(0, 10).map((s, i) => (
              <div key={s.id} className="flex items-center gap-3 py-2">
                <div className="w-8 h-8 rounded-full bg-dream-100 flex items-center justify-center text-dream-600 font-bold text-sm">
                  {s.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-dream-800">{s.name}</p>
                  {s.location && <p className="text-xs text-dream-400">{s.location}</p>}
                </div>
                <span className="ml-auto text-xs text-dream-300">
                  {new Date(s.signed_at).toLocaleDateString('fr-FR')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
