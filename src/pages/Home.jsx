import { Link } from 'react-router-dom';
import { Users, Globe, GitBranch, Network, BarChart2, ChevronRight, Sparkles, Star } from 'lucide-react';
import { simsData } from '../data/simsData';
import { worldsData } from '../data/worldsData';
import PlaceholderImage from '../components/PlaceholderImage';
import { motion } from 'framer-motion';

const navCards = [
  {
    to: '/sims',
    icon: Users,
    title: 'Sims',
    description: 'Browse all 800+ sims in the save. Filter by occult, world, job, and more.',
    color: '#A3B95A',
    gradient: 'from-[#A3B95A]/20 to-transparent',
  },
  {
    to: '/worlds',
    icon: Globe,
    title: 'Worlds',
    description: 'Explore every world, its lots, and the stories that unfold within them.',
    color: '#C0572A',
    gradient: 'from-[#C0572A]/20 to-transparent',
  },
  {
    to: '/families',
    icon: GitBranch,
    title: 'Families',
    description: 'Trace bloodlines and alliances through interactive family trees.',
    color: '#A3B95A',
    gradient: 'from-[#A3B95A]/15 to-transparent',
  },
  {
    to: '/relations',
    icon: Network,
    title: 'Relations',
    description: 'Navigate the web of friendships, rivalries, and romances between sims.',
    color: '#C0572A',
    gradient: 'from-[#C0572A]/15 to-transparent',
  },
  {
    to: '/statistics',
    icon: BarChart2,
    title: 'Statistics',
    description: 'Charts and data breakdowns across sims and lots.',
    color: '#A3B95A',
    gradient: 'from-[#A3B95A]/10 to-transparent',
  },
];

const loremParagraphs = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.",
  "Sunt in culpa qui officia deserunt mollit anim id est laborum. Curabitur pretium tincidunt lacus. Nulla gravida orci a odio, et tempus feugiat. Nullam varius turpis odio, vel ullamcorper diam vestibulum at. Aenean auctor risus id imperdiet bibendum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Praesent vulputate.",
  "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed."
];

export default function Home() {
  const simCount = simsData.length;
  const worldCount = worldsData.length;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <PlaceholderImage className="w-full h-full object-cover" alt="OCJ Save File main sims" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1C1C1E]/80 via-transparent to-[#1C1C1E]/80" />
        </div>

        {/* Decorative gem orbs */}
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-[#A3B95A]/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 right-10 w-64 h-64 rounded-full bg-[#C0572A]/10 blur-3xl pointer-events-none" />

        {/* Hero content */}
        <motion.div
          className="relative z-10 text-center px-4 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary" />
            <Sparkles className="w-4 h-4 text-primary" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary" />
          </div>

          <p className="text-primary text-sm font-medium tracking-[0.3em] uppercase mb-3">
            Welcome to the
          </p>

          <h1 className="font-heading text-5xl sm:text-7xl font-bold text-foreground mb-4 leading-tight">
            OCJ Save File
          </h1>

          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-secondary" />
            <Star className="w-3 h-3 text-secondary fill-secondary" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-secondary" />
          </div>

          <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed font-light">
            A living encyclopedia of an entire simulated world — its people, places, bloodlines, and stories. 
            Every sim has a life. Every world has a lore. Every connection means something.
          </p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-px h-8 bg-gradient-to-b from-primary to-transparent" />
          <ChevronRight className="w-4 h-4 text-primary rotate-90" />
        </motion.div>
      </section>

      {/* Stats Strip */}
      <section className="py-8 bg-card/50 border-y border-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl font-heading font-bold text-primary">{simCount}+</div>
              <div className="text-sm text-muted-foreground uppercase tracking-widest mt-1">Sims</div>
            </motion.div>
            <div className="w-px bg-border hidden md:block" />
            <motion.div
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="text-4xl font-heading font-bold text-secondary">{worldCount}</div>
              <div className="text-sm text-muted-foreground uppercase tracking-widest mt-1">Worlds</div>
            </motion.div>
            <div className="w-px bg-border hidden md:block" />
            <motion.div
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-4xl font-heading font-bold text-primary">400+</div>
              <div className="text-sm text-muted-foreground uppercase tracking-widest mt-1">Lots</div>
            </motion.div>
            <div className="w-px bg-border hidden md:block" />
            <motion.div
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-4xl font-heading font-bold text-secondary">80+</div>
              <div className="text-sm text-muted-foreground uppercase tracking-widest mt-1">Families</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Lorem ipsum section */}
      <section className="py-16 max-w-4xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="font-heading text-3xl font-bold text-foreground mb-2">About This Save</h2>
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto" />
        </div>
        <div className="space-y-6">
          {loremParagraphs.map((para, i) => (
            <motion.p
              key={i}
              className="text-muted-foreground leading-8 text-base"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              {para}
            </motion.p>
          ))}
        </div>
      </section>

      {/* Navigation cards */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl font-bold text-foreground mb-2">Explore the Save</h2>
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-secondary to-transparent mx-auto" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {navCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.to}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  to={card.to}
                  className="group block relative overflow-hidden rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 bg-card hover:shadow-xl"
                  style={{ boxShadow: `0 0 0 0 ${card.color}` }}
                >
                  {/* Background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                  <div className="relative p-8">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                      style={{ backgroundColor: `${card.color}20`, border: `1px solid ${card.color}40` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: card.color }} />
                    </div>

                    <h3 className="font-heading text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      {card.description}
                    </p>

                    <div className="flex items-center gap-1 text-primary text-sm font-medium">
                      <span>Explore</span>
                      <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Footer spacing */}
      <div className="pb-16" />
    </div>
  );
}