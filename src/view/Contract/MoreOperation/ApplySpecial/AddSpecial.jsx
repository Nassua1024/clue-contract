
import React from 'react';

import './SpecialDetail.less';

const { Link } = ReactRouterDOM;
const Http = Base;
const api = Base.url.Api; 

class SpecialDetail extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			leadId: '', //线索,
			leadHistoryId: this.props.match.params.leadHistoryId, //线索id
			specialId: this.props.match.params.specialId, //特批合同Id

			startMan: '', //发起人
			startTime: '', //发起时间
			branch: '', //分馆
			relatMan: '', //相关线索
			relatTel: '',//相关线索
			
			applyType: '', //特批类型
			applyContent: '', //特批内容
			applyReason: '', //特批理由

			iconOne: '',
			numOne: '',

			iconTwo: '',
			numTwo: '',

			iconThree: '',
			numThree: '',

			curatorClass: '',
			curatorAudit: '',
			curatorTitle: '',
			curatorName: '', //馆长姓名
			curatorTime: '', //馆长审批时间
			curatorReason: null, //馆长审批意见

			managerClass: '',
			managerAudit: '',
			managerTitle: '',
			managerName: '', //经理姓名
			managerTime: '', //经理审批时间
			managerReason: null, //经理审批意见

			chiefTitle: '',
			chiefClass: '',
			chiefName: '', //总监姓名
			chiefTime: '', //总监审批时间
			chiefReason: null, //总监审批意见

			length: 0,

			applyState: '', //0 申请中 1 已通过 
			btnText: '', //按钮文字
		};
	}

	componentWillMount() { 
		this.getCCinfo();
	}

	/*获取cc申请特批的相关信息*/
	getCCinfo() {

		let { specialId, applyType, applyContent, length, applyState, btnText } = this.state;
		let { iconOne, numOne, curatorTitle, curatorName, curatorTime, curatorReason, curatorClass } = this.state;
		let { iconTwo, numTwo, managerTitle, managerName, managerTime, managerReason, managerClass } = this.state;
		let { iconThree, numThree, chiefTitle, chiefName, chiefTime, chiefReason, chiefClass } = this.state;

		const params = {
			data: {
				specialId: this.state.specialId
			}
		};

		Http.ajax(`${api}/changgui/get-special`,params).then(res => {

			if(res.code == 0) {
				
				const data = res.data.contractSpecial;
				const auditStaffs = data.auditStaffs;

				length = auditStaffs.length;

				switch(data.specialType) {
					case 'DISCOUNT_SPECIAL': 
						applyType = '金额特批';
						applyContent = data.specialDiscount/10 + '折';
						break;

					case 'HOUR_SPECIAL':
						applyType = '课时特批';
						applyContent = data.specialGiftHour + '课时';
						break;

					case 'OTHER_SPECIAL':
						applyType = '其它特批';
						break;
				}
				
				/*馆长审批*/
				curatorTitle = auditStaffs[0].title;
				curatorName =  auditStaffs[0].staffName;
				curatorReason = auditStaffs[0].note;

				// 审批中
				if(auditStaffs[0].current == true && auditStaffs[0].auditStatus == 'AUDITING') {
					iconOne = 'approval-icon';
					numOne = 1;
					curatorClass = 'approval-info';
					curatorTime = '审批中';
				}

				// 下一步状态
				if(auditStaffs[0].current == false && auditStaffs[0].auditStatus == 'AUDITING') {
					numOne = 1;
				}

				// 审批通过
				if(auditStaffs[0].auditStatus == 'AUDITTED'){
					iconOne = 'pass-icon';
					numOne = '';
					curatorClass = 'pass-have-advice';
					curatorTime = auditStaffs[0].auditTime;
				}

				// 审批不通过
				if(auditStaffs[0].auditStatus == 'NO') {
					iconOne = 'reject-icon';
					curatorClass = 'reject';
					curatorTime = auditStaffs[0].auditTime;
				}
					
				/*经理审批*/
				managerTitle = auditStaffs[1].title;
				managerName =  auditStaffs[1].staffName;
				managerReason = auditStaffs[1].note;

				// 审批中
				if(auditStaffs[1].current == true && auditStaffs[1].auditStatus == 'AUDITING') {
					iconTwo = 'approval-icon';
					numTwo= 2;
					managerClass = 'approval-info';
					managerTime = '审批中';
				}

				// 下一步状态
				if(auditStaffs[1].current == false && auditStaffs[1].auditStatus == 'AUDITING') {
					numTwo = 2;
					managerClass = 'next-state';
				}

				// 审批通过
				if(auditStaffs[1].auditStatus == 'AUDITTED'){
					iconTwo = 'pass-icon';
					managerClass = 'pass-have-advice';
					managerTime = auditStaffs[1].auditTime;
				}

				// 审批不通过
				if(auditStaffs[1].auditStatus == 'NO') {
					iconTwo = 'reject-icon';
					managerClass = 'reject';
					managerTime = auditStaffs[1].auditTime;
				}

				if(length > 2) {
					
					/*总监审批*/
					chiefTitle = auditStaffs[2].title;
					chiefName =  auditStaffs[2].staffName;
					chiefReason = auditStaffs[2].note;

					// 审批中
					if(auditStaffs[2].current == true && auditStaffs[2].auditStatus == 'AUDITING') {
						iconThree = 'approval-icon';
						numThree = 3;
						chiefClass = 'approval-info';
						chiefTime = '审批中';
					}

					// 下一步状态
					if(auditStaffs[0].current == false && auditStaffs[0].auditStatus == 'AUDITING') {
						numThree = 3;
					}

					// 审批通过
					if(auditStaffs[2].auditStatus == 'AUDITTED'){
						iconThree = 'pass-icon';
						numThree = '';
						chiefClass = 'pass-have-advice';
						chiefTime = auditStaffs[2].auditTime;
					}

					// 审批不通过
					if(auditStaffs[2].auditStatus == 'NO') {
						iconThree = 'reject-icon';
						chiefClass = 'reject';
						chiefTime = auditStaffs[2].auditTime;
					}
				}

				if(data.auditFlowFinished == false) {
					auditStaffs.map((item,index) => {
						if(item.current == true && item.self == true) {
							btnText = '返回线索列表';
							applyState = 'BACK';
						}
					});
				}

				if(data.auditStatus == 'AUDITING' || data.auditStatus ==  "NO") {
					btnText = '返回线索列表';
					applyState = 'BACK';
				}else
					btnText = '添加特批合同';
					
				
				this.setState({
					leadId: data.leadId,
					applyState,
					length,
					btnText,

					startMan: data.staffName,
					startTime: new Date(data.createTime).Format('yyyy-MM-dd hh:mm:ss'),
					branch: data.storeName + '馆',
					relatMan: data.leadName,
					relatTel: data.leadMobile,
					applyType,
					applyContent,
					applyReason: data.applyReason,

					iconOne,
					numOne,
					
					iconTwo,
					numTwo,

					iconThree,
					numThree,

					curatorClass,
					curatorTitle,
					curatorName,
					curatorReason,
					curatorTime,

					managerTitle,
					managerName,
					managerReason,
					managerTime,
					managerClass,

					chiefClass,
					chiefTitle,
					chiefName,
					chiefReason,
					chiefTime,

				}, () => this.setStyle() );
			}
		});
	}


	/*设置审批进度icon的样式*/
	setStyle() {

		const leftWrap = document.getElementById('left-wrap');
		const stepOne = document.getElementById('step-one');
		const stepTwo = document.getElementById('step-two');
		const icon = document.getElementById('icon');
		const lineOne = document.getElementById('line-one');

		const stepOneHeight = stepOne.offsetHeight;
		const stepTwoHeight = stepTwo.offsetHeight;
		const iconHeight = icon.offsetHeight;

		let lineOneHeight = (stepOneHeight + stepTwoHeight)/2 - iconHeight + 28 - 4;
		let leftPadding = Math.floor(stepOneHeight/2 - iconHeight/2);

		lineOne.style.height = lineOneHeight + 'px';
		leftWrap.style.paddingTop = leftPadding + 'px';

		stepOne.style.height = stepOneHeight + 'px';
		stepTwo.style.height = stepTwoHeight + 'px';
		icon.style.height = iconHeight + 'px';
		icon.style.width = iconHeight + 'px';

		if(document.getElementById('step-three') != null) {
			const stepThree = document.getElementById('step-three');
			const lineTwo = document.getElementById('line-two');
			const stepThreeHeight = stepThree.offsetHeight;
			let lineTwoHeight = (stepTwoHeight + stepThreeHeight)/2 - iconHeight + 28 - 4;
			lineTwo.style.height = lineTwoHeight + 'px';
			stepThree.style.height = stepThreeHeight + 'px';
		}
	}

	commit() {

		const { applyState, leadId, leadHistoryId, specialId } = this.state;

		if(applyState == 'BACK'){
			sessionStorage.setItem('specialContract','1');
			this.props.history.push(`/clueDetail/${leadId}`);
		}
		else
			this.props.history.push(`/AudioSheet/${leadId}?${specialId}`);
	}

	render() {

		const { length, applyNum, startMan, startTime, branch, relatMan, relatTel, applyType, applyContent, applyReason, btnText } =this.state
		const { iconOne, numOne, curatorClass, curatorTitle, curatorName, curatorTime , curatorReason } = this.state;
		const { iconTwo, numTwo, managerClass, managerTitle, managerName, managerTime, managerReason } = this.state;
		const { iconThree, numThree, chiefClass, chiefTitle, chiefName, chiefTime, chiefReason }  = this.state;  

		return(
			<div className="special-detail special-css">
				<div className="content-wrap">
					
					{/*cc信息*/}
					<ul className="top">
						<li>
							<div className="name">
								<label>发起人：</label>
								<span>{ startMan }</span>
							</div>
							<div className="time">
								<label>分馆：</label>
								<span>{ branch }</span>
							</div>
						</li>
						<li>
							<label>发起时间：</label>
							<p>{ startTime }</p>
						</li>
						<li>
							<label>相关线索：</label>
							<a href={ `tel://${relatTel}` }>
								<span>{ relatMan }</span>
								<span>{ relatTel.replace(/(^\d{3}|\d{4}\B)/g,"$1-") }</span>
							</a>
						</li>
					</ul>

					{/*特批信息*/}
					<ul className="apply-content">
						<li>
							<label>特批类型：</label>
							<p>{ applyType }</p>
						</li>
						<li>
							<label>特批内容：</label>
							<p>{ applyContent }</p>
						</li>
						<li className="reason">
							<label>特批理由：</label>
							<p >{ applyReason }</p>
						</li>
						<li>
							<label>特批流程：</label>
						</li>
					</ul>

					{/*审批进度*/}
					<div className="step">
						
						<div className="left" id="left-wrap">
							<p className={ iconOne } id="icon">{ numOne }</p>
							<i id="line-one" style={{margin:'2px auto' }}></i>
							<p className={ iconTwo }>{ numTwo }</p>
							{
								length > 2 &&
								<i id="line-two" style={{margin:'2px auto' }}></i> 
							}
							{
								length > 2 &&
								<p className={ iconThree }>{ numThree }</p>
							}
						</div>
						
						<ul className="right">
							
							<li className={ curatorClass } id="step-one" style={{maginBottom:'28px'}}>
								<div className="position">
									{ curatorTitle + '：' + curatorName }
									<span className="time">{ curatorTime }</span>
								</div>
								{
									curatorReason !== null &&
									<p className="apply-advice">{ '意见：' + curatorReason }</p>
								}
							</li>

							<li className={ managerClass } id="step-two" style={{maginBottom:'28px' }}>
								<div className="position">
									{ managerTitle + '：' + managerName }
									<span className="time">{ managerTime }</span>
								</div>
								{
									managerReason !== null &&
									<p className="apply-advice">意见：{ managerReason }</p>
								}
							</li>

							{
								length > 2 && 
								<li className={ chiefClass } id="step-three" style={{maginBottom:'28px' }}>
									<div className="position">
										{ chiefTitle + '：' + chiefName }
										<span className="time">{ chiefTime }</span>
									</div>
									{
										chiefReason !== null &&
										<p className="apply-advice">意见：{ chiefReason }</p>
									}
								</li>
 							}
						</ul>
					</div>
				</div>
				
				<a className="l-btn" href="javascript:void(0)" onClick={ () => this.commit() }>{ btnText }</a>
			</div>
		)
	}
}

export default SpecialDetail;