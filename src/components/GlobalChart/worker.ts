import dayjs from 'dayjs'
import { createChart } from 'lightweight-charts'
import { formattedNum } from 'utils'

export function buildChart({
  ref,
  data,
  base,
  baseChange,
  title,
  field,
  width,
  type,
  units,
  useWeekly = false,
  existingChart,
}) {
  if (existingChart) {
    existingChart.remove()
  }

  const formattedData = data.map((entry) => {
    return {
      time: dayjs.unix(entry[0]).utc().format('YYYY-MM-DD'),
      value: parseFloat(entry[field]),
    }
  })

  const textColor = 'white'
  const crossHairColor = 'rgba(255, 255, 255, 0.1)'

  const chartParams = {
    width: width,
    height: 300,
    layout: {
      backgroundColor: 'transparent',
      textColor: textColor,
    },
    rightPriceScale: {
      scaleMargins: {
        top: 0.32,
        bottom: 0,
      },
      borderVisible: false,
    },
    timeScale: {
      borderVisible: false,
    },
    grid: {
      horzLines: {
        color: 'rgba(197, 203, 206, 0.5)',
        visible: false,
      },
      vertLines: {
        color: 'rgba(197, 203, 206, 0.5)',
        visible: false,
      },
    },
    crosshair: {
      horzLine: {
        visible: false,
        labelVisible: false,
      },
      vertLine: {
        visible: true,
        style: 0,
        width: 2,
        color: crossHairColor,
        labelVisible: false,
      },
    },
    localization: {
      priceFormatter: (val) => formattedNum(val, units),
    },
  }

  const chart = createChart(ref.current, chartParams)

  const series = chart.addAreaSeries({
    topColor: '#394990',
    bottomColor: 'rgba(112, 82, 64, 0)',
    lineColor: '#394990',
    lineWidth: 3,
  })

  series.setData(formattedData)

  const prevTooltip = document.getElementById('tooltip-id' + type)
  const node = document.getElementById('test-id' + type)

  if (prevTooltip && node) {
    node.removeChild(prevTooltip)
  }

  const toolTip = document.createElement('div')
  toolTip.setAttribute('id', 'tooltip-id' + type)
  toolTip.className = 'three-line-legend-dark'

  ref.current.appendChild(toolTip)

  toolTip.style.display = 'block'
  toolTip.style.fontWeight = '500'
  toolTip.style.left = -4 + 'px'
  toolTip.style.top = '-' + 8 + 'px'
  toolTip.style.backgroundColor = 'transparent'

  // format numbers
  let percentChange = baseChange?.toFixed(2)
  let formattedPercentChange = (percentChange > 0 ? '+' : '') + percentChange + '%'
  let color = percentChange >= 0 ? 'green' : 'red'

  // get the title of the chart
  function setLastBarText() {
    toolTip.innerHTML =
      `<div style="font-size: 16px; margin: 4px 0px; color: ${textColor};">${title}</div>` +
      `<div style="font-size: 22px; margin: 4px 0px; color:${textColor}" >` +
      formattedNum(base ?? 0, units) +
      (baseChange
        ? `<span style="margin-left: 10px; font-size: 16px; color: ${color};">${formattedPercentChange}</span>`
        : '') +
      '</div>'
  }

  setLastBarText()

  // update the title when hovering on the chart
  chart.subscribeCrosshairMove(function (param) {
    if (
      param === undefined ||
      param.time === undefined ||
      param.point.x < 0 ||
      param.point.x > width ||
      param.point.y < 0 ||
      param.point.y > 300
    ) {
      setLastBarText()
    } else {
      let dateStr = useWeekly
        ? dayjs(param.time.year + '-' + param.time.month + '-' + param.time.day)
            .startOf('week')
            .format('MMMM D, YYYY') +
          '-' +
          dayjs(param.time.year + '-' + param.time.month + '-' + param.time.day)
            .endOf('week')
            .format('MMMM D, YYYY')
        : dayjs(param.time.year + '-' + param.time.month + '-' + param.time.day).format('MMMM D, YYYY')

      const price = param.seriesPrices.get(series)

      toolTip.innerHTML =
        `<div style="font-size: 16px; margin: 4px 0px; color: ${textColor};">${title}</div>` +
        `<div style="font-size: 22px; margin: 4px 0px; color: ${textColor}">` +
        formattedNum(price, units) +
        '</div>' +
        '<div>' +
        dateStr +
        '</div>'
    }
  })

  chart.timeScale().fitContent()

  return chart
}
