
import { InputItem, Picker, List, Button, TextareaItem, Toast, ImagePicker } from 'antd-mobile';

import './ClueModify.less';
import * as action from '../../../redux/action/action'

const Http = Base
const {Link} = ReactRouterDOM
const { connect } = ReactRedux
const {Component} = React
const {Item} = List
const {api:URL} = Http.url

class ClueModify extends Component {
	constructor(props){
		super(props);

		const supplement = JSON.parse(sessionStorage.getItem('supplement'))

        this.state = supplement || {
			imgWidth:'100%',
            files: [],
            followStatus:"",
			leadId: props.match.params.id,
			listenTimeArr:[''],
            followText: '',

            delListenSta: false,		// 删除试听单


            token: '',		// 七牛token
            imgs: [],


            inputVal:'', //姓名
            state:'',  // 线索跟进状态Picker显示
            dataColor:'',
            stateColor:'',
            statusMappers: [],  // 线索跟进状态
            customerLabels: [],  // 自定义标签
            labelLibrary:'',
            // leadId: props.leadId,
            labelIds: [],
            note: '',		// 备注


            historis: [],
            timeHistoris: [],
            listenParams: []
		}
	}

    componentWillMount() {


        //获取线索相关标签
        if (!this.props.customerLabels || !this.state.inputVal) {
            this.getCustomerLab()
        }

        //获取标签库
        this.getLabelsFetch();

        // 上传图片
        this.getIMages()
        if (this.props.visitTime) {
            const {time,studentId,courseId,money} = this.props.visitTime
            const visit = {
                appointmentTime: time,
                studentId,
                courseId,
                estimatedPrice: money>>0
            }

            this.setState(prev => {
                prev.listenTimeArr.splice(prev.listenTimeArr.length-1,1,visit)
                return prev.listenTimeArr
            })
        }

        if (this.props.listenTime) {
            const {time, params} = this.props.listenTime
            this.setState(prev => {
                prev.listenParams.splice(this.state.listenTaskIndex,1,params)
                prev.listenTimeArr.splice(this.state.listenTaskIndex,1,time)
                return prev.listenTimeArr
            })
        }
    }

    // 合并标签 -from Redux & fetch
    labelsConcat() {
        const {ECONOMIC_POWER,FAMILY_BACKGROUND,OTHER,STUDY_SITUATION} = this.state.labelLibrary
        const {econoLabels,familyLabels,otherLabels,studyLabels} = this.props.customerLabels
        const allLabel = [...ECONOMIC_POWER,...FAMILY_BACKGROUND,...OTHER,...STUDY_SITUATION]
        const selLabel = [...econoLabels,...familyLabels,...otherLabels,...studyLabels]
        const customerLabels = selLabel.map(item => allLabel.filter(list => item === list.id)[0])
        //
        //
        this.setState({
            customerLabels
        })
    }

    //获取线索相关标签
    getCustomerLab() {
        const {leadId} = this.state
        const params = {data:{leadId}}
        Http.ajax(`${URL}/lead/get-customer-labels`,params).then(res => {
            this.setState({
                inputVal: res.data.leadName,
                customerLabels: res.data.labels
            }, () => {
                if (this.props.customerLabels) {
                    this.labelsConcat()
                }
            })
        })
    }

    // 获取线索跟进状态 数据
    handleLeadStatus() {
	    if (this.state.statusMappers.length > 0) return;
        const params = {
            data: { leadId: this.props.match.params.id }
        }
        Http.ajax(`${URL}/lead/get-child-status  `,params).then(res => {
            const statusMappers = res.data.childStatus.map(({name:value,description:label}) => { return {label,value} } )
            this.setState({
                statusMappers
            })
        })
    }
    // 获取标签
    getLabelsFetch() {
        const params = {};
        Http.ajax(`${URL}/labels`, params).then(res => {
            this.setState({
                labelLibrary:res.data.labels
            },() => {
                // 遍历
                if (this.props.customerLabels && this.props.customerLabels.id===this.state.leadId) {
                    this.labelsConcat()
                }
            })
        })

    }
    // 跳转 储存
    handleToLabels() {
        const {customerLabels} = this.state
        const filterLabel = (type) => (customerLabels.filter(list => list.labelType===type).map(list => list.id))
        const familyLabels = filterLabel('FAMILY_BACKGROUND'),
            econoLabels = filterLabel('ECONOMIC_POWER'),
            studyLabels = filterLabel('STUDY_SITUATION'),
            otherLabels = filterLabel('OTHER'),
            id = this.state.leadId
        this.props.saveLabels({
            familyLabels,
            econoLabels,
            studyLabels,
            otherLabels,
            id
        })

        // 父组件保存
        this.onLink(this.state)
    }

