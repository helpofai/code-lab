import { useEditor, EditorContent } from '@tiptap/react'
import { BubbleMenu, FloatingMenu } from '@tiptap/react/menus'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import BubbleMenuExtension from '@tiptap/extension-bubble-menu'
import FloatingMenuExtension from '@tiptap/extension-floating-menu'
import { 
    Bold, 
    Italic, 
    Underline as UnderlineIcon,
    List, 
    ListOrdered, 
    Quote, 
    Undo, 
    Redo, 
    Heading1, 
    Heading2, 
    Code,
    Link as LinkIcon,
    Plus,
    Type,
    Highlighter
} from 'lucide-react'
import { useCallback } from 'react'

const MenuBar = ({ editor }) => {
  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    // cancelled
    if (url === null) {
      return
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  if (!editor) {
    return null
  }

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-zinc-900/50 backdrop-blur-md sticky top-0 z-10">
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        active={editor.isActive('bold')}
        title="Bold"
      >
        <Bold size={18} />
      </ToolbarButton>
      
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        active={editor.isActive('italic')}
        title="Italic"
      >
        <Italic size={18} />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        active={editor.isActive('underline')}
        title="Underline"
      >
        <UnderlineIcon size={18} />
      </ToolbarButton>

      <ToolbarButton
        onClick={setLink}
        active={editor.isActive('link')}
        title="Add Link"
      >
        <LinkIcon size={18} />
      </ToolbarButton>

      <div className="w-px h-6 bg-slate-200 dark:bg-white/10 mx-1" />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        active={editor.isActive('heading', { level: 1 })}
        title="Heading 1"
      >
        <Heading1 size={18} />
      </ToolbarButton>
      
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        active={editor.isActive('heading', { level: 2 })}
        title="Heading 2"
      >
        <Heading2 size={18} />
      </ToolbarButton>

      <div className="w-px h-6 bg-slate-200 dark:bg-white/10 mx-1" />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive('bulletList')}
        title="Bullet List"
      >
        <List size={18} />
      </ToolbarButton>
      
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive('orderedList')}
        title="Ordered List"
      >
        <ListOrdered size={18} />
      </ToolbarButton>

      <div className="w-px h-6 bg-slate-200 dark:bg-white/10 mx-1" />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        active={editor.isActive('codeBlock')}
        title="Code Block"
      >
        <Code size={18} />
      </ToolbarButton>
      
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={editor.isActive('blockquote')}
        title="Blockquote"
      >
        <Quote size={18} />
      </ToolbarButton>

      <div className="flex-1" />

      <div className="flex items-center gap-1">
        <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
            title="Undo"
        >
            <Undo size={18} />
        </ToolbarButton>
        <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
            title="Redo"
        >
            <Redo size={18} />
        </ToolbarButton>
      </div>
    </div>
  )
}

const ToolbarButton = ({ onClick, disabled, active, title, children }) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`p-2 rounded-lg transition-all duration-200 hover:bg-slate-200 dark:hover:bg-white/10 disabled:opacity-30 ${
            active ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-500/20' : 'text-slate-600 dark:text-slate-400'
        }`}
        title={title}
    >
        {children}
    </button>
);

const TiptapEditor = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-indigo-600 dark:text-indigo-400 underline decoration-indigo-500/30 underline-offset-4 cursor-pointer',
        },
      }),
      Placeholder.configure({
        placeholder: 'Write your story here...',
      }),
      BubbleMenuExtension,
      FloatingMenuExtension,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base dark:prose-invert max-w-none focus:outline-none min-h-[450px] p-6 sm:p-10',
      },
    },
  })

  if (editor && content !== editor.getHTML() && !editor.isFocused) {
      editor.commands.setContent(content)
  }

  return (
    <div className="w-full border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden bg-white dark:bg-black shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
      <MenuBar editor={editor} />
      
      {editor && (
        <BubbleMenu 
            editor={editor} 
            options={{ duration: 100 }}
            className="flex items-center gap-1 p-1 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl backdrop-blur-xl"
        >
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive('bold')}
          >
            <Bold size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive('italic')}
          >
            <Italic size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            active={editor.isActive('underline')}
          >
            <UnderlineIcon size={16} />
          </ToolbarButton>
          <div className="w-px h-4 bg-slate-200 dark:bg-white/10 mx-0.5" />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            active={editor.isActive('heading', { level: 1 })}
          >
            <Heading1 size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            active={editor.isActive('heading', { level: 2 })}
          >
            <Heading2 size={16} />
          </ToolbarButton>
        </BubbleMenu>
      )}

      {editor && (
        <FloatingMenu 
            editor={editor} 
            options={{ duration: 100 }}
            className="flex items-center gap-1 p-1 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl"
        >
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            active={editor.isActive('heading', { level: 1 })}
          >
            <Heading1 size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            active={editor.isActive('heading', { level: 2 })}
          >
            <Heading2 size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive('bulletList')}
          >
            <List size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            active={editor.isActive('codeBlock')}
          >
            <Code size={16} />
          </ToolbarButton>
        </FloatingMenu>
      )}

      <EditorContent editor={editor} />
      
      <div className="px-4 py-2 border-t border-slate-100 dark:border-white/5 bg-slate-50/30 dark:bg-white/5 flex justify-between items-center text-[10px] text-slate-400 uppercase tracking-widest font-bold">
          <div className="flex items-center gap-4">
              <span>{editor?.storage?.history?.undos?.length ? 'Modified' : 'Clean'}</span>
              <span>{editor?.getText().split(/\s+/).filter(Boolean).length} words</span>
          </div>
          <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${editor?.isEditable ? 'bg-green-500' : 'bg-red-500'}`} />
              <span>{editor?.isEditable ? 'Ready' : 'Read Only'}</span>
          </div>
      </div>
    </div>
  )
}

export default TiptapEditor