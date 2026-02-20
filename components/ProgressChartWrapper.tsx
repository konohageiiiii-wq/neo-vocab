'use client'

import dynamic from 'next/dynamic'

type DataPoint = { date: string; rate: number }

const ProgressChart = dynamic(() => import('@/components/ProgressChart'), { ssr: false })

export default function ProgressChartWrapper({ data }: { data: DataPoint[] }) {
  return <ProgressChart data={data} />
}
