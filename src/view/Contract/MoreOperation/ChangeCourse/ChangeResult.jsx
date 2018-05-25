
import React,{Component} from 'react';
import { Link } from 'react-router-dom';
import { Flex } from 'antd-mobile';

import './ChangeResult.less';

const ContractData = [
	{type:'原合同（已作废）',name:'小李',price:'15600元',course:'三字经',hour:'120课时'},
	{type:'新合同',name:'小李',price:'15600元',course:'弟子规',hour:'100课时'}
]

class ChangeResultModule extends Component {
	constructor(props){
		super(props);
		this.state = {
			ContractData:ContractData
		};
	}

	render(){
		return(
			<div className="change-result">
				<h3>更换成功</h3>
				{
					this.state.ContractData.map((item,index) => (
						<div className="list" key={index}>
							<p>{ item.type }</p>
							<Flex>
								<Flex.Item>{ item.name }</Flex.Item>
								<Flex.Item>{ item.price }</Flex.Item>
								<Flex.Item>{ item.course }</Flex.Item>
								<Flex.Item>{ item.hour }</Flex.Item>
							</Flex>
						</div>
					))
				}
				<p>原课程已删除，请重新为学员排课</p>
				<Flex.Item><Link to={`/OperationList`} className="arrange">去排课</Link></Flex.Item>
			</div>
		);
	}
}

export default ChangeResultModule;