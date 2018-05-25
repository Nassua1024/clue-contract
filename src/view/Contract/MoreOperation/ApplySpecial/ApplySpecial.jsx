
import React from 'react';
import { Picker, List, TextareaItem, Toast } from 'antd-mobile';

import './ApplySpecial.less';

const Http = Base;
const api = Base.url.Api; 

class ApplySpecial extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			leadId: this.props.match.params.leadId, //线索id
			applyInfo: new Object(),
			applyNum: '', //申请特批次数 0 金额 1 课时 2 其它
			applyArr: new Array(), //特批类型

			moneyArr: [[
			    { label: '9.5折', value: '0.95' },
			    { label: '9折', value: '0.9' },
			    { label: '8.8折', value: '0.88' },
			    { label: '8.5折', value: '0.85' },
			    { label: '8折', value: '0.8' },
			    { label: '7.5折', value: '0.75'}
			]], //金额折扣数据
			moneyDiscount: '', //选中的金额折扣
		
			HourArr: [[
			    { label: '4', value: '4' },
			    { label: '6', value: '6' },
			    { label: '8', value: '8' },
			    { label: '10', value: '10' },
			    { label: '12', value: '12' },
			]], //额外课时赠送数据
			HourGive: '', //选中的赠送课时
		
			applyReason: '', //申请理由
			applyType: '', //选中的特批类型
			titText: '',
			showContent: false,
			showMoney: false,
			showHour: false
		};
	}

	componentWillMount() {
		this.applyTimes();
		this.specialList();
	}

	/*本月申请特批次数*/
	applyTimes() {
		Http.ajax(`${api}/changgui/count-month-special/`,{}).then(res => {
			if(res.code == 0) {
				this.setState({
					applyNum: res.data.count
				});
			}
		});
	}

	/*特批类型列表*/
	specialList() {
		Http.ajax(`${api}/changgui/special-types`,{}).then(res => {
			if(res.code == 0)
				this.setState({
					applyArr : res.data.specialTypes
				});
		});
	}
	
	/*渲染页面高度*/
	componentDidMount() {
		const bodyHeight = document.body.clientHeight;
		document.getElementById('applyWrap').style.height = bodyHeight + 'px';
	}

	/*选择特批类型*/
	chooseType(id) {

		let { applyType, showContent, moneyDiscount, HourGive, titText, showMoney, showHour } = this.state;
		
		/*金额特批*/
		if(id == 'DISCOUNT_SPECIAL') 
			this.setState({
				applyType: id,
				showContent: true, 
				titText: '特批内容', 
				showMoney: true, 
				showHour: false,
				HourGive: '',
				applyReason:''
			});	
		
		/*课时特批*/
		if(id == 'HOUR_SPECIAL')
			this.setState({
				applyType: id,
				showContent: true, 
				titText: '特批内容', 
				showMoney: false, 
				showHour: true,
				moneyDiscount: '',
				applyReason:''
			});

		/*其它特批*/
		if(id == 'OTHER_SPECIAL')
			this.setState({
				applyType: id,
				showContent: true, 
				titText: '特批理由', 
				showMoney: false, 
				showHour: false,
				moneyDiscount: '',
				HourGive: '',
				applyReason: ''
			});	
	} 

	/*点击下一步*/
	commit() {

		const { leadId, applyInfo, applyType, showMoney, moneyDiscount, showHour, HourGive, applyReason } = this.state;

		if(showMoney && moneyDiscount == '') {
			Toast.info('请选择金额特批折扣');
			return false;
		}

		if(showHour && HourGive == '') {
			Toast.info('请选择赠送课时数');
			return false;
		}

		if(applyReason == '') {
			Toast.info('请输入特批理由');
			return false;
		}

		const params = {
			method: 'POST',
			formData: true,
			data: {
				'lead.id': leadId,
				specialType: applyType,
				discount: moneyDiscount * 100,		
				giftHour: HourGive,		
				applyReason: applyReason	
			}
		};

		sessionStorage.setItem('specialParams',JSON.stringify(params));
		this.props.history.push(`/ConfirmSpecial/${leadId}`);
	}

	render() {

		const { applyType, applyNum, applyArr, moneyArr, moneyDiscount, HourArr, HourGive, applyReason, titText, showContent, showMoney, showHour } = this.state;

		return(
			<div className="apply-special special-css" id="applyWrap">
				
				<h3>本月已申请特批<span>{ applyNum }</span>次</h3>

				{/*申请特批类型*/}
				<div className="type">
					<div className="tit">
						<i></i>
						<span>特批类型</span>
					</div>
					<ul className="type-btn">
						{
							applyArr.map((item,index) => (
								<li className={ applyType == item.code ? 'active' : '' } key={ index } onClick={ () => this.chooseType(item.code) }>{ item.name }</li>
							))	
						}
					</ul>
				</div>

				{/*特批内容*/}
				{
					showContent && 
					<div className="content">
						<div className="tit">
							<i></i>
							<span>{ titText }</span>
						</div>

						{/*金额特批*/}
						{
							showMoney && 
							<div className="apply-type">
								<label>金额优惠：</label>
								<Picker
						          	data={ moneyArr }
						          	title="金额特批折扣"
						          	cascade={ false }
						          	extra="请选择金额特批折扣"
						          	value={ moneyDiscount }
						          	onChange={ v => this.setState({ moneyDiscount: v }) }
						        >
						          	<List.Item className={ moneyDiscount != '' ? 'gray' : '' } />
						        </Picker>
							</div>
						}

						{/*课时特批*/}
						{
							showHour && 
							<div className="apply-type">
								<label>额外赠送：</label>
								<Picker
						          	data={ HourArr }
						          	title="额外课时赠送"
						          	cascade={ false }
						          	extra="请选择赠送课时数"
						          	value={ HourGive }
						          	onChange={ v => this.setState({ HourGive: v }) }
						        >
						          	<List.Item className={ moneyDiscount != '' ? 'gray' : '' } />
						        </Picker>
							</div>
						}
						
						{/*特批理由*/}
						<div className="apply-reason">
							{
								(showHour || showMoney) &&
								<label>特批理由：</label>
							}
							<List>
								<TextareaItem
					            	placeholder="请输入特批理由"
					            	data-seed="logId"
					            	autoFocus
					            	autoHeight
					            	count="120"
					            	value={ applyReason }
					            	onChange={ (v) => this.setState({ applyReason: v }) }
					        	/>
				        	</List>
						</div>
						
					</div>
				}
				
				{
					showContent && 
					<a className="l-btn" href="javascript:void(0);" onClick={ () => this.commit() }>下一步</a>
				}
			</div>
		);
	}
}

export default ApplySpecial;