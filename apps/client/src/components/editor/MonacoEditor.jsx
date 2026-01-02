import Editor from '@monaco-editor/react'
import { cn } from '../../utils/cn'

const MonacoEditor = ({ language, value, onChange, className }) => {
  return (
    <div className={cn("flex flex-col h-full w-full bg-[#1e1e1e]", className)}>
      <div className="flex-1 relative overflow-hidden group">
        <Editor
          height="100%"
          language={language === 'js' ? 'javascript' : language}
          theme="vs-dark"
          value={value}
          onChange={onChange}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            padding: { top: 16 },
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            lineNumbers: "on",
            roundedSelection: false,
            scrollBeyondLastLine: false,
            readOnly: false,
            automaticLayout: true,
            cursorBlinking: "smooth",
            smoothScrolling: true,
            overviewRulerBorder: false,
            hideCursorInOverviewRuler: true,
            renderLineHighlight: 'none', 
          }}
        />
      </div>
    </div>
  )
}

export default MonacoEditor