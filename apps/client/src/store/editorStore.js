import { create } from 'zustand'

const useEditorStore = create((set) => ({
  html: '<h1>Hello Code Lab!</h1>',
  css: 'h1 { color: #4ade80; }',
  js: 'console.log("Welcome to Code Lab");',
  title: 'Untitled',
  penId: null,
  
  setHtml: (html) => set({ html }),
  setCss: (css) => set({ css }),
  setJs: (js) => set({ js }),
  setTitle: (title) => set({ title }),
  setPenId: (penId) => set({ penId }),
  
  setPen: (pen) => set({
    html: pen.html,
    css: pen.css,
    js: pen.js,
    title: pen.title,
    penId: pen.id
  })
}))

export default useEditorStore
