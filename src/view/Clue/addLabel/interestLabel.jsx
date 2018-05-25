import {Flex, Button, Modal, TextareaItem, Toast} from 'antd-mobile'
import './addLabel.less'

const Http = Base
const {api:URL} = Http.url
const FlexItem = Flex.Item
const alert = Modal.alert
class interestLabel extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            coursesLabels: props.data,
            interestLabels: props.value,
        }
    }

    componentWillMount() {
        // const params = {method: 'POST'}
        //
        // Http.ajax(`${URL}/selections/chinese-courses`,params).then(res => {
        //     const coursesLabels = res.data.courses.map(({id,text:name})=>({id,name}))
        //     this.setState({
        //         coursesLabels
        //     })
        // })

    }

    componentWillReceiveProps() {
        this.setState({
            interestLabels: this.props.value.concat()
        })
    }

    // 隐藏
    interestHide() {

        this.props.onClose()

    }

    // 点击确认
    interestConfirm() {

        this.props.onConfirm(this.state.interestLabels)

    }

    labelClick(Labels, id) {


        this.setState((prev) => {
            const index = prev[Labels].indexOf(id)
            if (index < 0) {
                if (this.state.interestLabels.length >= 5) {
                    Toast.info(`选择感兴趣的已达上限`, 1.5, null, false)
                    return;
                }
                prev[Labels].push(id)
            }
            else
                prev[Labels].splice(index, 1)

            return {
                [Labels]: prev[Labels]
            }
        })
    }


    render() {
        const {editor, interestLabels} = this.state
        const {visible} = this.props
        return (
            <div>
                {
                    visible ? <div id="interestLabel" className={visible?'show':''} style={{height: document.body.offsetHeight * .9}}>
                        <div className="interest">
                            {/* 标签 */}
                            <div className="label-box label-family">
                                <Flex className="labels">
                                    {this.props.data.map(({label,value}, index) => (
                                        <Button key={index}
                                                className={`btn ${interestLabels.indexOf(value)>-1?'active':''} ${editor?'icon-del':''}`}
                                                onClick={() => this.labelClick('interestLabels', value)}>
                                            {label}
                                        </Button>
                                    ))}
                                </Flex>
                            </div>



                        </div>
                            {/* 保存 */}
                            <Flex className="fixed-btn">
                                <Button className="cancel-btn btn" onClick={this.interestHide.bind(this)}>取消</Button>
                                <Button className="confirm-btn btn" onClick={() => this.interestConfirm()}>保存</Button>
                            </Flex>

                    </div>
                        : ''
                }
            </div>
        )
    }
}

export default interestLabel;