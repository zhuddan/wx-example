import { App, Picture, Shape, Text } from '../../utils/canvas/dist/index'

Page({
  onLoad() {
    const { pixelRatio, windowHeight: height, windowWidth: width } = wx.getWindowInfo()
    const app = new App({
      dpr: pixelRatio,
      canvas: '#myCanvas',
      width,
      height,
    })
    new Picture('./cat.jpg', {
      size: {
        x: 200,
        y: 200 * (2 / 3),
      },
      objectFit: 'cover',
      y: 300,
    }).addTo(app)

    new Text({
      text: 'cute cat',
      y: 300,
      style: {
        fill: '#ccc',
        fontSize: 35,
      },
    }).addTo(app)

    new Picture('./cat.jpg', {
      size: {
        x: 200,
        y: 200,
      },
      objectFit: 'cover',
      y: 520,
    }).addTo(app)

    new Text({
      text: 'cover cat',
      y: 520,
      style: {
        fill: '#fff',
        fontSize: 35,
      },
    }).addTo(app)

    new Picture('./cat.jpg', {
      size: {
        x: 200,
        y: 200,
      },
      objectFit: 'contain',
      x: width / 2,
      y: 300,
    }).addTo(app)
    new Text({
      text: 'contain cat',
      x: width / 2,
      y: 300,
      style: {
        fill: '#fff',
        fontSize: 35,
      },
    }).addTo(app)

    new Picture('./cat.jpg', {
      size: {
        x: 200,
        y: 200,
      },
      x: width / 2,
      y: 520,
      rounded: 20,
    }).addTo(app)

    new Text({
      text: 'rounded cat',
      x: width / 2,
      y: 520,
      style: {
        fill: '#fff',
        fontSize: 35,
      },
    }).addTo(app)

    const text1 = new Text({
      text: 'hello world',
      style: {
        fontSize: 70,
        fill: '#ffff',
      },
      anchor: 0.5,
      x: width / 2,
      y: height / 2 + 200,
    })
    const text1ScaleX = new RangeObserver(text1.scale, 'x', -1, 1, 0.005, 1, true)
    const text1ScaleY = new RangeObserver(text1.scale, 'y', -1, 1, 0.005, -1, true)
    const shape1 = new Shape({
      x: 200,
      y: 120,
      anchor: 0.5,
      alpha: 0.5,
    })
    shape1.beginPath().roundRect(0, 0, 200, 200, 40).fill('pink')
    function createLine() {
      return new Shape({
        x: 200,
        y: 120,
        anchor: { x: 0, y: 0.5 },
      })
    }
    const hourLine = createLine()
    const minLine = createLine()
    const secLine = createLine()
    hourLine.beginPath().roundRect(0, 0, 50, 10, 100).fill('#E85C0D')
    minLine.beginPath().roundRect(0, 0, 80, 4, 100).fill('#0D7C66')
    secLine.beginPath().roundRect(0, 0, 100, 2, 100).fill('#3A1078')
    const shape2 = new Shape({
      x: 200,
      y: 120,
      anchor: 0.5,
      alpha: 0.1,
    })
    shape2.beginPath().lineTo(width / 2, width / 4).lineTo(0, width / 2).fill('#FABC3F')
    const car = new Picture('./car.png', {
      anchor: 0.5,
      x: 100,
      y: 100,
    })
    app.add(text1, shape1, shape2, car)
    let i = 12
    while (i--) {
      const dot = new Shape({
        x: 200 + Math.cos(Math.PI * 2 / 12 * i) * 100,
        y: 120 + Math.sin(Math.PI * 2 / 12 * i) * 100,
        anchor: 0.1,
      })
      dot.beginPath().arc(0, 0, i % 3 === 0 ? 6 : 4).fill('#fff')
      app.add(dot)
    }

    app.add(hourLine, minLine, secLine)
    new Shape({
      x: 200,
      y: 120,
      anchor: 0.5,
    }).addTo(app).beginPath().arc(0, 0, 10).fill('red')
    let direction: 'x' | 'y' = 'x'
    const shape2Alpha = new RangeObserver(shape2, 'alpha', 0, 1, 0.001, 1, true)
    const shape2SkewX = new RangeObserver(shape2.skew, 'x', -1, 1, 0.01, 1, true)
    const shape2SkewY = new RangeObserver(shape2.skew, 'y', -1, 1, 0.01, 1, true)
    app.ticker.add(() => {
      const {
        hourAngleInRadians,
        minuteAngleInRadians,
        secondAngleInRadians,
      } = calculateClockAnglesInRadians()
      hourLine.rotation = hourAngleInRadians
      minLine.rotation = minuteAngleInRadians
      secLine.rotation = secondAngleInRadians
      shape1.rotation -= 0.01
      text1.rotation += 0.001

      if (direction === 'x' && car.x >= app.width + car.width / 2) {
        direction = 'y'
        car.x = 100
        car.rotation = Math.PI / 2
      }
      if (direction === 'y' && car.y >= app.height + car.height / 2) {
        direction = 'x'
        car.y = 100
        car.rotation = 0
      }
      car[direction] += 1.5

      shape2.rotation += 0.01
      text1ScaleX.next()
      text1ScaleY.next()
      shape2Alpha.next()
      shape2SkewX.next()
      shape2SkewY.next()
    })
  },
})

class RangeObserver<T extends Record<string, any>, K extends keyof T> {
  constructor(
    public obj: T,
    public key: K & { [P in K]: T[P] extends number ? P : never }[K],
    private min: number,
    private max: number,
    private step: number,
    private direction = 1,
    private alternate = false,
  ) { }

  next() {
    let _next = this.obj[this.key] + this.direction * this.step
    if (!this.alternate) {
      if (_next > this.max) {
        _next = this.min
      }
      else if (_next < this.min) {
        _next = this.max
      }
    }
    else {
      if (_next > this.max || _next < this.min) {
        this.direction *= -1
      }
      _next = this.obj[this.key] + this.direction * this.step
    }
    ;(this.obj[this.key] as number) = _next
  }
}

function calculateClockAnglesInRadians() {
  // 获取当前时间
  const now = new Date()
  const hours = now.getHours()
  const minutes = now.getMinutes()
  const seconds = now.getSeconds()

  // 计算秒针的弧度
  const secondAngleInDegrees = seconds * 6 // 6度/秒
  const secondAngleInRadians = secondAngleInDegrees * (Math.PI / 180)

  // 计算分针的弧度
  const minuteAngleInDegrees = minutes * 6 + seconds * 0.1 // 6度/分 + 0.1度/秒
  const minuteAngleInRadians = minuteAngleInDegrees * (Math.PI / 180)

  // 计算时针的弧度
  const hourAngleInDegrees = (hours % 12) * 30 + minutes * 0.5 // 30度/小时 + 0.5度/分
  const hourAngleInRadians = hourAngleInDegrees * (Math.PI / 180)

  return {
    hourAngleInRadians: hourAngleInRadians - Math.PI / 2,
    minuteAngleInRadians: minuteAngleInRadians - Math.PI / 2,
    secondAngleInRadians: secondAngleInRadians - Math.PI / 2,
  }
}
