import {Flex, Drawer, Icon, Popup, Toast} from 'antd-mobile'
import './DateSwitch.less'


const FlexItem = Flex.Item
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

const nowDate = new Date().Format('yyyy-MM-dd')
const nowMonth = new Date().Format('yyyy-MM')
const weeks = '日一二三四五六'
const Months = ['一','二','三','四','五','六','七','八','九','十','十一','十二']
const getWeek = (date) => {
    const weeks = ['日','一','二','三','四','五','六']
    return `周${weeks[date.getDay()]}`
}
const days = (yearMonth) => {
    yearMonth = yearMonth || nowMonth

    const [year, month] = yearMonth.split('-')
    const nowMonthDays = new Date(year,month,0).getDate()
    const nowMonthFirstWeek = new Date(year,month-1,1).getDay()
    const days = [...Array(nowMonthDays).keys()].map(i => (i + 1 < 10 ? `${yearMonth}-0${i + 1}` : `${yearMonth}-${i + 1}`))
    days.unshift(...[...Array(nowMonthFirstWeek).keys()].map(i => `${yearMonth}-00`))

    let daysArr = []
    const dayChiLen = days.length % 7 > 0 ? (days.length / 7 >> 0) + 1 : days.length / 7 >> 0
    for (let i = 0, len = dayChiLen; i < len; i++) {
        let childArr = []
        for (let j = 0; j < 7; j++) {
            const data = days[7 * i + j]
            if (data)
                childArr.push(data)
            else
                childArr.push('')
        }
        daysArr.push(childArr)
    }

    return daysArr
}


class SelCalendar extends React.Component {

    constructor(props) {
        super(props)
        const [year,month] = props.date.split('-')
        const yearMonth = new Date(year,month-1).Format('yyyy-MM')

        this.state = {
            date: props.date,
            yearMonth,
            days: days(yearMonth)
        }
    }

    // 子组件订阅父组件props ?（钩子函数）
    componentWillReceiveProps(nextProps) {
        const {date} = nextProps
        const [yearMonth] = date.match(/\d{4}-\d{2}/)
        this.setState({
            date,
            yearMonth,
            days: days(yearMonth)
        })

    }


    selDate(date) {
        const {minDate} = this.props
        if (date < minDate || date.slice(8,10) === '00') return;

        this.setState({
            date
        })

        this.props.onClick(date)
    }

    monthChange(bl) {
        const {minDate} = this.props
        const {yearMonth} = this.state
        const [year,month] = yearMonth.split('-')
        const _minDate = minDate&&minDate.slice(0,minDate.length-3)
        if (_minDate === yearMonth && bl === -1) return;

        const changeMonth = new Date(year>>0,(month>>0)+bl,0).Format('yyyy-MM')

        this.setState({
            yearMonth: changeMonth,
            days: days(changeMonth)
        })
    }

    render() {
        const {date,days,yearMonth} = this.state
        const [year] = yearMonth.split('-')
        const monthText = Months[yearMonth.split('-')[1]-1>>0]
        const {minDate} = this.props
        const isMinMount = minDate && minDate.slice(0,minDate.length - 3) === yearMonth

        return (
            <div className={`calendar-content`}>
                <Flex className="title">
                    <Icon type="left" size="md" onClick={() => this.monthChange(-1)} className={isMinMount?'disabled':''} />
                    <Flex className="date">
                        <label>{monthText}月</label>
                        <span>{year}</span>
                    </Flex>
                    <Icon type="right" size="md" onClick={() => this.monthChange(1)} />
                </Flex>
                <div className="body">
                    <Flex className="weeks">
                        {weeks.split('').map((item, index) => (
                            <span key={index}>周{item}</span>
                        ))}
                    </Flex>
                    <div className="days">
                        {days.map((i,index) => (
                            <Flex key={index} className="day-box">
                                {i.map((ci, cindex) => {
                                    return <span className={`${ci.split('-')[2]==='00'?'empty-day':''} ${ci===nowDate?'today':''} ${ci===date?'active':''} ${ci<this.props.minDate?'disabled':''}`}
                                          onClick={() => this.selDate(ci)}
                                          key={cindex} >

                                        {ci.split('-')[2]}
                                    </span>
                                })}
                            </Flex>
                        ))}
                    </div>
                </div>
            </div>
        )
    }
}

class DateSwitch extends React.Component {

    constructor(props) {
        super(props)

        let appointmentDate = new Date().Format('yyyy-MM-dd')
        if (props.appointmentDate) {
            appointmentDate = new Date(props.appointmentDate).Format('yyyy-MM-dd')
        }
        this.state = {
            appointmentDate,
            titleDate: [],
            open: false
        }
    }

