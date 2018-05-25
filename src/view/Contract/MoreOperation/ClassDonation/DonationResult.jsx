
import React,{ Component } from 'react';
import { Flex } from 'antd-mobile';
import { Link } from 'react-router-dom';
 
import './DonationResult.less';

const ContractData = [
	{name:'小李',price:'14440元',hour:'160'},
	{name:'小李',price:'14440元',hour:'0'}
];

class DonationResultModule extends Component {
	constructor(props){
		super(props);
		this.state =  {
			ContractData:ContractData
		};
	}

	render(){
		return(
			<div className="result-don">
				<h3>转增成功</h3>
				{
					this.state.ContractData.map((item,index) => (
						<Flex key={ index }>
							<Flex.Item>{ item.name }</Flex.Item>
							<Flex.Item>{ item.price }</Flex.Item>
							<Flex.Item>{ item.hour }</Flex.Item>
						</Flex>
					))
				}
				<p>以上合同已作废，生成以下新合同</p>
				{
					this.state.ContractData.map((item,index) => (
						<Flex key={ index }>
							<Flex.Item>{ item.name }</Flex.Item>
							<Flex.Item>{ item.price }</Flex.Item>
							<Flex.Item>{ item.hour }</Flex.Item>
						</Flex>
					))
				}
				<Flex.Item className="ensure"><Link to={`/OperationList`}>返回合同列表</Link></Flex.Item>
			</div>
		);
	}
}

export default DonationResultModule;