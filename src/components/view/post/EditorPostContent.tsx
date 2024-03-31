'use client'

import EditorJS from '@editorjs/editorjs'
import Header from '@editorjs/header'
import { useEffect } from 'react'

export default function EditorPostContent() {
  useEffect(() => {
    const editor = new EditorJS({
      tools: {
        header: Header,
      },
    })

    // return () => {
    //   editor.isReady
    //     .then(() => {
    //       editor.destroy()
    //     })
    //     .catch((e) => console.error('ERROR editor cleanup', e))
    // }
  }, [])
  return (
    <div
      id="editorjs"
      className="prose prose-zinc min-h-[500px] border border-input"
    ></div>
  )
}