    // 修改备注
    handleChangestate(v,state) {
        this.setState({
            [state]: v
        })
    }


    // 七牛
    getIMages() {
        const say = (h) => {
            if (h) {
                let node = document.getElementById('token')
                node.setAttribute('token',h.data.token);
            }
        }
        let timer = setInterval(() => {
            let node=document.getElementById('token');
            let token = node.getAttribute('token');
            if(token!=''){
                this.setState({
                    token
                })
                // this.upload();
                clearInterval(timer);
            }
        },500)
        const url = `http://upload.shbaoyuantech.com/upload-token?callback=sayHello=${say}`
        let script = document.createElement('script')
        script.setAttribute('src', url)
        document.getElementsByTagName('head')[0].appendChild(script);
    }

	//不同线索跟进状态下的设置定时任务变化
	changeStatus(status){
        const {statusMappers} = this.state
        const {value:followText} = statusMappers.filter(item => item.value === status[0])[0]
        this.setState({
			followStatus:status,
            followText,
            state: status,
            listenTimeArr: [''],
            listenParams: ['']
		})
	}

	// 删除图片
    delPicker(index) {
		const imgs = this.state.imgs.concat()
		imgs.splice(index,1)
		this.setState({
			imgs
		})
	}

	// 保存数据
    onLink() {
        // this.props.saveLeadSupplement({
        	// data2: this.state
		// })
        sessionStorage.setItem('supplement', JSON.stringify(Object.assign({}, this.state)))
        this.props.clearVisitListenTask('')
	}

	// 添加试听单
    addListenTask() {
		const listenTimeArr = this.state.listenTimeArr.concat()
		const listenParams = this.state.listenParams.concat()
		if (listenTimeArr.length >= 5) return;

        listenTimeArr.push('')
        listenParams.push('')
		this.setState({
            listenTimeArr,
            listenParams,
		})
	}

	// 删除试听单
    delListenTask() {
        const listenTimeArr = this.state.listenTimeArr.concat()
        if (listenTimeArr.length <= 1) return;

		this.setState({
            delListenSta: !this.state.delListenSta
		})
	}

	//
    delteListenItem(index,list) {
        let listenTimeArr = this.state.listenTimeArr.concat()
        let listenParams = this.state.listenParams.concat()
		let delListenSta = this.state.delListenSta
        if (listenTimeArr.length <= 1 && delListenSta) return;


        if (!delListenSta && !list) {
            this.setState({
                listenTaskIndex: index
            }, () => {
                this.onLink()
                this.props.history.push(`/recordListen/${this.props.match.params.id}`)
            })
            return;
		}
        if (!list) {
            listenTimeArr.splice(index,1)
            listenParams.splice(index,1)
        } else {
            listenTimeArr.splice(index,1, '')
            listenParams.splice(index,1, '')
        }
        if (listenTimeArr.length <= 1)
            delListenSta = false

        this.setState({
            delListenSta,
            listenTimeArr,
            listenParams,
        })
	}

	// 跳转到访
    linkToVisit(list) {
        if (list) {
	        this.setState(prev => {
	            prev.listenTimeArr.splice(0,1,'')
                return prev.listenTimeArr
            })
            return;
        }
        this.onLink()
	    this.props.history.push(`/recordVisit/${this.props.match.params.id}`)
    }

