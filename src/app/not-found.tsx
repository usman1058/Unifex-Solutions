import ThemedErrorPage from '@/components/error/themed-error-page'

export default function NotFound() {
  return (
    <ThemedErrorPage
      code={404}
      title="PAGE NOT FOUND"
      message="THE PAGE YOU ARE LOOKING FOR DOES NOT EXIST OR HAS BEEN MOVED."
    />
  )
}
