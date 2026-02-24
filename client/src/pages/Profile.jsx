import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Save, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../hooks/useApi';

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const [values, setValues] = useState([]);
  const [selectedValues, setSelectedValues] = useState([]);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  useEffect(() => {
    const load = async () => {
      try {
        const [valRes] = await Promise.all([api.get('/values')]);
        setValues(valRes.data);
        setSelectedValues(user?.value_ids || []);
        reset({ name: user?.name, location: user?.location, bio: user?.bio });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const toggleValue = (id) => {
    setSelectedValues(prev =>
      prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]
    );
  };

  const onSubmit = async (data) => {
    try {
      await api.put('/users/me', { ...data, value_ids: selectedValues });
      await refreshUser();
      toast.success('Profil mis à jour !');
    } catch (err) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const categories = [...new Set(values.map(v => v.category))];

  if (loading) return <div className="animate-pulse text-dream-400">Chargement...</div>;

  return (
    <div className="max-w-2xl">
      <h1 className="section-title mb-6">Mon profil</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold text-dream-800 flex items-center gap-2">
            <User size={18} /> Informations
          </h2>

          <div>
            <label className="block text-sm font-medium text-dream-700 mb-2">Nom</label>
            <input {...register('name')} className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium text-dream-700 mb-2">Ville</label>
            <input {...register('location')} className="input" placeholder="Lyon, Paris..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-dream-700 mb-2">Présentation</label>
            <textarea
              {...register('bio')}
              className="input resize-none"
              rows={3}
              placeholder="En quelques mots, qui êtes-vous et ce qui vous anime..."
            />
          </div>
        </div>

        {/* Valeurs */}
        <div className="card p-6">
          <h2 className="font-semibold text-dream-800 mb-1">Mes valeurs profondes</h2>
          <p className="text-dream-500 text-sm mb-4">
            Sélectionnez 5 à 10 valeurs qui vous définissent le mieux ({selectedValues.length} sélectionnées)
          </p>

          {categories.map(cat => (
            <div key={cat} className="mb-4">
              <h3 className="text-xs font-semibold text-dream-400 uppercase tracking-wider mb-2 capitalize">
                {cat?.replace('_', ' ')}
              </h3>
              <div className="flex flex-wrap gap-2">
                {values.filter(v => v.category === cat).map(value => (
                  <motion.button
                    key={value.id}
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleValue(value.id)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                      selectedValues.includes(value.id)
                        ? 'bg-dream-600 text-white shadow-md'
                        : 'bg-dream-50 text-dream-600 hover:bg-dream-100'
                    }`}
                  >
                    <span>{value.emoji}</span>
                    {value.name}
                  </motion.button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button type="submit" disabled={isSubmitting} className="btn-primary flex items-center gap-2">
          <Save size={18} />
          {isSubmitting ? 'Sauvegarde...' : 'Sauvegarder le profil'}
        </button>
      </form>
    </div>
  );
}