    // 初始页面set-Date
    componentWillMount() {
        if (this.props.startIndex || this.props.startIndex === 0)
            this.changeTitleDate(this.props.startIndex)
        else
            this.changeTitleDate()
    }

    // 改变头部时间
    changeTitleDate(type=-2) {
        let titleDate = []
        const {appointmentDate} = this.state
        const [year,month,day] = appointmentDate.split('-')
        const appointmentDateTime = new Date(year,month-1,day).getTime()
        let startIndex = 0
        let endIndex = 0

        switch (type) {
            case -2:
                startIndex = -2;endIndex = 2;
                break;
            case 0:
                startIndex = -3; endIndex = 1;
                break;
            case 4:
                startIndex = -1; endIndex = 3;
                break;
            case 'default' :
                startIndex = 0; endIndex = 4;
                break;
            default:
                if (this.props.headChange)
                    this.props.onClick(appointmentDate)
                return;
        }


        const returnList = []
        for (let i = startIndex; i <= endIndex; i++) {
            const time = new Date(appointmentDateTime+i*86400000)
            const date = time.Format('yyyy-MM-dd')

            titleDate.push({
                week: getWeek(time),
                date
            })
            returnList.push(date)
        }


        this.setState({
            titleDate
        }, () => {
            this.props.onClick(appointmentDate,titleDate,returnList )
        })
    }

    // 切换日期
    handleDateClick(date, index) {
        const { minDate } = this.props

        if (minDate === date) {
            return;
        }

        if (date < minDate && minDate) {
            Toast.info(`试听时间不能早于当天`, 1.5, null, false)
            return;
        }
        this.setState({
            appointmentDate: date
        }, () => {
            this.changeTitleDate(index)
        })
    }


    // 日历选择日期
    onOpenChange(...args) {
        this.setState({ open: !this.state.open })
        const appointmentDate = this.state.appointmentDate
        // Popup.show(<Drawer
        //     className={`sel-calendar ${true?'open':''}`}
        //     position="top"
        //     enableDragHandle
        //     contentStyle={{ color: '#A6A6A6', textAlign: 'center', paddingTop: 42 }}
        //     sidebar={<SelCalendar onClick={this.changeMonth.bind(this)} minDate={this.props.minDate} date={appointmentDate} />}
        //     open={true}
        //     onOpenChange={this.onOpenChange.bind(this)}
        // >
        //     <span></span>
        // </Drawer>, {maskTransitionName: 0})
        Popup.show(
            <SelCalendar onClick={this.changeMonth.bind(this)} minDate={this.props.minDate} date={appointmentDate} />
        )
    }

    // 选择日历
    changeMonth(appointmentDate) {
        const {minDate} = this.props
        if (appointmentDate < minDate) return;

        Popup.hide()
        this.setState({
            open: !this.state.open,
            appointmentDate
        }, this.changeTitleDate)
    }


    render() {
        const {minDate} = this.props
        const {titleDate,appointmentDate} = this.state
        return (
            <div className={`DateSwitch ${this.props.className}`} >
                {/* 切换日期 */}
                <Flex>
                    {this.props.order && <div className="rili-box"><div className="rili" onClick={this.onOpenChange.bind(this)}>{appointmentDate.split('-')[1]>>0}月</div></div>}
                    {this.props.order && <Flex className={'list-box'}>
                        {titleDate.map(({week,date}, index) => (
                            <FlexItem className={`list ${appointmentDate===date?'active':''} ${date<minDate?'disabled':''}`}
                                      key={index}
                                      onClick={() => this.handleDateClick(date, index)} >

                                {/*<label>{week}</label>*/}
                                <span>{date.substr(5,8)}</span>
                            </FlexItem>
                        )) }
                    </Flex>}

                    {/* ------- */}
                    {!this.props.order && titleDate.map(({week,date}, index) => (
                        <FlexItem className={`list ${appointmentDate===date?'active':''} ${date<minDate?'disabled':''}`}
                             key={index}
                             onClick={() => this.handleDateClick(date, index)} >

                            <label>{week}</label>
                            <span>{date.split('-')[2]}</span>
                        </FlexItem>
                    )) }
                    {!this.props.order && <div className="rili" onClick={this.onOpenChange.bind(this)}>{appointmentDate.split('-')[1]>>0}月</div>}
                </Flex>
                {/* 日期选择抽屉 */}

            </div>
        )
    }
}

DateSwitch.defaultProps = {
    startIndex: 'default'
}


export default DateSwitch;