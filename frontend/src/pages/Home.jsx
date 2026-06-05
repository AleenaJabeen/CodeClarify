import { 
  Terminal, 
  Code2, 
  Sparkles, 
  Search, 
  Paperclip, 
  Mic, 
  ChevronDown, 
  X, 
  ListCollapse, // Changed from ListDetails
  Bug, 
  AlignLeft, 
  Eye, 
  Copy, 
  Trash, 
  LayoutList, 
  ListOrdered, 
  Lightbulb, 
  CheckCircle, 
  Wand,        // Changed from Wand2 for safety across Lucide versions
  Puzzle,
  AlertTriangle,
  Check,
  Wand2
} from 'lucide-react';
import { useState, useEffect } from 'react';

const Home = () => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("auto-detect");
  const [selectedMode, setSelectedMode] = useState("full");
  const [activeTab, setActiveTab] = useState("overview");
  const [copied, setCopied] = useState(false);
  
  // Structured state matched with backend expectations
  const [analysisResult, setAnalysisResult] = useState(null);

  const modeInstructions = {
    full: 'Explain this code in full detail — overview, step-by-step logic, key concepts, bugs, and improvement suggestions.',
    bugs: 'Focus only on bugs, errors, and inefficiencies in this code. Be specific about line-level issues.',
    summary: 'Give a concise 2-3 sentence summary of what this code does.',
    review: 'Do a thorough code review covering readability, performance, security, and best practices.'
  };

  const examples = {
    fibonacci: `def fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)\n\nfor i in range(10):\n    print(fibonacci(i))`,
    regex: `import re\n\ndef extract_emails(text):\n    pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}'\n    return re.findall(pattern, text)\n\ntext = "Contact us at info@example.com or support@test.org"\nprint(extract_emails(text))`,
    sort: `def bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(0, n-i-1):\n            if arr[j] > arr[j+1]:\n                arr[j], arr[j+1] = arr[j+1], arr[j]\n    return arr\n\nprint(bubble_sort([64, 34, 25, 12, 22, 11, 90]))`,
    api: `async function fetchUser(id) {\n  try {\n    const res = await fetch(\`https://api.example.com/users/\${id}\`);\n    if (!res.ok) throw new Error('Network response was not ok');\n    const data = await res.json();\n    return data;\n  } catch (err) {\n    console.error('Fetch failed:', err);\n  }\n}`
  };

  // Local regex-based language preview mirroring backend logic
  useEffect(() => {
    if (!code.trim()) {
      setLanguage("auto-detect");
      return;
    }
    if (/def |import |print\(|:\s*\n/.test(code)) setLanguage("Python");
    else if (/function |const |let |var |=>|console\.log/.test(code)) setLanguage("JavaScript");
    else if (/#include|int main\(|std::|cout/.test(code)) setLanguage("C++");
    else if (/public class|System\.out|void main/.test(code)) setLanguage("Java");
    else setLanguage("auto-detect");
  }, [code]);
const handleSummarize = async () => {
    if (!code.trim()) return;

    try {
      setLoading(true);
      setAnalysisResult(null);

      const response = await fetch("http://127.0.0.1:5000/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: code,
          instruction: modeInstructions[selectedMode],
        }),
      });

      const data = await response.json();

      if (data.success) {
        let rawText = data.summary.trim();
        
        // Anti-broken markdown container check fallback
        if (rawText.startsWith("```")) {
          rawText = rawText.replace(/^```json\s*|```$/g, "").trim();
        }

        try {
          const parsedJson = JSON.parse(rawText);
          
          setAnalysisResult({
            overview: parsedJson.overview || "No overview provided.",
            steps: Array.isArray(parsedJson.steps) ? parsedJson.steps : [],
            concepts: Array.isArray(parsedJson.concepts) ? parsedJson.concepts : [],
            issues: Array.isArray(parsedJson.issues) ? parsedJson.issues : [],
            suggestions: Array.isArray(parsedJson.suggestions) ? parsedJson.suggestions : []
          });
        } catch (jsonParseError) {
          console.error("JSON formatting issue, resorting to text preview:", jsonParseError);
          // Safety fallback layout configuration if structured object is missing
          setAnalysisResult({
            overview: rawText,
            steps: [],
            concepts: [],
            issues: [],
            suggestions: []
          });
        }
        
        setActiveTab("overview");
      } else {
        alert("Backend Error: " + data.message);
      }
    } catch (error) {
      console.error("Network connection error:", error);
      alert("Could not connect to backend server. Make sure your Python Flask app is running.");
    } finally {
      setLoading(false);
    }
  };
  const handleCopy = () => {
    if (!analysisResult) return;
    const textToCopy = [
      `OVERVIEW\n${analysisResult.overview || ''}`,
      `STEPS\n${(analysisResult.steps || []).map((x, i) => `${i + 1}. ${x}`).join('\n')}`,
      `CONCEPTS\n${(analysisResult.concepts || []).join('\n')}`,
      `ISSUES\n${(analysisResult.issues || []).join('\n')}`,
      `SUGGESTIONS\n${(analysisResult.suggestions || []).join('\n')}`
    ].join('\n\n');

    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  const pasteExample = (key) => {
    setCode(examples[key]);
  };

  // Helper template for empty array responses in tabs
  const renderEmptyTab = (icon, msg) => (
    <div className="flex flex-col items-center justify-center py-8 gap-2">
      {icon}
      <p className="text-sm text-gray-500">{msg}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0e0e10] text-gray-200 font-sans selection:bg-blue-500/30 pb-24">
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
      <main className="max-w-3xl mx-auto pt-16 px-6 flex flex-col items-center">
        <div className="flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest">
          <Sparkles size={14} />
          Agentic AI Engine
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-center text-white mb-4 tracking-tight leading-tight">
          Understand <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">complex code</span> in seconds.
        </h1>
        <p className="text-gray-500 text-center text-base mb-10 max-w-lg leading-relaxed">
          Paste any Python, JavaScript, or C++ snippet and get a full breakdown — logic, concepts, bugs, and improvements.
        </p>

        {/* --- Central Input Container --- */}
        <div className="w-full bg-[#18181b] border border-white/10 rounded-2xl shadow-2xl overflow-hidden mb-4">
          {/* Language Header Bar */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5">
            <span className={`text-[11px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full border bg-white/[0.02]
              ${language === 'Python' ? 'text-green-400 border-green-500/30 bg-green-500/5' : ''}
              ${language === 'JavaScript' ? 'text-amber-400 border-amber-500/30 bg-amber-500/5' : ''}
              ${language === 'C++' ? 'text-red-400 border-red-500/30 bg-red-500/5' : ''}
              ${language === 'Java' ? 'text-orange-400 border-orange-500/30 bg-orange-500/5' : ''}
              ${language === 'auto-detect' ? 'text-gray-400 border-white/10' : ''}
            `}>
              {language}
            </span>
            {code && (
              <button onClick={() => setCode("")} className="text-xs text-gray-500 hover:text-white flex items-center gap-1 transition-colors">
                <X size={12} /> clear
              </button>
            )}
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste your code here..."
            className="w-full bg-transparent border-none focus:ring-0 text-gray-200 placeholder-gray-600 font-mono text-[13.5px] leading-relaxed p-4 resize-none min-h-[180px] outline-none"
          /> 
          
          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-2.5 border-t border-white/5 bg-white/[0.01]">
            <div className="flex gap-1.5 flex-wrap">
              {[
{ id: 'full', label: 'Full analysis', icon: <ListCollapse size={13} /> },                { id: 'bugs', label: 'Bugs only', icon: <Bug size={13} /> },
                { id: 'summary', label: 'Quick summary', icon: <AlignLeft size={13} /> },
                { id: 'review', label: 'Code review', icon: <Eye size={13} /> }
              ].map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setSelectedMode(mode.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all duration-150
                    ${selectedMode === mode.id 
                      ? 'bg-blue-500/15 border-blue-500/35 text-blue-300' 
                      : 'border-white/5 text-gray-400 hover:bg-white/5 hover:text-white'}`}
                >
                  {mode.icon}
                  {mode.label}
                </button>
              ))}
            </div>

            <button
              onClick={handleSummarize}
              disabled={loading || !code.trim()}
              className="flex items-center justify-center gap-1.5 bg-blue-600 text-white px-5 py-2 rounded-xl font-semibold text-xs hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 self-end sm:self-auto"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/25 border-t-white rounded-full animate-spin"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  Analyze
                </>
              )}
            </button>
          </div>
        </div>

        {/* --- Tabbed Analysis Card Result --- */}
        {analysisResult && (
          <div className="w-full bg-[#18181b] border border-white/10 rounded-2xl overflow-hidden shadow-2xl mt-4 animate-fadeIn">
            {/* Output Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/6">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-200">
                <Lightbulb size={16} className="text-blue-400" />
                Analysis result
              </div>
              <div className="flex gap-1.5">
                <button onClick={handleCopy} className="flex items-center gap-1 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-gray-400 hover:bg-white/5 hover:text-gray-200 transition-all">
                  {copied ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
                  {copied ? 'copied!' : 'copy'}
                </button>
                <button onClick={() => setAnalysisResult(null)} className="flex items-center gap-1 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-gray-400 hover:bg-white/5 hover:text-gray-200 transition-all">
                  <Trash size={13} />
                  clear
                </button>
              </div>
            </div>

            {/* Tab Selection Row */}
            <div className="flex gap-0.5 px-4 py-2 border-b border-white/5 overflow-x-auto">
              {[
                { id: 'overview', label: 'Overview', icon: <LayoutList size={13} /> },
                { id: 'steps', label: 'Steps', icon: <ListOrdered size={13} /> },
                { id: 'concepts', label: 'Concepts', icon: <Lightbulb size={13} /> },
                { id: 'issues', label: `Issues ${analysisResult.issues?.length ? `(${analysisResult.issues.length})` : ''}`, icon: <Bug size={13} /> },
                { id: 'suggestions', label: 'Suggestions', icon: <Wand2 size={13} /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap
                    ${activeTab === tab.id 
                      ? 'bg-blue-500/15 text-blue-300' 
                      : 'text-gray-500 hover:text-gray-200 hover:bg-white/[0.04]'}`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Interactive Tab Content Renderer */}
            <div className="p-4 max-h-[400px] overflow-y-auto custom-scrollbar">
              {activeTab === 'overview' && (
                <p className="text-gray-300 text-sm leading-relaxed">{analysisResult.overview || 'No overview available.'}</p>
              )}

              {activeTab === 'steps' && (
                (analysisResult.steps?.length > 0) ? (
                  <div className="flex flex-col gap-3.5">
                    {analysisResult.steps.map((step, idx) => (
                      <div key={idx} className="flex gap-3 items-start">
                        <div className="min-w-[24px] h-6 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-bold flex items-center justify-center">
                          {idx + 1}
                        </div>
                        <p className="text-gray-300 text-[13.5px] leading-relaxed pt-0.5">{step}</p>
                      </div>
                    ))}
                  </div>
                ) : renderEmptyTab(<ListOrdered size={24} className="text-gray-700" />, 'No sequential steps available.')
              )}

              {activeTab === 'concepts' && (
                (analysisResult.concepts?.length > 0) ? (
                  <div className="flex flex-col gap-2">
                    {analysisResult.concepts.map((concept, idx) => {
                      const splitIdx = concept.indexOf(':');
                      const title = splitIdx !== -1 ? concept.slice(0, splitIdx) : concept;
                      const desc = splitIdx !== -1 ? concept.slice(splitIdx + 1) : '';
                      return (
                        <div key={idx} className="bg-white/[0.02] border border-white/[0.07] rounded-xl p-3">
                          <div className="text-xs font-semibold text-indigo-400 flex items-center gap-1.5 mb-1">
                            <Puzzle size={13} /> {title.trim()}
                          </div>
                          {desc && <p className="text-xs text-gray-400 leading-relaxed">{desc.trim()}</p>}
                        </div>
                      );
                    })}
                  </div>
                ) : renderEmptyTab(<Lightbulb size={24} className="text-gray-700" />, 'No specific architecture concepts identified.')
              )}

              {activeTab === 'issues' && (
                (analysisResult.issues?.length > 0) ? (
                  <div className="flex flex-col gap-2">
                    {analysisResult.issues.map((issue, idx) => (
                      <div key={idx} className="bg-red-500/[0.05] border border-red-500/15 rounded-xl p-3 flex gap-2.5 items-start">
                        <AlertTriangle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-red-300 leading-relaxed">{issue}</p>
                      </div>
                    ))}
                  </div>
                ) : renderEmptyTab(<CheckCircle size={24} className="text-gray-700" />, 'No issues detected — code clean!')
              )}

              {activeTab === 'suggestions' && (
                (analysisResult.suggestions?.length > 0) ? (
                  <div className="flex flex-col gap-2">
                    {analysisResult.suggestions.map((suggestion, idx) => (
                      <div key={idx} className="bg-green-500/[0.04] border border-green-500/15 rounded-xl p-3 flex gap-2.5 items-start">
                        <Check size={16} className="text-green-400 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-green-300 leading-relaxed">{suggestion}</p>
                      </div>
                    ))}
                  </div>
                ) : renderEmptyTab(<Wand2 size={24} className="text-gray-700" />, 'No suggestions at this time.')
              )}
            </div>
          </div>
        )}

        {/* --- Quick Action Suggestions --- */}
        <div className="flex flex-wrap justify-center gap-2 mt-8">
          {[
            { label: 'Try: Fibonacci', key: 'fibonacci' },
            { label: 'Try: Regex example', key: 'regex' },
            { label: 'Try: Bubble sort', key: 'sort' },
            { label: 'Try: API fetch', key: 'api' }
          ].map((item) => (
            <button 
              key={item.key} 
              onClick={() => pasteExample(item.key)}
              className="px-4 py-2 rounded-full bg-white/[0.02] border border-white/8 text-xs font-medium text-gray-400 hover:bg-white/[0.06] hover:text-white hover:border-white/15 transition-all"
            >
              {item.label}
            </button>
          ))}
        </div>
      </main>

      {/* --- Global Sticky Footer --- */}
      <footer className="fixed bottom-6 left-0 right-0 text-center text-gray-600 text-[11px] pointer-events-none">
        CodeClarify can make mistakes. Verify important architectural decisions.
      </footer>
    </div>
  );
};

export default Home;