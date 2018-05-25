import './RecentUpdate.less'
import {Flex, Picker, List, Toast} from 'antd-mobile'

class selAge extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            minAge: props.minAge,
            maxAge: props.maxAge,
        }
    }

    // setState
    handleState(v,state) {
        // let {minAge, maxAge} = this.state

        this.setState({
            [state]: v
        })
        // if (state === 'minAge' && maxAge === '') {
        //     this.setState({
        //         maxAge: today
        //     })
        // }
        // if (state === 'maxAge' && minAge === '') {
        //     this.setState({
        //         minAge: v
        //     })
        // }
    }

    // 取消
    onCancel() {
        this.props.onCancel()
    }

    // 清空
    onClear() {
        // this.props.onClear('', '')
        this.setState({
            minAge: 0,
            maxAge: ''
        })
    }

    // 确认
    onOk() {
        let {minAge,maxAge} = this.state

        this.props.onOk(minAge,maxAge)
    }

    render() {
        let {minAge,maxAge} = this.state

        const minAgeArr = [...Array(200).keys()].map(list => ({
            label: list, value: list
        }))
        const maxAgeArr = [...Array(200-minAge).keys()].map(list => ({
            label: list+(minAge>>0), value: list+(minAge>>0)
        }))

        minAge = [].concat(minAge)
        return (
            <div id="RecentUpdate">
                <Flex className="tip">
                    请选择学员的年龄区间
                </Flex>
                <Picker
                    title="最小年龄"
                    extra="请选择最小年龄"
                    cols={1}
                    data={[...minAgeArr]}
                    value={minAge}
                    onChange={v => this.handleState(v,'minAge')}
                >
                    <List.Item>最小年龄</List.Item>
                </Picker>

                <Picker
                    title="最大年龄"
                    extra="请选择最大年龄"
                    cols={1}
                    data={[...maxAgeArr]}
                    value={maxAge}
                    onChange={v => this.handleState(v,'maxAge')}
                >
                    <List.Item>最大年龄</List.Item>
                </Picker>


                <Flex className="btns">
                    <div className="clear" onClick={() => this.onClear() }>清空年龄</div>
                    <div className="cancel" onClick={() => this.onCancel() }>取消</div>
                    <div className="ok" onClick={() => this.onOk() }>确认</div>
                </Flex>
            </div>
        )
    }
}

export default selAge;