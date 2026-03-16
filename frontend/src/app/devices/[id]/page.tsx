export default async function DeviceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await params
  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold">设备详情</h1>
      <p className="text-muted-foreground mt-2">设备配置与状态，功能开发中。</p>
    </div>
  )
}
