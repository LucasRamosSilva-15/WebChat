import { useState } from 'react';

// Ícones inline
const Icons = {
  home: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
    </svg>
  ),
  chat: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
    </svg>
  ),
  bell: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
    </svg>
  ),
  user: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
  ),
  search: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  heart: (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
    </svg>
  ),
  heartOutline: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  reply: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
    </svg>
  ),
  repost: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  ),
  share: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
  ),
  image: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
    </svg>
  ),
  emoji: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clipRule="evenodd" />
    </svg>
  ),
  verified: (
    <svg className="w-4 h-4 text-sky-500" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  ),
  more: (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
    </svg>
  ),
  settings: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
    </svg>
  ),
  pin: (
    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L10 6.477V16h2a1 1 0 110 2H8a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" />
    </svg>
  ),
};

// Botão glossy Web 2.0
const GlossyButton = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  const baseStyles = `
    relative font-semibold rounded-full transition-all duration-150
    border shadow-sm
    active:translate-y-px active:shadow-none
  `;
  
  const variants = {
    primary: `
      bg-gradient-to-b from-sky-400 to-sky-500
      border-sky-600 border-b-sky-700
      text-white
      hover:from-sky-500 hover:to-sky-600
      before:absolute before:inset-x-1 before:top-0.5 before:h-1/3 before:bg-gradient-to-b before:from-white/40 before:to-transparent before:rounded-full
    `,
    secondary: `
      bg-gradient-to-b from-gray-100 to-gray-200
      border-gray-300 border-b-gray-400
      text-gray-700
      hover:from-gray-200 hover:to-gray-300
      before:absolute before:inset-x-1 before:top-0.5 before:h-1/3 before:bg-gradient-to-b before:from-white/60 before:to-transparent before:rounded-full
    `,
    danger: `
      bg-gradient-to-b from-rose-400 to-rose-500
      border-rose-600 border-b-rose-700
      text-white
      hover:from-rose-500 hover:to-rose-600
      before:absolute before:inset-x-1 before:top-0.5 before:h-1/3 before:bg-gradient-to-b before:from-white/40 before:to-transparent before:rounded-full
    `,
  };
  
  const sizes = {
    sm: 'px-3 py-1 text-xs',
    md: 'px-4 py-1.5 text-sm',
    lg: 'px-6 py-2 text-base',
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
};

// Card base com estilo skeuomorphic
const Card = ({ children, className = '', noPadding = false }) => (
  <div className={`
    bg-gradient-to-b from-white to-gray-50
    border border-gray-200 border-t-gray-100
    rounded-lg shadow-sm
    ${noPadding ? '' : 'p-3'}
    ${className}
  `}>
    {children}
  </div>
);

// Avatar com borda glossy
const Avatar = ({ src, name, size = 'md', online = false }) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };
  
  const colors = ['bg-sky-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-violet-500'];
  const colorIndex = name.charCodeAt(0) % colors.length;

  return (
    <div className="relative">
      <div className={`
        ${sizes[size]} rounded-full flex items-center justify-center
        ${colors[colorIndex]} text-white font-semibold
        ring-2 ring-white shadow-sm
        bg-gradient-to-b from-white/20 to-transparent
      `}>
        {name.charAt(0).toUpperCase()}
      </div>
      {online && (
        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full" />
      )}
    </div>
  );
};

