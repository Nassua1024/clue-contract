import {Flex, Button, Modal, TextareaItem, Toast} from 'antd-mobile'
import './addLabel.less'
import * as action from '../../../redux/action/action'

const { connect } = ReactRedux
const Http = Base
const {api:URL} = Http.url
const FlexItem = Flex.Item
const alert = Modal.alert


class clientLabel extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            //
            editor: false,
            // 选中的标签
            familyLabels: [],             //家庭背景
            econoLabels: [],              //经济实力
            studyLabels: [],              //学习情况
            otherLabels: [],              //其他
            // 请求到的所有标签
            ECONOMIC_POWER: [],           //经济实力
            FAMILY_BACKGROUND: [],        //家庭背景
            OTHER: [],                    //其他
            STUDY_SITUATION: [],          //学习情况
            //
            modal: false,
            addLabelType: '',
            addLabelName: '',
            customerLabels:props.customerLabels, //选中的标签
            id:this.props.match.params.id,
            prev: this.props.match.params.prev
        }
    }

    // 请求标签
    getLabelsFetch() {
        const params = {}

        Http.ajax(`${URL}/labels`, params).then(res => {

            const {ECONOMIC_POWER,FAMILY_BACKGROUND,OTHER,STUDY_SITUATION} = res.data.labels

            this.setState({
                ECONOMIC_POWER,
                FAMILY_BACKGROUND,
                OTHER,
                STUDY_SITUATION
            })
        })
    }

    componentWillMount() {
        //获取所有标签
        this.getLabelsFetch();

        //返回页面的时候渲染已选中标签
        this.readyLabel();
    }
    //返回页面的时候渲染已选中标签
    readyLabel(){
        const { customerLabels } = this.state;
        var selfFieldArr = [ 'familyLabels','econoLabels','studyLabels','otherLabels'];
        if(customerLabels){
           selfFieldArr.map((name)=> customerLabels[name].length == 0 ? '' : this.setState({[name]:customerLabels[name]}))
        }

    }

    editorChange(editor) {
        this.setState({
            editor
        })
    }
    addMemberLabel() {

        const {addLabelName:name, addLabelType:labelType} = this.state

        if (labelType==='') {
            Toast.info('请选择标签类别',2);
            return;
        }

        if (name==='') {
            Toast.info('请输入标签内容',2);
            return;
        }


        const params = {
            method: 'POST',
            data: {
                labelType,
                name
            }
        }

        Http.ajax(`${URL}/labels/add`,params).then(res => {
            
            this.getLabelsFetch()
        })


        this.onModalClose('modal')
    }
    //点击标签
    labelClick(Labels, item) {

        // 未编辑状态下，选择
        !this.state.editor && this.setState((prev) => {

            const index = prev[Labels].indexOf(item.id)
            if (index < 0)
                prev[Labels].push(item.id)
            else
                prev[Labels].splice(index, 1)

            return {
                [Labels]: prev[Labels]
            }
        })


        // 编辑状态下，添加

        const deleteLabel = () => {
            const params = {
                data: {
                    labelId: item.id
                }
            }
            Http.ajax(`${URL}/labels/count`,params).then(res =>{
                const alertMsg = <div style={{textAlign:'left'}}>您有{res.data.leadCount}条线索使用该标签，删除后相关线索使用的该标签将一并清除，确认删除吗？</div>
                alert('删除', alertMsg, [
                  { text: '取消', onPress: () => {} },
                  { text: '确定', onPress: () => Http.ajax(`${URL}/labels/delete`,params).then(res => {
                                                    Toast.success('删除成功！', 1);
                                                    this.getLabelsFetch()
                                                }) },
                ])
            })
            
        }

        this.state.editor && !item.original && deleteLabel()


    }

    /* 显示添加标签模态框 */
    showModal(event, modal) {
        event.preventDefault()

        this.setState({
            [modal]: true
        },() => {
            var autoTextarea = document.getElementsByClassName('ht-textarea')[0].children[0].children[0]
            autoTextarea.focus()
        })
    }

    /* 关闭添加标签模态框 */
    onModalClose(modal) {
        this.setState({
            [modal]: false,
            addLabelType: '',
            addLabelName: '',
        })
    }

    /* 添加标签，选择类别 */
    handleLableType(type) {
        this.setState({
            addLabelType: type
        })
    }
    // 添加标签名
    handleLabelName(name) {
        this.setState({
            addLabelName: name
        })
    }
    //点击保存按钮
    storeLabels(){
        const { familyLabels, econoLabels, studyLabels, otherLabels, editor, id,prev} = this.state;

        if(!editor){
            this.props.history.push(`/${prev}/${id+this.props.location.hash}`)
            this.props.saveLabels({
                familyLabels,
                econoLabels,
                studyLabels,
                otherLabels,
                id
            })
        } else {
            this.setState({
                editor: false
            })
        }
    }


    render() {
        const {editor, familyLabels, econoLabels, studyLabels, otherLabels, addLabelType, addLabelName} = this.state
        const {ECONOMIC_POWER,FAMILY_BACKGROUND, OTHER, STUDY_SITUATION} = this.state
        return (
            <div id="clientLabel">
                <Flex className="editor">
                    {
                        editor
                            ? <Flex>
                                <Button className="btn" onClick={(e) => this.showModal(e, 'modal')}>添加</Button>
                                <Button className="btn" onClick={() => this.editorChange(false)}>取消</Button>
                              </Flex>
                            : <Button className="btn" onClick={() => this.editorChange(true)}>编辑</Button>
                    }
                </Flex>

                {/* 家庭背景 */}
                <div className="label-box label-family">
                    <Flex className="title"><i className="icon-jiating"></i>家庭背景</Flex>
                    <Flex className="labels">
                        {FAMILY_BACKGROUND.map((item, index) => (
                            <Button key={index}
                                    className={`btn ${familyLabels.indexOf(item.id)>-1?'active':''} ${editor&&!item.original?'icon-del':''}`}
                                    onClick={() => this.labelClick('familyLabels', item)}>
                                {item.name}
                            </Button>
                        ))}
                    </Flex>
                </div>

                {/* 经济实力 */}
                <div className="label-box label-econo">
                    <Flex className="title"><i className="icon-jingji"></i>经济实力</Flex>
                    <Flex className="labels">
                        {ECONOMIC_POWER.map((item, index) => (
                            <Button key={index}
                                    className={`btn ${econoLabels.indexOf(item.id)>-1?'active':''} ${editor&&!item.original?'icon-del':''}`}
                                    onClick={() => this.labelClick('econoLabels', item)}>
                                {item.name}
                            </Button>
                        ))}
                    </Flex>
                </div>

                {/* 学习情况 */}
                <div className="label-box label-study">
                    <Flex className="title"><i className="icon-xuexi"></i>学习情况</Flex>
                    <Flex className="labels">
                        {STUDY_SITUATION.map((item, index) => (
                            <Button key={index}
                                    className={`btn ${studyLabels.indexOf(item.id)>-1?'active':''} ${editor&&!item.original?'icon-del':''}`}
                                    onClick={() => this.labelClick('studyLabels', item)}>
                                {item.name}
                            </Button>
                        ))}
                    </Flex>
                </div>

                {/* 其他 */}
                <div className="label-box label-other">
                    <Flex className="title"><i className="icon-other"></i>其他</Flex>
                    <Flex className="labels">
                        {OTHER.map((item, index) => (
                            <Button key={index}
                                    className={`btn ${otherLabels.indexOf(item.id)>-1?'active':''} ${editor&&!item.original?'icon-del':''}`}
                                    onClick={() => this.labelClick('otherLabels', item)}>
                                {item.name}
                            </Button>
                        ))}
                    </Flex>
                </div>

                {/* 保存 */}
                <Flex className="confirm-btn btn-main-long" onClick={()=>this.storeLabels()} >{editor?'确认':'保存'}</Flex>

                {/* 添加用户标签 */}
                <Modal
                    className="addLabel"
                    title="添加用户标签"
                    platform="ios"
                    transparent
                    visible={this.state.modal}
                    onClose={() => this.onModalClose('modal')}
                    footer={[
                            { text: '取消', onPress: () => { this.onModalClose('modal') }},
                            { text: '确认', onPress: () => { this.addMemberLabel() }}
                        ]}>

                   <div className="addLabel-type">
                       <div className="title">标签类别</div>
                       <Flex className="type-list">
                           <FlexItem onClick={() => this.handleLableType('FAMILY_BACKGROUND')}><span>家庭背景</span><i className={`${addLabelType==='FAMILY_BACKGROUND'?'active':''}`}></i></FlexItem>
                           <FlexItem onClick={() => this.handleLableType('STUDY_SITUATION')}><span>学习情况</span><i className={`${addLabelType==='STUDY_SITUATION'?'active':''}`}></i></FlexItem>
                       </Flex>
                       <Flex className="type-list">
                           <FlexItem onClick={() => this.handleLableType('ECONOMIC_POWER')}><span>经济情况</span><i className={`${addLabelType==='ECONOMIC_POWER'?'active':''}`}></i></FlexItem>
                           <FlexItem onClick={() => this.handleLableType('OTHER')}><span>其　　他</span><i className={`${addLabelType==='OTHER'?'active':''}`}></i></FlexItem>
                       </Flex>
                   </div>

                    <div className="addLabel-cont">
                        <div className="title">标签内容</div>
                        <TextareaItem
                            className="textraea ht-textarea"
                            rows={3}
                            maxLength="10"
                            value={addLabelName}
                            onChange={this.handleLabelName.bind(this)}
                            placeholder="请输入标签内容"
                            ref='autofocusIpt'
                        />
                    </div>
                </Modal>

            </div>
        )
    }
}


const mapStateToProps = (state) => ({
    customerLabels: state.labels
})
const clientLabelConnect = connect(
    mapStateToProps,
    action
)(clientLabel)

export default clientLabelConnect;