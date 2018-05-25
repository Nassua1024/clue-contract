
import { Modal, Flex, Button, Toast } from 'antd-mobile';

import './PraiseContract.less';

const Http = Base;
const api = Base.url.Api;

class PraiseContract extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			pageType: true,
			item: new Array(),
			giftHourArr: new Array(),
			giftHour: 0,
			iNow: -1,
			showMask: false,
			giftContractId:'' //赠送合同Id
		};
	}

	componentWillMount(){
		
		let { pageType, giftHourArr } = this.state;	
		let item = JSON.parse(localStorage.getItem('praise')).list;
		let hourTotal = JSON.parse(localStorage.getItem('praise')).hour;

		for(var i=0; i<=hourTotal; i+=2) {
			giftHourArr.push(i);				
		}

		if(item == null) pageType = false;
		else pageType = true;

		this.setState({
			item,
			pageType,
			giftHourArr
		});
	}

	recommend() {
		
		const { giftContractId } = this.state;

		if(giftContractId == '') {
			Toast.info('请选择合同', 1);
			return false;
		}

		this.setState({
			showMask: true
		});
	}

	commit(v){
		
		const { giftContractId, giftHour } = this.state;
		const params = {
			method:'post',
			formData:true,
			data:{
				newContractId: Number(this.props.match.params.contractId),
				giftContractId,
				gift: v,
				giftRecommendHour: giftHour
			}
		}

		Http.ajax(`${api}/changgui/contracts/gift-recommend-hour`,params).then(res => {
			if(res.code == 0){
				this.props.history.push(`/ContractDetail/${Number(this.props.match.params.contractId)}`);
			}
		});
	}

	render(){
		const { pageType, item, giftContractId, giftHourArr, iNow, showMask } = this.state;
		return(
			<div className="parse-contract">
				{
					pageType && 
					<div>
						<p>录入成功后</p>
						<p>推荐人将最多获得新合同10%的课时赠送</p>
						<p>请选择一个合同来获取赠送</p>
						<ul>
							{
								item.map((item,index) => {
									return(
										<li key={ index } onClick={ () => this.setState({ giftContractId: item.id }) }>
											<span>{ item.studentName }</span>
											<span>{ item.price }元</span>
											<span>{ item.hour }课时</span>
											<i>
												{
													giftContractId == item.id &&
													<span></span>
												}
											</i>
										</li>
									);
								})
							}
						</ul>
						<div className="btn">
							<a href="javascript:void(0)" onClick={ () => this.commit(false) }>不赠送</a>
							<a href="javascript:void(0)" onClick={ () => this.recommend() }>确认赠送</a>
						</div>

						<Modal 
							className="present-modal ht-hours-modal"
							title="口碑赠送课时"
							visible={ showMask } 
							transparent="true"
						>
							<div className="discount">
								<Flex className="list" wrap="wrap">
				      				{
				      					giftHourArr.map((item,index) =>{
				      						var activeName = iNow === index ? 'active' :'';
				      						return <div key={ index } onClick={ () => this.setState({ giftHour: item, iNow: index }) } className={ activeName }>{ item }</div>
				      					})
				      				}
				    			</Flex>
				    			<Button onClick={ () => this.commit(true) }>确认口碑赠送</Button>
				    			<i className="close" onClick={ () => this.setState({ showMask: false, giftHour: 0}) }></i>
							</div>
	     				</Modal>
					</div>
				}
				{
					!pageType &&
					<div className="fail">
						<div>赠送课时失败，推荐人名下暂无有效合同</div>
						<a href="javascript:void(0);" onClick={ () => this.props.history.push(`/ContractDetail/${Number(this.props.match.params.contractId)}`)}>查看合同</a>
					</div>
				}
				
			</div>
		)
	}
}

export default PraiseContract;