    linkToLianxi(list) {
        if (list) {
            this.setState(prev => {
                prev.listenTimeArr.splice(0,1,'')
                return prev.listenTimeArr
            })
            return;
        }
        this.onLink()
        this.props.history.push(`/recordLianxi/${this.props.match.params.id}`)
    }

    // 确认添加跟进
    handleBAOCUN() {

        const {leadId,state:[leadStatus],note,imgs,listenTimeArr,followText} = this.state

        if (!leadStatus) {
            Toast.info(`请选择跟进状态`, 1.5, null, false); return;
        }

        if (listenTimeArr[0] === '' && (followText==='PERMISSION_VISIT' ||  followText==='VISIT_LISTEN')) {
            Toast.info(`请设置定时任务`,1,null,false)
            return;
        }

        const data = {
            leadId: leadId>>0,
            leadStatus,
            pictureUrls: imgs,
            note,
            // isListen: lesson.listenTime > new Date().Format('yyyy-MM-dd hh:mm:ss')
        }

        if (followText==='PERMISSION_VISIT') {
            data.visits = listenTimeArr
        }
        if (followText.indexOf('RECONTACT') > -1) {
            data.visits = !listenTimeArr[0] ? null : listenTimeArr
        }

        if (followText==='VISIT_LISTEN')
            data.listens = this.state.listenParams.filter(list => list !== '')

        if (this.props.location.hash === '#result') {
            data.result = JSON.parse(localStorage.getItem('visitListenResult'))
        }

        const params = {method:'POST',data}

        Http.ajax(`${URL}/lead/save-lead-history`,params).then(res => {
            if (res.code === '0') {
                // this.props.clearLeadSupplement()
                sessionStorage.removeItem('supplement')
                sessionStorage.removeItem('clueListScrollTop')
                sessionStorage.removeItem('clueListPage')
                localStorage.removeItem('visitListenResult')
                this.getSaveLabelToLeadFetch()
            }
        })
    }

    // 保存联系人时候保存标签
    getSaveLabelToLeadFetch() {
        const params = {
            data: {
                leadId: this.state.leadId,
                labelId: this.state.customerLabels.map(list => list.id)
            }
        }
        Http.ajax(`${URL}/lead/save-label`,params).then(res => {
            if (res.code === '0') {
                Toast.info(`保存成功`,1,null,false)
                this.props.history.push(localStorage.getItem('formRouter') || '/clueList')
            }
        })
    }

    // 添加图片事件
    addPickerChange() {
	    const files = this.refs.addSrcInput.files
        for (let file of files) {
            const fileRe = new FileReader()
            fileRe.readAsDataURL(file);      // Base64

            fileRe.addEventListener('load', () => {
                this.putb64(fileRe.result)
            })
        }
        // const file = this.refs.addSrcInput.files[0]
        // const fileRe = new FileReader()
        // fileRe.readAsDataURL(file);      // Base64
        //
        // fileRe.addEventListener('load', () => {
        //     this.putb64(fileRe.result)
        // })
    }

