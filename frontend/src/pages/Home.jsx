import { Terminal, Code2, Sparkles, Search, Paperclip, Mic, ChevronDown } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-[#0e0e10] text-gray-200 font-sans selection:bg-blue-500/30">
      {/* --- Navigation --- */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#0e0e10]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <Terminal size={20} className="text-white" />
          </div>
          <span className="text-xl font-semibold tracking-tight text-white">CodeClarify</span>
        </div>
        <div className="flex items-center gap-6 text-sm font-medium text-gray-400">
          <button className="hover:text-white transition-colors">Documentation</button>
          <button className="hover:text-white transition-colors">Pricing</button>
          <button className="bg-white text-black px-4 py-2 rounded-full hover:bg-gray-200 transition-all">
            Sign In
          </button>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <main className="max-w-4xl mx-auto pt-24 px-6 flex flex-col items-center">
        <div className="flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest">
          <Sparkles size={14} />
          Agentic AI Engine
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-center text-white mb-4 tracking-tight">
          Understand <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">complex code</span> in seconds.
        </h1>
        <p className="text-gray-400 text-center text-lg mb-12 max-w-2xl">
          Summarize repositories, explain logic, and find bugs with CodeClarify's advanced reasoning engine.
        </p>

        {/* --- Central Input (The Command Bar) --- */}
        <div className="w-full relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative bg-[#18181b] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-4 flex items-end gap-3">
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <Paperclip size={20} />
              </button>
              <textarea 
                placeholder="Paste code or ask a question about your project..."
                className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-gray-500 resize-none py-2 text-lg min-h-[100px]"
              />
            </div>
            
            <div className="flex items-center justify-between px-4 py-3 border-t border-white/5 bg-white/[0.02]">
              <div className="flex gap-2">
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-xs font-medium text-gray-400 hover:bg-white/5 transition-colors">
                  <Code2 size={14} />
                  Choose Model
                  <ChevronDown size={12} />
                </button>
              </div>
              <div className="flex items-center gap-3">
                <button className="p-2 text-gray-400 hover:text-white transition-colors">
                  <Mic size={20} />
                </button>
                <button className="bg-white text-black p-2 rounded-xl hover:scale-105 active:scale-95 transition-all">
                  <Search size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* --- Quick Action Chips (DeepSeek/Gemini Style) --- */}
        <div className="flex flex-wrap justify-center gap-3 mt-10">
          {['Summarize Main logic', 'Explain Regex', 'Find Security Flaws', 'Refactor Functions'].map((text) => (
            <button key={text} className="px-5 py-2.5 rounded-full bg-white/[0.03] border border-white/10 text-sm font-medium text-gray-400 hover:bg-white/[0.08] hover:text-white hover:border-white/20 transition-all">
              {text}
            </button>
          ))}
        </div>
      </main>

      {/* --- Footer Note --- */}
      <footer className="fixed bottom-6 w-full text-center text-gray-600 text-xs">
        CodeClarify can make mistakes. Verify important architectural decisions.
      </footer>
    </div>
  );
};

export default Home;