import { useParams, useNavigate, Link } from 'react-router-dom'
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels'
import MonacoEditor from '../components/editor/MonacoEditor'
import IframePreview from '../components/preview/IframePreview'
import ShareModal from '../components/editor/ShareModal'
import useEditorStore from '../store/editorStore'
import useAuthStore from '../store/authStore'
import { useEffect, useState } from 'react'
import { LoadingScreen } from '../components/ui/LoadingScreen'
import { Save, ChevronLeft, Layout, Play, Share2, LayoutDashboard, Download, Wand2 } from 'lucide-react'
import { cn } from '../utils/cn'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import prettier from 'prettier/standalone'
import parserHtml from 'prettier/plugins/html'
import parserCss from 'prettier/plugins/postcss'
import parserBabel from 'prettier/plugins/babel'
import parserEstree from 'prettier/plugins/estree'

const EditorPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { html, setHtml, css, setCss, js, setJs, title, setTitle, penId, setPen, setPenId } = useEditorStore()
  const { token, user } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [layoutMode, setLayoutMode] = useState('vertical') // 'vertical' (editors top) or 'horizontal' (editors left)

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const res = await fetch(`/api/pens/${id}`)
          const data = await res.json()
          if (data.id) {
            setPen(data)
          }
        } catch (err) {
          console.error('Failed to fetch pen:', err)
        }
      }
      setTimeout(() => setLoading(false), 1000)
    }

    fetchData()
  }, [id])

  const handleSave = async () => {
    const method = penId ? 'PUT' : 'POST'
    const url = penId ? `/api/pens/${penId}` : '/api/pens'
    
    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ title, html, css, js })
      })
      const data = await res.json()
      if (res.ok) {
        if (!penId) {
          setPenId(data.id)
          navigate(`/editor/${data.id}`)
        }
        alert('Saved successfully!')
      } else {
        alert(data.message)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleDownload = async () => {
    const zip = new JSZip();
    
    // Create HTML file with CSS and JS links
    const indexHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title || 'CodeLab Project'}</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    ${html}
    <script src="script.js"></script>
</body>
</html>`;

    zip.file("index.html", indexHtml);
    zip.file("style.css", css);
    zip.file("script.js", js);

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, `${title.replace(/\s+/g, '-').toLowerCase() || 'project'}.zip`);
  }

  const toggleLayout = () => {
      setLayoutMode(prev => prev === 'vertical' ? 'horizontal' : 'vertical');
  }

  const handleShareClick = () => {
      if (!penId) {
          alert('Please save your project first to share it.');
          return;
      }
      setIsShareModalOpen(true);
  }

  const handleFormat = async () => {
      try {
          const formattedHtml = await prettier.format(html, {
              parser: 'html',
              plugins: [parserHtml],
          });
          const formattedCss = await prettier.format(css, {
              parser: 'css',
              plugins: [parserCss],
          });
          const formattedJs = await prettier.format(js, {
              parser: 'babel',
              plugins: [parserBabel, parserEstree],
          });

          setHtml(formattedHtml);
          setCss(formattedCss);
          setJs(formattedJs);
      } catch (err) {
          console.error('Prettier error:', err);
          alert('Failed to format code. Check your syntax.');
      }
  }

  if (loading) return <LoadingScreen />

  return (
    <div className="flex flex-col h-screen bg-black text-white overflow-hidden">
      {/* Header */}
      <header className="h-16 bg-[#161616] border-b border-white/5 flex items-center px-4 justify-between z-20 flex-shrink-0">
        <div className="flex items-center space-x-4">
          <LinkButton onClick={() => navigate(-1)} icon={<ChevronLeft className="h-5 w-5" />} label="Back" />
          
          <div className="h-6 w-px bg-white/10 mx-2"></div>

          <div className="flex flex-col justify-center">
            <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                className="bg-transparent border-none text-white text-sm font-semibold outline-none w-48 focus:ring-0 p-0 placeholder:text-zinc-600"
                placeholder="Untitled Pen"
            />
            <span className="text-[10px] text-zinc-500 font-medium">
                {user?.username || 'Anonymous'}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
            <Link to="/dashboard">
                <ActionButton icon={<LayoutDashboard className="h-4 w-4 text-indigo-400" />} label="Dashboard" />
            </Link>
            
            <div className="h-6 w-px bg-white/10 mx-2"></div>

            <ActionButton 
                onClick={toggleLayout} 
                icon={<Layout className={cn("h-4 w-4 transition-transform text-slate-400", layoutMode === 'horizontal' && "rotate-90")} />} 
                label="Layout" 
            />
            <ActionButton 
                onClick={handleFormat} 
                icon={<Wand2 className="h-4 w-4 text-slate-400" />} 
                label="Format" 
            />
            <ActionButton 
                onClick={handleShareClick} 
                icon={<Share2 className="h-4 w-4 text-slate-400" />} 
                label="Share" 
            />
            <ActionButton 
                onClick={handleDownload} 
                icon={<Download className="h-4 w-4 text-slate-400" />} 
                label="Export" 
            />
            
            <div className="h-6 w-px bg-white/10 mx-2"></div>

            <button 
                onClick={handleSave}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-md text-sm font-semibold transition-all flex items-center space-x-2 shadow-lg shadow-indigo-500/20"
            >
                <Save className="h-4 w-4" />
                <span>Save</span>
            </button>
            <div className="ml-2">
                <LinkButton icon={<UserAvatar username={user?.username} />} label="Profile" />
            </div>
        </div>
      </header>

      {/* Main Layout Area */}
      <div className="flex-1 min-h-0 relative">
        <PanelGroup orientation={layoutMode === 'vertical' ? 'vertical' : 'horizontal'} style={{ height: '100%', width: '100%' }}>
            {/* Section: Editors */}
            <Panel defaultSize={50} minSize={20} className="h-full">
                <PanelGroup orientation={layoutMode === 'vertical' ? 'horizontal' : 'vertical'} style={{ height: '100%', width: '100%' }}>
                    <Panel defaultSize={33} minSize={10} className="h-full">
                        <MonacoEditor language="html" value={html} onChange={setHtml} />
                    </Panel>
                    <ResizeHandle vertical={layoutMode === 'horizontal'} />
                    <Panel defaultSize={33} minSize={10} className="h-full">
                        <MonacoEditor language="css" value={css} onChange={setCss} />
                    </Panel>
                    <ResizeHandle vertical={layoutMode === 'horizontal'} />
                    <Panel defaultSize={33} minSize={10} className="h-full">
                        <MonacoEditor language="js" value={js} onChange={setJs} />
                    </Panel>
                </PanelGroup>
            </Panel>
            
            <ResizeHandle vertical={layoutMode === 'vertical'} />
            
            {/* Section: Preview */}
            <Panel defaultSize={50} minSize={20} className="h-full">
                <div className="h-full w-full bg-white relative">
                    <IframePreview />
                </div>
            </Panel>
        </PanelGroup>
      </div>
      
      {/* Footer */}
      <div className="h-6 bg-[#161616] border-t border-white/5 flex items-center px-4 justify-between text-[10px] text-zinc-500 select-none flex-shrink-0">
          <div className="flex items-center space-x-4">
              <span className="hover:text-zinc-300 cursor-pointer transition-colors">Console</span>
              <span className="hover:text-zinc-300 cursor-pointer transition-colors">Assets</span>
              <span className="hover:text-zinc-300 cursor-pointer transition-colors">Shortcuts</span>
          </div>
          <div>
              Layout: {layoutMode}
          </div>
      </div>

      <ShareModal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
        penId={penId} 
        title={title} 
      />
    </div>
  )
}

// Helper components
const LinkButton = ({ onClick, icon, label }) => (
    <div className="relative group/link">
        <button 
            onClick={onClick}
            className="p-2.5 hover:bg-white/10 rounded-xl text-zinc-400 hover:text-white transition-all duration-200 border border-transparent hover:border-white/10 active:scale-95 flex items-center justify-center bg-transparent"
        >
            {icon}
        </button>
        {label && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-zinc-800 text-white text-[10px] font-bold rounded opacity-0 group-hover/link:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 border border-white/10 shadow-xl">
                {label}
            </div>
        )}
    </div>
)

const ActionButton = ({ icon, label, onClick }) => (
    <button 
        onClick={onClick}
        className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-white/5 text-zinc-400 hover:text-white text-sm transition-colors font-medium"
    >
        {icon}
        <span className="hidden sm:block">{label}</span>
    </button>
)

const ResizeHandle = ({ vertical }) => (
    <PanelResizeHandle className={cn(
        "bg-black hover:bg-indigo-500 transition-colors flex justify-center items-center group focus:outline-none focus:bg-indigo-500 z-10",
        vertical ? "h-2 w-full border-t border-b border-white/5 cursor-row-resize" : "w-2 h-full border-l border-r border-white/5 cursor-col-resize"
    )}>
        <div className={cn(
            "bg-zinc-800 rounded-full group-hover:bg-white transition-colors",
            vertical ? "w-10 h-1" : "h-10 w-1"
        )} />
    </PanelResizeHandle>
)

const UserAvatar = ({ username }) => (
    <div className="h-6 w-6 rounded bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold ring-1 ring-indigo-500/50">
        {username?.[0]?.toUpperCase() || 'A'}
    </div>
)

export default EditorPage