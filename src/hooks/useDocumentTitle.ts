import { useEffect } from 'react'

export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = title ? `${title} — TaskFlow` : 'TaskFlow — Next-Gen Productivity Workspace'
  }, [title])
}
