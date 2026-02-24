/**
 * Simulateur de profils utilisateurs pour "Le Rêve Commun"
 * Génère des profils synthétiques avec des valeurs cohérentes
 *
 * Usage : node simulation/scraper-simulator.js --users 50
 *         npm run simulate -- --users 100
 */
import { writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import bcrypt from 'bcrypt';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Données synthétiques françaises
const FIRST_NAMES = [
  'Léa', 'Emma', 'Chloé', 'Manon', 'Camille', 'Inès', 'Jade', 'Lou', 'Zoé', 'Lucie',
  'Thomas', 'Lucas', 'Hugo', 'Théo', 'Mathieu', 'Antoine', 'Clément', 'Baptiste', 'Robin', 'Axel',
  'Élodie', 'Océane', 'Pauline', 'Marie', 'Sophie', 'Amandine', 'Céline', 'Nathalie', 'Clara', 'Aurélie',
  'Pierre', 'Paul', 'Jean', 'Marc', 'David', 'Nicolas', 'Julien', 'Romain', 'Guillaume', 'Sebastien',
  'Aïcha', 'Fatima', 'Yasmine', 'Sonia', 'Nadia', 'Mehdi', 'Karim', 'Youssef', 'Moussa', 'Omar',
  'Solène', 'Gwenaëlle', 'Morgane', 'Yann', 'Erwann', 'Ronan', 'Anaëlle', 'Maëva', 'Tanguy', 'Loïc'
];

const LAST_NAMES = [
  'Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit', 'Durand', 'Leroy', 'Moreau',
  'Simon', 'Laurent', 'Lefebvre', 'Michel', 'Garcia', 'David', 'Bertrand', 'Roux', 'Vincent', 'Fournier',
  'Morel', 'Girard', 'André', 'Lefèvre', 'Mercier', 'Dupont', 'Lambert', 'Bonnet', 'François', 'Martinez',
  'Legrand', 'Garnier', 'Faure', 'Rousseau', 'Blanc', 'Guérin', 'Muller', 'Henry', 'Roussel', 'Nicolas',
  'Perrin', 'Morin', 'Mathieu', 'Clément', 'Gauthier', 'Dumont', 'Lopez', 'Fontaine', 'Chevalier', 'Robin'
];

const CITIES = [
  { name: 'Paris', lat: 48.8566, lng: 2.3522 },
  { name: 'Lyon', lat: 45.7640, lng: 4.8357 },
  { name: 'Marseille', lat: 43.2965, lng: 5.3698 },
  { name: 'Toulouse', lat: 43.6047, lng: 1.4442 },
  { name: 'Bordeaux', lat: 44.8378, lng: -0.5792 },
  { name: 'Nantes', lat: 47.2184, lng: -1.5536 },
  { name: 'Strasbourg', lat: 48.5734, lng: 7.7521 },
  { name: 'Montpellier', lat: 43.6110, lng: 3.8767 },
  { name: 'Rennes', lat: 48.1147, lng: -1.6794 },
  { name: 'Grenoble', lat: 45.1885, lng: 5.7245 },
  { name: 'Lille', lat: 50.6292, lng: 3.0573 },
  { name: 'Nice', lat: 43.7102, lng: 7.2620 },
  { name: 'Brest', lat: 48.3904, lng: -4.4861 },
  { name: 'Angers', lat: 47.4784, lng: -0.5632 },
  { name: 'Dijon', lat: 47.3220, lng: 5.0415 },
];

// Archétypes de profils avec leurs valeurs probables
const ARCHETYPES = [
  {
    name: 'Spirituel engagé',
    bio_templates: [
      'En chemin vers une vie plus consciente. La méditation et la CNV ont transformé ma façon d\'être.',
      'Explorateur de la non-dualité et des états de conscience. Je cherche des coéquipiers pour co-créer.',
      'Adepte des Accords Toltèques depuis 5 ans. Je crois que nous pouvons choisir notre réalité.',
    ],
    likely_values: [1, 2, 3, 12, 13, 14, 19], // joie consciente, non-dualité, CNV, méditation, etc.
    unlikely_values: [5, 7, 18],
  },
  {
    name: 'Économiste alternatif',
    bio_templates: [
      'Militant pour le RBI depuis 2015. Je crois que la liberté économique est la base de tout.',
      'Entrepreneur social. Je développe des modèles économiques où tout le monde gagne.',
      'Économiste de formation reconverti en militant pour la décroissance choisie.',
    ],
    likely_values: [4, 5, 6, 18, 9], // RBI, économie circulaire, décroissance, monnaies comp., intel. collective
    unlikely_values: [13, 14],
  },
  {
    name: 'Écolo pratique',
    bio_templates: [
      'Je vis en écovillage depuis 3 ans. La permaculture a changé ma relation à la terre.',
      'Maraîcher bio et formateur en permaculture. La nature est notre meilleur professeur.',
      'Végane et militant écolo. Je cherche des projets concrets pour transformer nos habitudes.',
    ],
    likely_values: [7, 8, 17, 15, 6], // écologie profonde, permaculture, alimentation, habitat, décroissance
    unlikely_values: [13, 18],
  },
  {
    name: 'Créateur de lien social',
    bio_templates: [
      'Facilitateur en intelligence collective. J\'organise des cercles de parole dans ma région.',
      'Parentalité consciente et éducation Montessori : ma passion au quotidien.',
      'Artiste et thérapeute. Je crois en le pouvoir transformateur de la création.',
    ],
    likely_values: [9, 10, 11, 16, 19], // intel. collective, slow living, parentalité, arts, guérison
    unlikely_values: [2, 8],
  },
  {
    name: 'Explorateur holistique',
    bio_templates: [
      'Un peu de tout : méditation, CNV, RBI, permaculture... Je cherche la cohérence globale.',
      'En transition vers une vie plus alignée. Chaque jour est une opportunité d\'apprendre.',
      'Touche-à-tout passionné. Mon rêve : une société où chacun peut être pleinement lui-même.',
    ],
    likely_values: [1, 3, 4, 7, 12, 16], // valeurs variées
    unlikely_values: [],
  },
];

// Algorithme de résonance : score entre deux profils
export function calculateResonance(valueIds1, valueIds2) {
  if (!valueIds1.length || !valueIds2.length) return 0;
  const set1 = new Set(valueIds1);
  const shared = valueIds2.filter(v => set1.has(v));
  const union = new Set([...valueIds1, ...valueIds2]);
  // Jaccard similarity + bonus pour les partages absolus
  return (shared.length / union.size) * 100;
}

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomSubset(arr, min, max) {
  const count = min + Math.floor(Math.random() * (max - min + 1));
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, arr.length));
}

