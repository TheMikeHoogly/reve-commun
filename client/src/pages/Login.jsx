import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Sparkles, LogIn } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async ({ email, password }) => {
    try {
      await login(email, password);
      toast.success('Bienvenue dans le Rêve Commun !');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Identifiants invalides');
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
          <h1 className="font-display text-3xl text-dream-900">Retrouver son chemin</h1>
          <p className="text-dream-500 mt-2">Connexion à votre espace</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
              <label className="block text-sm font-medium text-dream-700 mb-2">Mot de passe</label>
              <input
                {...register('password', { required: 'Mot de passe requis' })}
                type="password"
                className="input"
                placeholder="••••••••"
              />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full flex items-center justify-center gap-2">
              {isSubmitting ? 'Connexion...' : (<><LogIn size={18} /> Se connecter</>)}
            </button>
          </form>

          <p className="text-center text-sm text-dream-500 mt-6">
            Pas encore membre ?{' '}
            <Link to="/register" className="text-dream-600 font-medium hover:underline">
              Rejoindre la constellation
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