// Navegação lateral
const Sidebar = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'home', label: 'Início', icon: Icons.home },
    { id: 'messages', label: 'Mensagens', icon: Icons.chat, badge: 3 },
    { id: 'notifications', label: 'Notificações', icon: Icons.bell, badge: 12 },
    { id: 'profile', label: 'Perfil', icon: Icons.user },
    { id: 'settings', label: 'Configurações', icon: Icons.settings },
  ];

  return (
    <aside className="w-56 flex-shrink-0 p-3 space-y-1">
      {/* Logo */}
      <div className="px-3 py-2 mb-4">
        <h1 className="text-xl font-bold text-sky-500 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center text-white shadow-sm">
            W
          </span>
          WebChat
        </h1>
      </div>

      {/* Nav items */}
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className={`
            w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all
            ${activeTab === item.id 
              ? 'bg-gradient-to-r from-sky-100 to-sky-50 text-sky-600 font-semibold border border-sky-200' 
              : 'text-gray-600 hover:bg-gray-100'
            }
          `}
        >
          <span className={activeTab === item.id ? 'text-sky-500' : 'text-gray-400'}>{item.icon}</span>
          <span className="flex-1">{item.label}</span>
          {item.badge && (
            <span className={`
              min-w-[20px] h-5 px-1.5 rounded-full text-xs font-bold flex items-center justify-center
              ${activeTab === item.id 
                ? 'bg-sky-500 text-white' 
                : 'bg-gradient-to-b from-rose-400 to-rose-500 text-white'
              }
            `}>
              {item.badge}
            </span>
          )}
        </button>
      ))}

      {/* Postar botão */}
      <div className="pt-4">
        <GlossyButton variant="primary" className="w-full justify-center py-2.5">
          Postar
        </GlossyButton>
      </div>

      {/* Mini perfil */}
      <div className="!mt-auto pt-6">
        <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
          <Avatar name="Lucas" size="sm" online />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">Lucas Ramos</p>
            <p className="text-xs text-gray-500">@lucasramos</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

// Post/Mensagem no feed
const PostCard = ({ post, compact = false }) => {
  const [liked, setLiked] = useState(post.liked || false);
  const [likes, setLikes] = useState(post.likes);
  const [reposted, setReposted] = useState(post.reposted || false);
  const [reposts, setReposts] = useState(post.reposts);

  const handleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  const handleRepost = () => {
    setReposted(!reposted);
    setReposts(reposted ? reposts - 1 : reposts + 1);
  };

  return (
    <article className={`
      flex gap-2.5 p-3 border-b border-gray-100
      hover:bg-gradient-to-r hover:from-sky-50/50 hover:to-transparent
      transition-colors cursor-pointer
      ${compact ? 'py-2' : ''}
    `}>
      <Avatar name={post.author} size={compact ? 'sm' : 'md'} online={post.online} />
      
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center gap-1.5 text-sm">
          <span className="font-semibold text-gray-900 hover:underline">{post.author}</span>
          {post.verified && Icons.verified}
          {post.role && (
            <span className={`
              px-1.5 py-0.5 text-[10px] font-bold rounded
              ${post.role === 'DONO' ? 'bg-amber-100 text-amber-700' : 'bg-sky-100 text-sky-700'}
            `}>
              {post.role}
            </span>
          )}
          <span className="text-gray-400">@{post.username}</span>
          <span className="text-gray-300">·</span>
          <span className="text-gray-400 hover:underline">{post.time}</span>
          {post.pinned && (
            <span className="text-gray-400 flex items-center gap-1 ml-1">
              {Icons.pin} Fixado
            </span>
          )}
        </div>

        {/* Conteúdo */}
        <p className={`text-gray-800 mt-1 ${compact ? 'text-sm' : ''}`}>
          {post.content}
        </p>

        {/* Imagem */}
        {post.image && (
          <div className="mt-2 rounded-xl overflow-hidden border border-gray-200">
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-40 flex items-center justify-center text-gray-400">
              {Icons.image}
            </div>
          </div>
        )}

        {/* Reply context */}
        {post.replyTo && (
          <div className="mt-1.5 text-sm text-gray-500 flex items-center gap-1">
            <span className="text-gray-400">{Icons.reply}</span>
            Respondendo a <span className="text-sky-500 hover:underline">@{post.replyTo}</span>
          </div>
        )}

        {/* Ações */}
        <div className="flex items-center gap-6 mt-2">
          <button className="flex items-center gap-1.5 text-gray-400 hover:text-sky-500 transition-colors group">
            <span className="p-1.5 rounded-full group-hover:bg-sky-100 transition-colors">
              {Icons.reply}
            </span>
            <span className="text-xs">{post.replies}</span>
          </button>
          
          <button 
            onClick={handleRepost}
            className={`flex items-center gap-1.5 transition-colors group ${reposted ? 'text-emerald-500' : 'text-gray-400 hover:text-emerald-500'}`}
          >
            <span className="p-1.5 rounded-full group-hover:bg-emerald-100 transition-colors">
              {Icons.repost}
            </span>
            <span className="text-xs">{reposts}</span>
          </button>
          
          <button 
            onClick={handleLike}
            className={`flex items-center gap-1.5 transition-colors group ${liked ? 'text-rose-500' : 'text-gray-400 hover:text-rose-500'}`}
          >
            <span className="p-1.5 rounded-full group-hover:bg-rose-100 transition-colors">
              {liked ? Icons.heart : Icons.heartOutline}
            </span>
            <span className="text-xs">{likes}</span>
          </button>
          
          <button className="flex items-center gap-1.5 text-gray-400 hover:text-sky-500 transition-colors group">
            <span className="p-1.5 rounded-full group-hover:bg-sky-100 transition-colors">
              {Icons.share}
            </span>
          </button>
        </div>
      </div>

      <button className="text-gray-300 hover:text-gray-500 self-start p-1">
        {Icons.more}
      </button>
    </article>
  );
};

