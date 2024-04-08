import PostCreate from '@/components/view/post/PostCreate'

export default async function page() {
  return (
    <div>
      <div className="flex-middle">
        <h1 className="text-lg font-semibold md:text-2xl">Post Create</h1>
      </div>
      <PostCreate />
    </div>
  )
}
