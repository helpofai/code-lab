import { useEffect, useState, useRef } from 'react'
import useEditorStore from '../../store/editorStore'
import { compileScss } from '../../utils/sassCompiler'

const IframePreview = () => {
  const { html, css, js } = useEditorStore()
  const iframeRef = useRef(null)
  const [compiledCss, setCompiledCss] = useState(css)

  useEffect(() => {
    compileScss(css).then(setCompiledCss);
  }, [css])

  useEffect(() => {
    const timeout = setTimeout(() => {
      const srcDoc = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <script src="https://cdn.tailwindcss.com"></script>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
            <style>
              /* Basic Reset */
              body { margin: 0; padding: 0; }
              ${compiledCss}
            </style>
          </head>
          <body>
            ${html}
            <script>
              try {
                ${js}
              } catch (err) {
                console.error(err);
              }
            </script>
          </body>
        </html>
      `
      
      if (iframeRef.current) {
        iframeRef.current.srcdoc = srcDoc
      }
    }, 500)

    return () => clearTimeout(timeout)
  }, [html, compiledCss, js])

  return (
    <div className="h-full bg-white">
      <iframe
        ref={iframeRef}
        title="preview"
        sandbox="allow-scripts allow-modals allow-same-origin"
        frameBorder="0"
        width="100%"
        height="100%"
      />
    </div>
  )
}

export default IframePreview