// Composer para novo post
const PostComposer = () => {
  const [text, setText] = useState('');

  return (
    <div className="p-3 border-b border-gray-200 bg-white">
      <div className="flex gap-2.5">
        <Avatar name="Lucas" size="md" online />
        <div className="flex-1">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="O que está acontecendo?"
            className="
              w-full resize-none border-0 outline-none text-gray-800 placeholder-gray-400
              text-base min-h-[60px] bg-transparent
            "
            rows={2}
          />
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center gap-1">
              <button className="p-2 text-sky-500 hover:bg-sky-50 rounded-full transition-colors">
                {Icons.image}
              </button>
              <button className="p-2 text-sky-500 hover:bg-sky-50 rounded-full transition-colors">
                {Icons.emoji}
              </button>
            </div>
            <div className="flex items-center gap-2">
              {text.length > 0 && (
                <span className={`text-xs ${text.length > 280 ? 'text-rose-500' : 'text-gray-400'}`}>
                  {280 - text.length}
                </span>
              )}
              <GlossyButton variant="primary" size="sm" disabled={!text.trim() || text.length > 280}>
                Postar
              </GlossyButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sidebar direita - Trends e sugestões
const RightSidebar = () => {
  const trends = [
    { topic: 'Tecnologia', tag: '#ReactJS', posts: '12.5K' },
    { topic: 'Brasil', tag: '#WebDev', posts: '8.2K' },
    { topic: 'Tendência', tag: '#AI', posts: '45.1K' },
    { topic: 'Programação', tag: '#TypeScript', posts: '5.8K' },
  ];

  const suggestions = [
    { name: 'Ana Silva', username: 'anasilva', verified: true },
    { name: 'Pedro Costa', username: 'pedrocosta', verified: false },
    { name: 'Maria Santos', username: 'mariasantos', verified: true },
  ];

  return (
    <aside className="w-72 flex-shrink-0 p-3 space-y-3">
      {/* Search */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {Icons.search}
        </span>
        <input
          type="text"
          placeholder="Buscar"
          className="
            w-full pl-10 pr-4 py-2 rounded-full
            bg-gray-100 border border-gray-200
            text-sm text-gray-800 placeholder-gray-400
            focus:outline-none focus:border-sky-300 focus:bg-white focus:ring-2 focus:ring-sky-100
            transition-all
          "
        />
      </div>

      {/* Trends */}
      <Card noPadding>
        <h3 className="font-bold text-gray-900 p-3 pb-2">Tendências para você</h3>
        {trends.map((trend, i) => (
          <div key={i} className="px-3 py-2 hover:bg-gray-50 cursor-pointer transition-colors">
            <p className="text-xs text-gray-500">{trend.topic}</p>
            <p className="font-semibold text-gray-900 text-sm">{trend.tag}</p>
            <p className="text-xs text-gray-500">{trend.posts} posts</p>
          </div>
        ))}
        <button className="w-full p-3 text-left text-sky-500 hover:bg-gray-50 text-sm transition-colors rounded-b-lg">
          Mostrar mais
        </button>
      </Card>

      {/* Sugestões */}
      <Card noPadding>
        <h3 className="font-bold text-gray-900 p-3 pb-2">Quem seguir</h3>
        {suggestions.map((user, i) => (
          <div key={i} className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 transition-colors">
            <Avatar name={user.name} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate flex items-center gap-1">
                {user.name}
                {user.verified && Icons.verified}
              </p>
              <p className="text-xs text-gray-500">@{user.username}</p>
            </div>
            <GlossyButton variant="secondary" size="sm">Seguir</GlossyButton>
          </div>
        ))}
        <button className="w-full p-3 text-left text-sky-500 hover:bg-gray-50 text-sm transition-colors rounded-b-lg">
          Mostrar mais
        </button>
      </Card>

      {/* Footer links */}
      <div className="text-xs text-gray-400 px-3 space-x-2">
        <a href="#" className="hover:underline">Termos</a>
        <a href="#" className="hover:underline">Privacidade</a>
        <a href="#" className="hover:underline">Cookies</a>
        <span>© 2024 WebChat</span>
      </div>
    </aside>
  );
};

// Feed principal
const MainFeed = () => {
  const [activeFilter, setActiveFilter] = useState('para-voce');

  const posts = [
    {
      id: 1,
      author: 'Carlos Oliveira',
      username: 'carlosoliveira',
      role: 'DONO',
      verified: true,
      time: '2min',
      content: 'Acabei de lançar a nova versão do WebChat! Muitas melhorias de performance e novo design. O que vocês acham?',
      image: true,
      replies: 24,
      reposts: 12,
      likes: 89,
      online: true,
      pinned: true,
    },
    {
      id: 2,
      author: 'Ana Silva',
      username: 'anasilva',
      verified: true,
      time: '15min',
      content: 'Testando as novas salas de chat. A interface está muito mais fluida agora! Parabéns ao time.',
      replies: 8,
      reposts: 3,
      likes: 45,
      liked: true,
      online: true,
      replyTo: 'carlosoliveira',
    },
    {
      id: 3,
      author: 'Pedro Costa',
      username: 'pedrocosta',
      time: '32min',
      content: 'Alguém sabe se já liberaram a funcionalidade de temas personalizados? Quero muito testar!',
      replies: 12,
      reposts: 2,
      likes: 18,
    },
    {
      id: 4,
      author: 'Maria Santos',
      username: 'mariasantos',
      role: 'MOD',
      verified: false,
      time: '1h',
      content: 'Lembrete: amanhã teremos manutenção programada das 3h às 5h. Salvem seus rascunhos!',
      replies: 5,
      reposts: 28,
      likes: 34,
      reposted: true,
    },
    {
      id: 5,
      author: 'João Lima',
      username: 'joaolima',
      time: '2h',
      content: 'O novo sistema de notificações está excelente. Finalmente não perco mais mensagens importantes.',
      replies: 3,
      reposts: 1,
      likes: 22,
      online: true,
    },
  ];

  return (
    <main className="flex-1 border-x border-gray-200 min-w-0 max-w-[600px]">
      {/* Header */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-10">
        <h2 className="font-bold text-lg px-4 py-3">Início</h2>
        <div className="flex">
          {[
            { id: 'para-voce', label: 'Para você' },
            { id: 'seguindo', label: 'Seguindo' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`
                flex-1 py-3 text-sm font-medium transition-colors relative
                ${activeFilter === tab.id ? 'text-gray-900' : 'text-gray-500 hover:bg-gray-50'}
              `}
            >
              {tab.label}
              {activeFilter === tab.id && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-sky-500 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </header>

      {/* Composer */}
      <PostComposer />

      {/* Feed */}
      <div className="divide-y divide-gray-100">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </main>
  );
};

// Componente principal
const LayoutDemo2 = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [showMobileNav, setShowMobileNav] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
        <button 
          onClick={() => setShowMobileNav(true)}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-lg font-bold text-sky-500">WebChat</h1>
        <div className="w-10" />
      </header>

      {/* Mobile Nav Overlay */}
      {showMobileNav && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileNav(false)} />
          <div className="absolute left-0 top-0 h-full w-64 bg-white shadow-xl">
            <Sidebar activeTab={activeTab} setActiveTab={(tab) => { setActiveTab(tab); setShowMobileNav(false); }} />
          </div>
        </div>
      )}

      <div className="max-w-[1200px] mx-auto flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        <MainFeed />
        {/* Desktop Right Sidebar */}
        <div className="hidden xl:block">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
};

export default LayoutDemo2;
