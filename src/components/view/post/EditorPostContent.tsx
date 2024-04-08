'use client'

import React, { useEffect } from 'react'
import EditorJS from '@editorjs/editorjs'
import Header from '@editorjs/header'
import List from '@editorjs/list'
import Table from '@editorjs/table'
import Code from '@editorjs/code'

export default function EditorPostContent({
  onChange,
}: {
  onChange: (data: any) => void
}) {
  useEffect(() => {
    const editor = new EditorJS({
      holder: 'editorjs',
      placeholder: 'Post Content',
      minHeight: 300,
      tools: {
        header: Header,
        list: List,
        table: Table,
        code: Code,
      },
      onChange: async (data) => {
        onChange(await data.saver.save())
      },
    })

    return () => {
      editor.isReady.then(() => {
        editor.destroy()
      })
    }
  }, [])
  return (
    <div
      id="editorjs"
      className="prose prose-zinc h-[500px] max-w-full overflow-y-auto rounded-md border border-input py-6"
    ></div>
  )
}
