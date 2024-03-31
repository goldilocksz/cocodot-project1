import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import dynamic from 'next/dynamic'
import Link from 'next/link'

const EditorPostContent = dynamic(
  () => import('@/components/view/post/EditorPostContent'),
  {
    ssr: false,
  },
)

export default function page() {
  return (
    <>
      <div className="flex-middle">
        <h1 className="text-lg font-semibold md:text-2xl">Post Create</h1>
      </div>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Title</CardTitle>
          </CardHeader>
          <CardContent>
            <form>
              <Input placeholder="Store Name" />
              <div className="border border-input">
                <EditorPostContent />
              </div>
            </form>
          </CardContent>
          <CardFooter className="justify-center gap-2 border-t px-6 py-4">
            <Button variant="outline">Cancel</Button>
            <Button>Save</Button>
          </CardFooter>
        </Card>
      </div>
    </>
  )
}
