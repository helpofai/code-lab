import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels';
import MonacoEditor from '../components/editor/MonacoEditor';
import IframePreview from '../components/preview/IframePreview';
import useEditorStore from '../store/editorStore';
import useAuthStore from '../store/authStore';
import { LoadingScreen } from '../components/ui/LoadingScreen';
import { Eye, Heart, Code2, User } from 'lucide-react';
import { cn } from '../utils/cn';

const PublicPen = () => {
  const { id } = useParams();
  const { setPen, html, css, js, title } = useEditorStore();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [penData, setPenData] = useState(null);
  const [layoutMode, setLayoutMode] = useState('vertical');

  useEffect(() => {
    const fetchPen = async () => {
      try {
        const res = await fetch(`/api/pens/${id}`);
        if (!res.ok) throw new Error('Pen not found');
        const data = await res.json();
        setPenData(data);
        setPen(data);
      } catch (err) {
        console.error(err);
      } finally {
        setTimeout(() => setLoading(false), 800);
      }
    };
    fetchPen();
  }, [id, setPen]);

  const handleLike = async () => {
      // Future: Implement like functionality
      alert("Like feature coming soon!");
  };

  if (loading) return <LoadingScreen />;

  if (!penData) return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#131417] text-white">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-zinc-400 mb-8">Pen not found or is private.</p>
          <Link to="/" className="text-indigo-400 hover:text-indigo-300">Go Home</Link>
      </div>
  );

  const isOwner = user && user.id === penData.userId;

  return (
    <div className="flex flex-col h-screen bg-[#131417] text-[#9b9b9b] font-sans overflow-hidden">
      {/* Header */}
      <header className="h-16 bg-[#010101] border-b border-[#2b2b2b] flex items-center px-4 justify-between z-20 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#1e1e1e] text-white">
             <Code2 className="h-6 w-6" />
          </div>
          <div className="flex flex-col justify-center ml-2">
            <h1 className="text-white text-base font-bold leading-tight">{title}</h1>
            <span className="text-[11px] text-[#777] font-medium flex items-center gap-1">
                by <span className="text-white hover:underline cursor-pointer">{penData.user?.username || 'Anonymous'}</span>
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-4 text-xs font-bold text-zinc-400">
                <div className="flex items-center gap-1.5" title="Views">
                    <Eye className="h-4 w-4" />
                    <span>{penData.views || 0}</span>
                </div>
                <button onClick={handleLike} className="flex items-center gap-1.5 hover:text-pink-500 transition-colors" title="Like">
                    <Heart className="h-4 w-4" />
                    <span>{penData.likes || 0}</span>
                </button>
            </div>

            {isOwner && (
                <Link to={`/editor/${id}`}>
                    <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-md text-sm font-bold transition-all">
                        Edit Pen
                    </button>
                </Link>
            )}
            {!user && (
                <Link to="/login">
                    <button className="bg-[#333] hover:bg-[#444] text-white px-4 py-2 rounded-md text-sm font-bold transition-all">
                        Sign Up to Like
                    </button>
                </Link>
            )}
        </div>
      </header>

      {/* Main Layout Area - Read Only */}
      <div className="flex-1 min-h-0 relative bg-[#131417]">
        <PanelGroup orientation={layoutMode === 'vertical' ? 'vertical' : 'horizontal'} style={{ height: '100%', width: '100%' }}>
            
            {/* Editors Section */}
            <Panel defaultSize={50} minSize={10} className="flex flex-col">
                <PanelGroup orientation={layoutMode === 'vertical' ? 'horizontal' : 'vertical'} style={{ height: '100%', width: '100%' }}>
                    
                    <ReadOnlyEditor label="HTML" iconColor="#e34c26" language="html" value={html} />
                    <ResizeHandle vertical={layoutMode === 'horizontal'} />
                    
                    <ReadOnlyEditor label="CSS" iconColor="#264de4" language="css" value={css} />
                    <ResizeHandle vertical={layoutMode === 'horizontal'} />
                    
                    <ReadOnlyEditor label="JS" iconColor="#f0db4f" language="js" value={js} />

                </PanelGroup>
            </Panel>
            
            <ResizeHandle vertical={layoutMode === 'vertical'} />
            
            {/* Preview Section */}
            <Panel defaultSize={50} minSize={10} className="bg-white flex flex-col">
                <div className="h-full w-full relative pointer-events-auto">
                    <IframePreview />
                </div>
            </Panel>

        </PanelGroup>
      </div>
    </div>
  );
};

const ReadOnlyEditor = ({ label, iconColor, language, value }) => (
    <Panel defaultSize={33} minSize={5} className="flex flex-col border-r border-[#2b2b2b]">
        <div className="h-10 bg-[#1e1e1e] border-b border-[#2b2b2b] flex items-center justify-between px-3 select-none">
            <div className="flex items-center text-[#aaa] font-bold text-sm tracking-wide">
                <div className="w-3 h-3 rounded-sm mr-2" style={{ backgroundColor: iconColor }}/>
                {label}
            </div>
        </div>
        <div className="flex-1 relative pointer-events-none opacity-90">
            <MonacoEditor language={language} value={value} onChange={() => {}} />
            {/* Overlay to prevent editing interaction but allow scrolling if needed (Monaco handles readonly, but this double ensures) */}
        </div>
    </Panel>
);

const ResizeHandle = ({ vertical }) => (
    <PanelResizeHandle className={cn(
        "bg-[#000] hover:bg-[#47cf73] transition-colors flex justify-center items-center group focus:outline-none focus:bg-[#47cf73] z-10",
        vertical ? "h-3 w-full border-y border-[#2b2b2b] cursor-row-resize" : "w-3 h-full border-x border-[#2b2b2b] cursor-col-resize"
    )}>
        <div className={cn(
            "bg-[#444] rounded-full group-hover:bg-[#010101] transition-colors",
            vertical ? "w-8 h-1" : "h-8 w-1"
        )} />
    </PanelResizeHandle>
)

export default PublicPen;