    //
    putb64(result) {
        var pic = result.replace(/^.*?,/, '');
        var url = "http://up.qiniu.com/putb64/-1";
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState==4) {
                var data = JSON.parse(xhr.responseText);

                this.setState(prev => {
                    prev.imgs.push(`http://qiniu.shbaoyuantech.com/${data.key}`)
                    return prev.imgs
                })
            }
        }
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/octet-stream");
        xhr.setRequestHeader("Authorization", "UpToken "+this.state.token);
        xhr.send(pic);
    }

	render(){
		const { imgs, imgWidth,followText,leadId,followStatus, listenTimeArr,delListenSta } = this.state;
        const { customerLabels, inputVal, state, stateColor,statusMappers, note } = this.state;
        const renderLabel = () => (customerLabels.map((list,index) => list&&<span key={index} className={`label ${list.labelType}`}>{list.name}</span>))

        return (
			<div id="modify">
                <div className="info-wrap" id="token">
                    <Item className="main no-arrow extra-right" extra={ inputVal }>姓名</Item>
                    <Picker
                        data={[statusMappers]}
                        title="跟进状态"
                        cascade={false}
                        extra="请选择跟进状态"
                        value={ state }
                        onChange={ v => this.changeStatus(v) }
                    >
                        <List.Item arrow="horizontal" className={`main extra-right ${stateColor}`} onClick={this.handleLeadStatus.bind(this)}>跟进状态</List.Item>
                    </Picker>
                    {/* 客户标签 */}
                    <Link to={`/client-label/ClueModify/${leadId+this.props.location.hash}`} ref='save' onClick={this.handleToLabels.bind(this)}>
                        <Item className='labels extra-right' extra={renderLabel()} arrow="horizontal" >客户标签</Item>
                    </Link>
                    <TextareaItem
                        title="备注"
                        placeholder="请详细描述您的客户"
                        data-seed="logId"
                        value={note}
                        className={`extra-right note`}
                        onChange={ v => this.handleChangestate(v,'note')}
                        autoHeight
                    />
                </div>
				<div className="add-wrap">
					<div className="ul-imgbox" style={{width:imgWidth}}>
						{
                            imgs.map((item,index) => (
								<div className="li-img" key={index}>
									<i className="del" onClick={() => this.delPicker(index)}></i>
									<div className="box"><img src={item} alt="" /></div>
								</div>
							))
						}
                        {
                            imgs.length < 9 &&
                            <div className="li-img add-btn" id="addsrc" >
                                <input type="file"
                                       accept="image/*"
                                       ref={`addSrcInput`}
                                       onChange={this.addPickerChange.bind(this)} />
                            </div>
                        }
                    </div>
				</div>
				{
                    (followStatus=='VISIT_LISTEN' || followStatus == 'PERMISSION_VISIT' || followText.indexOf('RECONTACT') > -1) &&
					<div>
						<p className="set text-sm-66">设置定时任务</p>
						<ul className="set-wrap">
						{
							followStatus=='VISIT_LISTEN' &&
							<div>
							{
								listenTimeArr.map((list,index) => {
									return	<div key={index} className="li">
												<span className="type">试听单</span>
												<span className="time">{ list } </span>
												<div className={`set-btn ${delListenSta?'main-co':''}`} onClick={() => this.delteListenItem(index, list)}>{delListenSta?'删除':list?'取消':'去设置'}</div>
											</div>
								})
							}
								
								<div className='listen-wrap'>
									<p className={`btn add${listenTimeArr.length>=5?' disabled':''}`}
									   onClick={this.addListenTask.bind(this)}>
										+添加试听单
									</p>
									<span></span>
									<p className={`btn add${listenTimeArr.length==1?' disabled':''}`}
									   onClick={this.delListenTask.bind(this)}>
										-删除试听单
									</p>
								</div>
							</div>
						}
						{
							followStatus == 'PERMISSION_VISIT' &&
                            listenTimeArr.map((list,index) => (
                                <div className="li" key={index}>
                                    <span className="type">诺到访</span>
                                    <span className="time">{list.appointmentTime}</span>
                                    <div className="set-btn" onClick={() => this.linkToVisit(list)}>{list?'取消':'去设置'}</div>
                                </div>
                            ))
						}
						{
							followText.indexOf('RECONTACT') > -1 &&
                            listenTimeArr.map((list,index) => (
                                <div className="li" key={index}>
                                    <span className="type">再联系</span>
                                    <span className="time">{list.appointmentTime}</span>
                                    <div className="set-btn" onClick={() => this.linkToLianxi(list)}>{list?'取消':'去设置'}</div>
                                </div>
                            ))
						}
						</ul>
					</div>

				}
				<Button className="btn" onClick={this.handleBAOCUN.bind(this)}>确认添加跟进</Button>
			</div>
		)
	}
}


const mapStateToProps = (state) => {
    return {
        customerLabels: state.labels,
        visitTime: state.visitInfo,
        listenTime: state.listenInfo,
    }
}
const CLUEModify = connect(
    mapStateToProps,
    action
)(ClueModify)

export default CLUEModify;