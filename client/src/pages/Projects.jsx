import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Lightbulb, Plus, Heart, MapPin, X } from 'lucide-react';
import api from '../hooks/useApi';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  const load = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onSubmit = async (data) => {
    try {
      await api.post('/projects', data);
      toast.success('Projet semé dans la pépinière !');
      reset();
      setShowForm(false);
      load();
    } catch {
      toast.error('Erreur lors de la création');
    }
  };

  const toggleLike = async (id) => {
    try {
      const res = await api.post(`/projects/${id}/like`);
      setProjects(prev => prev.map(p => p.id === id
        ? { ...p, likes_count: p.user_liked ? p.likes_count - 1 : p.likes_count + 1, user_liked: res.data.liked }
        : p
      ));
    } catch {
      toast.error('Erreur');
    }
  };

  if (loading) return <div className="animate-pulse text-dream-400">Chargement...</div>;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Lightbulb className="text-amber-500" size={24} />
          <div>
            <h1 className="section-title mb-0">Pépinière de projets</h1>
            <p className="text-dream-500 text-sm">Des graines pour un monde meilleur</p>
          </div>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2 py-2 px-4 text-sm">
          <Plus size={16} /> Semer
        </button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-dream-800">Nouveau projet</h2>
            <button onClick={() => setShowForm(false)}><X size={18} className="text-dream-400" /></button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dream-700 mb-1">Titre du projet</label>
              <input {...register('title', { required: true })} className="input" placeholder="Mon projet transformateur..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-dream-700 mb-1">Description</label>
              <textarea {...register('description', { required: true })} className="input resize-none" rows={3} placeholder="Vision, intention, impact..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-dream-700 mb-1">Compétences recherchées</label>
              <input {...register('needed_skills')} className="input" placeholder="Développeur, designer, communicant..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-dream-700 mb-1">Lieu</label>
              <input {...register('location')} className="input" placeholder="En ligne, Paris..." />
            </div>
            <button type="submit" disabled={isSubmitting} className="btn-primary text-sm">
              {isSubmitting ? 'Semer...' : 'Semer le projet'}
            </button>
          </form>
        </motion.div>
      )}

      <div className="space-y-4">
        {projects.length === 0 ? (
          <div className="card p-12 text-center">
            <Lightbulb className="text-amber-200 mx-auto mb-4" size={48} />
            <p className="text-dream-500">La pépinière attend ses premières graines. Osez proposer !</p>
          </div>
        ) : projects.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="card p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-dream-900">{project.title}</h3>
                <p className="text-dream-400 text-xs mt-0.5">par {project.creator_name}</p>
                {project.location && (
                  <p className="text-dream-400 text-xs flex items-center gap-1 mt-0.5">
                    <MapPin size={10} /> {project.location}
                  </p>
                )}
                <p className="text-dream-600 text-sm mt-2 line-clamp-3">{project.description}</p>
                {project.needed_skills && (
                  <p className="text-dream-400 text-xs mt-2">
                    <span className="font-medium text-dream-600">Recherche :</span> {project.needed_skills}
                  </p>
                )}
              </div>

              <button
                onClick={() => toggleLike(project.id)}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
                  project.user_liked ? 'bg-pink-50 text-pink-600' : 'bg-dream-50 text-dream-400 hover:text-pink-500'
                }`}
              >
                <Heart size={18} fill={project.user_liked ? 'currentColor' : 'none'} />
                <span className="text-xs font-medium">{project.likes_count}</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
