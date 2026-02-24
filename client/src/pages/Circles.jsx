import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Users, Plus, MapPin, X } from 'lucide-react';
import api from '../hooks/useApi';

export default function Circles() {
  const [circles, setCircles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  const load = async () => {
    try {
      const res = await api.get('/circles');
      setCircles(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onSubmit = async (data) => {
    try {
      await api.post('/circles', data);
      toast.success('Cercle créé !');
      reset();
      setShowForm(false);
      load();
    } catch {
      toast.error('Erreur lors de la création');
    }
  };

  const join = async (id) => {
    try {
      await api.post(`/circles/${id}/join`);
      toast.success('Vous avez rejoint le cercle !');
    } catch {
      toast.error('Erreur');
    }
  };

  if (loading) return <div className="animate-pulse text-dream-400">Chargement...</div>;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="text-dream-500" size={24} />
          <div>
            <h1 className="section-title mb-0">Cercles de co-création</h1>
            <p className="text-dream-500 text-sm">Espaces locaux de rencontre et d'action</p>
          </div>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2 py-2 px-4 text-sm">
          <Plus size={16} /> Créer
        </button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-dream-800">Nouveau cercle</h2>
            <button onClick={() => setShowForm(false)}><X size={18} className="text-dream-400" /></button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dream-700 mb-1">Nom du cercle</label>
              <input {...register('name', { required: true })} className="input" placeholder="Cercle de Lyon..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-dream-700 mb-1">Description</label>
              <textarea {...register('description')} className="input resize-none" rows={2} placeholder="Notre intention..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-dream-700 mb-1">Lieu</label>
              <input {...register('location')} className="input" placeholder="Lyon, Bordeaux..." />
            </div>
            <button type="submit" disabled={isSubmitting} className="btn-primary text-sm">
              {isSubmitting ? 'Création...' : 'Créer le cercle'}
            </button>
          </form>
        </motion.div>
      )}

      <div className="space-y-4">
        {circles.length === 0 ? (
          <div className="card p-12 text-center">
            <Users className="text-dream-200 mx-auto mb-4" size={48} />
            <p className="text-dream-500">Aucun cercle encore. Soyez le premier à en créer un !</p>
          </div>
        ) : circles.map((circle, i) => (
          <motion.div
            key={circle.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="card p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-dream-900">{circle.name}</h3>
                {circle.location && (
                  <p className="text-dream-400 text-xs flex items-center gap-1 mt-0.5">
                    <MapPin size={10} /> {circle.location}
                  </p>
                )}
                {circle.description && (
                  <p className="text-dream-600 text-sm mt-2 line-clamp-2">{circle.description}</p>
                )}
                <p className="text-dream-400 text-xs mt-2">
                  {circle.member_count} membre{circle.member_count > 1 ? 's' : ''} · créé par {circle.creator_name}
                </p>
              </div>
              <button onClick={() => join(circle.id)} className="btn-secondary text-sm py-1.5 px-3 flex-shrink-0">
                Rejoindre
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
