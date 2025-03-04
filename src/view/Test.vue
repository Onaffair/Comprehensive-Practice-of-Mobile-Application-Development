<template>
    <div class="oscilloscope">
        <v-chart
            class="chart"
            :option="chartOption"
            :autoresize="true"
            @legendselectchanged="handleLegendSelect"
        />
    </div>
    <button @click="toggleChannel('Channel 1')">Toggle Channel 1</button>
    <button @click="toggleChannel('Channel 2')">Toggle Channel 2</button>
    <button @click="toggleChannel('Channel 3')">Toggle Channel 3</button>
</template>

<script setup>
import { ref, reactive, onUnmounted } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import {
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent,
} from 'echarts/components'
import VChart from 'vue-echarts'

// ECharts组件注册
use([
    CanvasRenderer,
    LineChart,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent,
])

// 组合函数：通道管理
const useChannels = () => {
    const channels = reactive([
        {
            name: "Channel 1",
            color: "#c23531",
            amplitude: 1,
            data: [],
            show: true,
            frequency: 0.5,
        },
        {
            name: "Channel 2",
            color: "#2f4554",
            amplitude: 2,
            data: [],
            show: true,
            frequency: 0.8,
        },
        {
            name: "Channel 3",
            color: "#61a0a8",
            amplitude: 1.5,
            data: [],
            show: true,
            frequency: 1.2,
        },
    ])

    // 初始化通道数据
    const initChannelData = () => {
        const now = Date.now()
        channels.forEach(channel => {
            channel.data = Array.from({ length: 50 }, (_, i) => {
                const time = now - 10000 + i * 200
                const value = channel.amplitude * Math.sin(time * 0.002 * Math.PI * channel.frequency)
                return [time, value]
            })
        })
    }

    return { channels, initChannelData }
}
const toggleChannel = (channelName) => {
    const channel = channels.find(ch => ch.name === channelName)
    if (channel) {
        channel.show = !channel.show
        if (channel.show && channel.data.length === 0) {
            const now = Date.now()
            for (let i = -10000; i <= 0; i += 200) {
                const time = now + i
                const value = channel.amplitude * Math.sin(time * 0.002 * Math.PI * channel.frequency)
                channel.data.push([time, value])
            }
        }
        updateChartOption()
    }
}
// 组合函数：图表配置
const useChartOption = (channels) => {
    const chartOption = ref({
        title: { text: '多通道示波器' },
        tooltip: {
            trigger: 'axis',
            axisPointer: { animation: false }
        },
        legend: { data: channels.map(ch => ch.name) },
        xAxis: {
            type: 'time',
            splitLine: { show: false },
            min: Date.now() - 10000,
            max: Date.now()
        },
        yAxis: {
            type: 'value',
            splitLine: { show: false }
        },
        series: channels.map(channel => ({
            name: channel.name,
            type: 'line',
            data: channel.data,
            showSymbol: false,
            smooth: true,
            lineStyle: { color: channel.color },
            itemStyle: { color: channel.color },
            animation: false
        }))
    })

    const updateChartOption = () => {
        const now = Date.now()
        chartOption.value = {
            ...chartOption.value,
            xAxis: {
                ...chartOption.value.xAxis,
                min: now - 10000,
                max: now
            },
            series: channels.map(channel => ({
                ...chartOption.value.series.find(s => s.name === channel.name),
                data: channel.data
            }))
        }
    }

    return { chartOption, updateChartOption }
}

// 组合函数：数据生成
const useDataGenerator = (channels, updateChart) => {
    let timer = null

    const generateData = () => {
        const now = Date.now()
        channels.forEach(channel => {
            if (!channel.show) return

            // 移除旧数据
            const cutoff = now - 10000
            while (channel.data.length > 0 && channel.data[0][0] < cutoff) {
                channel.data.shift()
            }

            // 添加新数据
            const value = channel.amplitude * Math.sin(now * 0.002 * Math.PI * channel.frequency)
            channel.data.push([now, value])
        })

        updateChart()
    }

    const startGenerating = () => {
        timer = setInterval(generateData, 200)
    }

    onUnmounted(() => {
        clearInterval(timer)
    })

    return { startGenerating }
}

// 组合函数：图例处理
const useLegendHandler = (channels, updateChart) => {
    const handleLegendSelect = (params) => {
        const channel = channels.find(ch => ch.name === params.name)
        if (channel) {
            channel.show = params.selected[params.name]

            // 初始化隐藏通道的数据
            if (channel.show && channel.data.length === 0) {
                const now = Date.now()
                for (let i = -10000; i <= 0; i += 200) {
                    const time = now + i
                    const value = channel.amplitude * Math.sin(time * 0.002 * Math.PI * channel.frequency)
                    channel.data.push([time, value])
                }
            }

            updateChart()
        }
    }

    return { handleLegendSelect }
}

// 组合逻辑
const { channels, initChannelData } = useChannels()
const { chartOption, updateChartOption } = useChartOption(channels)
const { startGenerating } = useDataGenerator(channels, updateChartOption)
const { handleLegendSelect } = useLegendHandler(channels, updateChartOption)

// 初始化
initChannelData()
startGenerating()
</script>

<style scoped>
.oscilloscope {
    width: 100%;
    height: 600px;
}
.chart {
    width: 100%;
    height: 100%;
}
</style>