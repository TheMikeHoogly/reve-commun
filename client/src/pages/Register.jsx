import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Sparkles, UserPlus } from 'lucide-react';

export default function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async ({ name, email, password, location }) => {
    try {
      await registerUser(name, email, password, location);
      toast.success('Bienvenue dans le Rêve Commun !');
      navigate('/profile');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Une erreur est survenue');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-dream-500 mb-6">
            <Sparkles size={20} />
            <span className="font-display text-xl gradient-text">Le Rêve Commun</span>
          </Link>
          <h1 className="font-display text-3xl text-dream-900">Rejoindre la constellation</h1>
          <p className="text-dream-500 mt-2">Votre voyage commence ici</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-dream-700 mb-2">Votre nom</label>
              <input
                {...register('name', { required: 'Nom requis', minLength: { value: 2, message: 'Au moins 2 caractères' } })}
                className="input"
                placeholder="Prénom Nom"
              />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-dream-700 mb-2">Email</label>
              <input
                {...register('email', { required: 'Email requis', pattern: { value: /\S+@\S+\.\S+/, message: 'Email invalide' } })}
                type="email"
                className="input"
                placeholder="votre@email.com"
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-dream-700 mb-2">Ville (optionnel)</label>
              <input
                {...register('location')}
                className="input"
                placeholder="Lyon, Paris, Bordeaux..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dream-700 mb-2">Mot de passe</label>
              <input
                {...register('password', { required: 'Mot de passe requis', minLength: { value: 8, message: 'Au moins 8 caractères' } })}
                type="password"
                className="input"
                placeholder="••••••••"
              />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-dream-700 mb-2">Confirmer le mot de passe</label>
              <input
                {...register('confirm', { validate: v => v === watch('password') || 'Les mots de passe ne correspondent pas' })}
                type="password"
                className="input"
                placeholder="••••••••"
              />
              {errors.confirm && <p className="text-red-400 text-xs mt-1">{errors.confirm.message}</p>}
            </div>

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full flex items-center justify-center gap-2">
              {isSubmitting ? 'Création...' : (<><UserPlus size={18} /> Rejoindre</>)}
            </button>
          </form>

          <p className="text-center text-sm text-dream-500 mt-6">
            Déjà membre ?{' '}
            <Link to="/login" className="text-dream-600 font-medium hover:underline">Se connecter</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
