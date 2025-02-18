import React from 'react'
import { useDarkModeManager } from 'contexts/LocalStorage'
import { Area, XAxis, YAxis, ResponsiveContainer, Tooltip, AreaChart, BarChart, Bar, ReferenceLine } from 'recharts'
import { toK, toNiceDateYear, formattedNum } from 'utils'

function stringToColour() {
  return '#' + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, '0')
}

export function GeneralAreaChart({
  aspect,
  finalChartData,
  tokensUnique,
  color,
  formatDate,
  moneySymbol = '$',
  hallmarks = [],
}) {
  const [darkMode] = useDarkModeManager()
  const textColor = darkMode ? 'white' : 'black'
  return (
    <ResponsiveContainer aspect={aspect}>
      <AreaChart margin={{ top: 0, right: 10, bottom: 6, left: 0 }} barCategoryGap={1} data={finalChartData}>
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.35} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          tickLine={false}
          axisLine={false}
          interval="preserveEnd"
          tickMargin={16}
          minTickGap={120}
          tickFormatter={formatDate}
          dataKey={tokensUnique.length > 0 ? 'date' : '0'}
          scale="time"
          type="number"
          tick={{ fill: textColor }}
          domain={['dataMin', 'dataMax']}
        />
        <YAxis
          type="number"
          orientation="right"
          tickFormatter={(tick) => moneySymbol + toK(tick)}
          axisLine={false}
          tickLine={false}
          interval="preserveEnd"
          minTickGap={80}
          yAxisId={0}
          tick={{ fill: textColor }}
        />
        <Tooltip
          cursor={true}
          formatter={(val) => formattedNum(val, moneySymbol === '$')}
          labelFormatter={(label) => toNiceDateYear(label)}
          labelStyle={{ paddingTop: 4 }}
          itemSorter={(item) => -item.value}
          contentStyle={{
            padding: '10px 14px',
            borderRadius: 10,
            borderColor: color,
            color: 'black',
          }}
          wrapperStyle={{ top: -70, left: -10 }}
        />
        {hallmarks.map((hallmark, i) => (
          <ReferenceLine
            x={hallmark[0]}
            stroke={textColor}
            label={{ value: hallmark[1], fill: textColor, position: 'insideTop', offset: ((i * 50) % 300) + 50 }}
            key={'hall1' + i}
          />
        ))}
        {tokensUnique.length > 0 ? (
          tokensUnique.map((tokenSymbol) => {
            const randomColor = stringToColour()
            return (
              <Area
                type="monotone"
                dataKey={tokenSymbol}
                key={tokenSymbol}
                stackId="1"
                fill={randomColor}
                stroke={randomColor}
              />
            )
          })
        ) : (
          <Area
            key={'other'}
            dataKey="1"
            isAnimationActive={false}
            stackId="2"
            strokeWidth={2}
            dot={false}
            type="monotone"
            name={'TVL'}
            yAxisId={0}
            stroke={color}
            fill="url(#colorUv)"
          />
        )}
      </AreaChart>
    </ResponsiveContainer>
  )
}

const GeneralBarChart = React.memo(function GeneralBarChart({
  aspect,
  finalChartData,
  tokensUnique,
  color,
  formatDate,
  moneySymbol = '$',
  hallmarks = [],
}) {
  const [darkMode] = useDarkModeManager()
  const textColor = darkMode ? 'white' : 'black'
  const tokenBreakdown = tokensUnique.length > 0
  return (
    <ResponsiveContainer aspect={aspect}>
      <BarChart margin={{ top: 0, right: 10, bottom: 6, left: 10 }} barCategoryGap={1} data={finalChartData}>
        <XAxis
          tickLine={false}
          axisLine={false}
          interval="preserveEnd"
          minTickGap={80}
          tickMargin={14}
          tickFormatter={formatDate}
          dataKey={tokenBreakdown ? 'date' : '0'}
          scale="time"
          type="number"
          tick={{ fill: textColor }}
          domain={['dataMin', 'dataMax']}
        />
        <YAxis
          type="number"
          axisLine={false}
          tickMargin={16}
          tickFormatter={(tick) => moneySymbol + toK(tick)}
          tickLine={false}
          orientation="right"
          interval="preserveEnd"
          minTickGap={80}
          yAxisId={0}
          tick={{ fill: textColor }}
        />
        {hallmarks.map((hallmark, i) => (
          <ReferenceLine x={hallmark[0]} stroke="red" label={hallmark[1]} key={'hall2' + i} />
        ))}
        <Tooltip
          cursor={{ fill: color, opacity: 0.1 }}
          formatter={(val) => formattedNum(val, true)}
          labelFormatter={(label) => toNiceDateYear(label)}
          labelStyle={{ paddingTop: 4 }}
          contentStyle={{
            padding: '10px 14px',
            borderRadius: 10,
            borderColor: color,
            color: 'black',
          }}
          wrapperStyle={{ top: -70, left: -10 }}
        />
        {tokenBreakdown ? (
          tokensUnique.map((token) => (
            <Bar
              key={token}
              type="monotone"
              dataKey={token}
              fill={stringToColour(token)}
              opacity={'0.8'}
              yAxisId={0}
              stackId="stack"
            />
          ))
        ) : (
          <Bar
            type="monotone"
            name={'Inflow/Outflow'}
            dataKey={'1'}
            fill={color}
            opacity={'0.8'}
            yAxisId={0}
            stroke={color}
          />
        )}
      </BarChart>
    </ResponsiveContainer>
  )
})

export default GeneralBarChart
