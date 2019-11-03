// https://medium.com/welldone-software/d3-and-react-working-together-353d12c2a3bc
import * as React from 'react'
import * as d3 from 'd3'

const PADDING = 10
const HOURS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII']
const BG_COLOR = '#e00'
// const BG_COLOR = '#123'
const COLOR = '#fff'

class ClockControl extends React.Component<{ size: number, time: number }, {}> {
	svg: d3.Selection<SVGSVGElement, unknown, null, undefined>

	constructor(props: any) {
		super(props)
	}

	componentDidMount() {
		this.drawFrame()
		this.drawMarks()
		this.drawHands()
		this.drawDigits()
		this.updateTime()
	}

	drawFrame() {
		const center = this.props.size / 2
		const radius = center - PADDING

		this.svg.append('circle')
				.attr('cx', center)
				.attr('cy', center)
				.attr('r', radius + 2)
				.style('stroke', COLOR)
				.style('fill', 'none')

		this.svg.append('circle')
				.attr('cx', center)
				.attr('cy', center)
				.attr('r', radius)
				.style('stroke', COLOR)
				.style('fill', BG_COLOR)

		this.svg.append('circle')
				.attr('cx', center)
				.attr('cy', center)
				.attr('r', radius / 15)
				.style('fill', COLOR)
	}

	drawDigits() {
		const center = this.props.size / 2
		const radius = center - PADDING

		const fontSize = `${Math.floor(radius / 8)}px`
		const drawHourDigit = (v: string, i: number) => {
			const transformG = `rotate(${(i+1) * 30},${center},${center})`
			const transformT = `scale(1,3) translate(${center}, ${center - radius * 0.96})`
			const g = this.svg.append('g')
					.attr('transform', transformG)
			g.append('text').text(v)
					.attr('text-anchor', 'middle')
					.attr('transform', transformT)
					.style('fill', COLOR)
					.style('font-size', fontSize)
		}
		HOURS.forEach(drawHourDigit)
	}

	drawMarks() {
		const center = this.props.size / 2
		const radius = center - PADDING
		const y1 = center - Math.floor(radius * 0.97)
		const y2 = center - Math.floor(radius * 0.90)
		for(let mark = 0; mark < 60; mark++) {
			const transform = `rotate(${mark * 6},${center},${center})`
		const isHourMark = (mark % 5) === 0
		this.svg.append('line')
				.attr('x1', center)
				.attr('y1', y1)
				.attr('x2', center)
				.attr('y2', y2)
				.attr('transform', transform)
				.style('stroke', COLOR)
		.style('stroke-width', isHourMark ?  3 : 1)
	}
	}

	drawHands() {
		const center = this.props.size / 2
		const radius = center - PADDING
		this.drawHand('H', 5, radius * 0.5)
		this.drawHand('M', 3, radius * 0.7)
		this.drawHand('S', 2, radius * 0.9)
	}

	drawHand(type: string, width: number, length: number) {
		const center = this.props.size / 2
		this.svg.append('line')
				.attr('hand-type', type)
				.attr('x1', center)
				.attr('y1', center)
				.attr('x2', center)
				.attr('y2', center - length)
				.style('stroke', COLOR)
				.style('stroke-width', width)
	}

	moveHand(type: string, angle: number) {
		const center = this.props.size / 2
		const transform = `rotate(${angle},${center},${center})`
		this.svg.select(`line[hand-type='${type}']`)
				.attr('transform', transform)
	}

	componentDidUpdate() {
		this.updateTime()
		this.svg.select("circle + circle").style('fill', BG_COLOR);
	}

	updateTime() {
		const dt = new Date(this.props.time)
		const hourAngle = dt.getHours() * 30 +
				Math.floor(dt.getMinutes() / 12) * 6
		this.moveHand('H', hourAngle)
		this.moveHand('M', dt.getMinutes() * 6) // , 3?
		this.moveHand('S', dt.getSeconds() * 6)
	}

	render() {
		return (
			<svg width={this.props.size} height={this.props.size}
				ref={handle => (this.svg = d3.select(handle))}>
			</svg>
		)
	}
}

class ClockApp extends React.Component<{}, { time: number }> {
	tzOffset: number
	interval: number

	constructor(props: any) {
		super(props)
		this.tzOffset = (new Date()).getTimezoneOffset()

		this.state = {time: this.getUTC()}
	}

	getUTC() {
		return Date.now() + this.tzOffset * 60 * 1000
	}


	componentDidMount() {
		this.interval = setInterval(() => {
			this.setState({time: this.getUTC()})
		}, 1000)
	}

	componentWillUnmount() {
		clearInterval(this.interval)
	}

	render() {
		const places: Record<string, number> = {'JERUSALEM': 180, 'ROME': 120, 'LONDON': 60,
		'NEW YORK': -240, 'SAN FRANCISCO': -420, 'TOKYO': 540};

		const localTime = (tzDelta: number) => this.state.time + tzDelta * 60 * 1000
		return (
			<div>
			{
				Object.keys(places).map((k,i) => (
					<div className='container' style={{left: 40 + (i%3) * 220, top: Math.floor(i / 3) * 200 + 5}}>
						<ClockControl size={170} time={localTime(places[k])}/>
						<span>{k}</span>
					</div>
				))
			}
			</div>
		)
	}
}

export default ClockApp
