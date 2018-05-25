
import React from 'react';
import { List, TextareaItem, Toast } from 'antd-mobile';

import './RejectSpecial.less';

class AgreeSpecial extends  React.Component {

	constructor(props) {
		super(props);
		this.state = {
			reason: '', //特批意见
			num: 2, //特批次数
			nextState: '销售总监审批（徐金利）' //下一步状态
		}
	}

	/*确认*/
	commit() {
		
		const { reason } = this.state;

		if(reason == ''){
			Toast.info('请输入特批意见',1);
			return false;
		}

		this.props.history.push(`/SpecialContract`);
	}

	render() {

		const { reason, num, nextState } = this.state;

		return ( 
			<div className="advice special-css">
				<div className="tit">特批意见</div>
				<List>
					<TextareaItem
		            	placeholder="请输入特批意见"
		            	data-seed="logId"
		            	autoFocus
		            	autoHeight
		            	count="120"
		            	onChange={ (e) => this.setState({ reason:e }) }
		        	/>
	        	</List>
	        	<p className="next-state"><label>下一步状态：</label><span>{ nextState }</span></p>
	        	<div className="tip">发起人本季度已发起特批<span>{ num }</span>次</div>
	        	<a className="l-btn" href="javascript:void(0);" onClick={ () => this.commit() }>确认通过</a>
			</div>
		);
	}
}

export default AgreeSpecial;