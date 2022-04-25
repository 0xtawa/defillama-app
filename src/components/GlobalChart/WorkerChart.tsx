import React, { useEffect, useRef } from 'react'
import { createWorkerFactory, useWorker } from '@shopify/react-web-worker'
import { IChartApi } from 'lightweight-charts'

const createWorker = createWorkerFactory(() => import('./worker'))

export default function WorkerChart({ data, base, baseChange, title, field, width, type, units }) {
  const worker = useWorker(createWorker)
  // reference for DOM element to create with chart
  const ref = useRef()
  const existingChart = useRef<IChartApi | null>()

  useEffect(() => {
    ;(async () => {
      const chart = await worker.buildChart({
        ref,
        data,
        base,
        baseChange,
        title,
        field,
        width,
        type,
        units,
        existingChart: existingChart.current,
      })

      existingChart.current = chart
    })()
  }, [worker, data, base, baseChange, title, field, width, type, units])

  return <div ref={ref} id={'test-id' + type} />
}