async function generateUser(index) {
  const archetype = randomChoice(ARCHETYPES);
  const city = randomChoice(CITIES);
  const firstName = randomChoice(FIRST_NAMES);
  const lastName = randomChoice(LAST_NAMES);
  const name = `${firstName} ${lastName}`;
  const email = `${firstName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}.${lastName.toLowerCase()}_${index}@example.com`;

  // Sélectionner 3-7 valeurs depuis les valeurs probables de l'archétype + 0-2 aléatoires
  const allValueIds = Array.from({ length: 20 }, (_, i) => i + 1);
  const baseValues = randomSubset(archetype.likely_values, 3, 5);
  const extraValues = randomSubset(
    allValueIds.filter(v => !archetype.likely_values.includes(v) && !archetype.unlikely_values.includes(v)),
    0, 2
  );
  const value_ids = [...new Set([...baseValues, ...extraValues])];

  const bio = randomChoice(archetype.bio_templates);
  const password_hash = await bcrypt.hash('simulateduser2024', 10);

  return {
    name,
    email,
    password_hash,
    location: city.name,
    bio,
    archetype: archetype.name,
    value_ids,
    geo: { lat: city.lat + (Math.random() - 0.5) * 0.5, lng: city.lng + (Math.random() - 0.5) * 0.5 },
  };
}

async function main() {
  const args = process.argv.slice(2);
  const usersFlag = args.indexOf('--users');
  const count = usersFlag !== -1 ? parseInt(args[usersFlag + 1]) : 50;

  console.log(`\n✨ Génération de ${count} profils simulés pour Le Rêve Commun...\n`);

  const users = [];
  for (let i = 0; i < count; i++) {
    users.push(await generateUser(i + 1));
    if ((i + 1) % 10 === 0) process.stdout.write(`   ${i + 1}/${count} profils créés...\r`);
  }

  // Calculer quelques statistiques
  const valueDistribution = {};
  users.forEach(u => u.value_ids.forEach(v => {
    valueDistribution[v] = (valueDistribution[v] || 0) + 1;
  }));

  const topValues = Object.entries(valueDistribution)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([id, count]) => `Valeur #${id}: ${count} utilisateurs`);

  // Sauvegarder
  const outputDir = join(__dirname, 'test-data');
  mkdirSync(outputDir, { recursive: true });
  writeFileSync(join(outputDir, 'users.json'), JSON.stringify(users, null, 2));

  // Générer aussi la carte de réseau (pour la visualisation)
  const networkData = {
    nodes: users.slice(0, 30).map((u, i) => ({
      id: i,
      name: u.name,
      location: u.location,
      archetype: u.archetype,
      value_ids: u.value_ids,
      geo: u.geo,
    })),
    edges: [],
  };

  // Calculer les connexions (score > 30%)
  for (let i = 0; i < networkData.nodes.length; i++) {
    for (let j = i + 1; j < networkData.nodes.length; j++) {
      const score = calculateResonance(networkData.nodes[i].value_ids, networkData.nodes[j].value_ids);
      if (score > 30) {
        networkData.edges.push({ source: i, target: j, score: Math.round(score) });
      }
    }
  }

  writeFileSync(join(outputDir, 'network.json'), JSON.stringify(networkData, null, 2));

  console.log(`\n✅ Terminé !`);
  console.log(`   📁 ${count} profils → simulation/test-data/users.json`);
  console.log(`   🕸️  Réseau de ${networkData.edges.length} connexions → simulation/test-data/network.json`);
  console.log(`\n   Top 5 valeurs les plus partagées :`);
  topValues.forEach(v => console.log(`     ${v}`));
  console.log(`\n   Prochaine étape : npm run db:seed`);
}

main().catch(console.error);
