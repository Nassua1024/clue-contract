import './RecentUpdate.less'
import {Flex, DatePicker, List, Toast} from 'antd-mobile'
import moment from 'moment'

const toMoment = (date) => ( date && moment(date, 'YYYY-MM-DD Z') || '' )
const minDate = new Date(1990, 0).Format('yyyy-MM-dd')
const today = new Date().Format('yyyy-MM-dd')
class RecentUpdate extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            startTime: props.startTime,
            endTime: props.endTime,

            endTimeDisabled: true
        }
    }

    // setState
    handleState(v,state) {

        let {startTime, endTime} = this.state

        this.setState({
            [state]: v && v.format('YYYY-MM-DD') || ''
        })

        if (state === 'startTime' && endTime === '') {
            this.setState({
                endTime: today
            })
        }
        if (state === 'endTime' && startTime === '') {
            this.setState({
                startTime: v && v.format('YYYY-MM-DD') || ''
            })
        }
    }

    // 取消
    onCancel() {
        this.props.onCancel()
    }

    // 清空
    onClear() {
        // this.props.onClear('', '')
        this.setState({
            startTime: '',
            endTime: ''
        })
    }

    // 确认
    onOk() {
        const {startTime,endTime} = this.state
        console.log(startTime, endTime);
        this.props.onOk(
            startTime,
            endTime
        )
    }

    render() {
        let {startTime,endTime} = this.state

        return (
            <div id="RecentUpdate">
                <Flex className="tip">
                    请选择最新跟进线索的起止时间
                </Flex>

                <DatePicker
                    mode="date"
                    title="选择日期"
                    extra="请选择开始时间"
                    value={toMoment(startTime)}
                    onChange={v => this.handleState(v,'startTime')}
                    minDate={toMoment(minDate)}
                >
                    <List.Item>开始时间:</List.Item>
                </DatePicker>
                <DatePicker
                    mode="date"
                    title="选择日期"
                    extra="请选择结束时间"
                    value={toMoment(endTime)}
                    onChange={v => this.handleState(v,'endTime')}
                    minDate={toMoment(startTime)}
                >
                    <List.Item>到:</List.Item>
                </DatePicker>

                <Flex className="btns">
                    <div className="clear" onClick={() => this.onClear() }>清空时间</div>
                    <div className="cancel" onClick={() => this.onCancel() }>取消</div>
                    <div className="ok" onClick={() => this.onOk() }>确认</div>
                </Flex>
            </div>
        )
    }
}

export default RecentUpdate;