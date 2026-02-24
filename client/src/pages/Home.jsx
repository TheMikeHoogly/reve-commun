import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Users, Lightbulb, ArrowRight } from 'lucide-react';

const QUOTES = [
  { text: 'La joie est la boussole. Le reste est chemin.', author: 'Le Rêve Commun' },
  { text: 'Soyez le changement que vous souhaitez voir dans le monde.', author: 'Gandhi' },
  { text: 'L\'imagination est plus importante que le savoir.', author: 'Einstein' },
  { text: 'Ne soyons pas étudiants de la réalité — soyons-en les artistes.', author: 'Neale Donald Walsch' },
];

const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];

const features = [
  {
    icon: Heart,
    title: 'Résonance profonde',
    desc: 'Trouve des âmes qui partagent tes valeurs fondamentales — au-delà des intérêts superficiels.',
  },
  {
    icon: Users,
    title: 'Cercles locaux',
    desc: 'Rejoins ou crée des espaces de co-création dans ta région, pour passer du rêve à l\'action.',
  },
  {
    icon: Lightbulb,
    title: 'Pépinière de projets',
    desc: 'Propose des initiatives ou rejoins ceux qui cherchent tes compétences pour un monde meilleur.',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-6 text-center overflow-hidden">
        {/* Fond animé */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-dream-200/30"
              style={{
                width: 100 + i * 80,
                height: 100 + i * 80,
                left: `${10 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
              }}
              animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.5 }}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-3xl"
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="text-dream-400" size={28} />
            <span className="text-dream-500 font-medium tracking-wider text-sm uppercase">Bienvenue</span>
            <Sparkles className="text-dream-400" size={28} />
          </div>

          <h1 className="font-display text-5xl md:text-7xl text-dream-900 mb-6 leading-tight">
            Le <span className="gradient-text">Rêve Commun</span>
          </h1>

          <p className="text-xl text-dream-600 mb-4 max-w-xl mx-auto">
            Une plateforme pour les bâtisseurs d'un monde fondé sur la joie, la bienveillance et la co-création.
          </p>

          <blockquote className="italic text-dream-500 text-lg mb-10 border-l-4 border-dream-300 pl-4 text-left max-w-md mx-auto">
            "{randomQuote.text}"
            <footer className="text-sm text-dream-400 not-italic mt-1">— {randomQuote.author}</footer>
          </blockquote>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-primary flex items-center justify-center gap-2">
              Rejoindre la constellation
              <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn-secondary">
              J'ai déjà un compte
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 bg-white/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-3xl text-center text-dream-900 mb-4">
            Et si le but du jeu était simplement de jouer avec joie ?
          </h2>
          <p className="text-dream-500 text-center mb-16 max-w-xl mx-auto">
            Cette plateforme est un espace pour celles et ceux qui ont choisi de choisir consciemment leur réalité.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
                className="card p-6"
              >
                <div className="w-12 h-12 rounded-2xl bg-dream-100 flex items-center justify-center mb-4">
                  <Icon className="text-dream-600" size={22} />
                </div>
                <h3 className="font-semibold text-dream-900 mb-2">{title}</h3>
                <p className="text-dream-500 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-24 px-6 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <p className="text-dream-400 text-sm uppercase tracking-wider mb-4">Un nouveau monde est possible</p>
          <h2 className="font-display text-4xl text-dream-900 mb-6">
            Commence par trouver<br />tes co-créateurs
          </h2>
          <Link to="/register" className="btn-primary inline-flex items-center gap-2">
            Rejoindre maintenant
            <Sparkles size={16} />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
