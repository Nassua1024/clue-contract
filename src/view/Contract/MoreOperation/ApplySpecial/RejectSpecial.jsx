
import React from 'react';
import { List, TextareaItem, Toast } from 'antd-mobile';
 
import './RejectSpecial.less';

class RejectSpecial extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			advice: '' //特批意见
		};
	}

	/*确认*/
	commit() {

		const { advice } = this.state;
		
		if(advice == '') {
			Toast.info('请输入特批意见',1);
			return false;
		}

		this.props.history.push(`SpecialContract`);
	}

	render() {

		const { advice } = this.state;

		return (
			<div className="advice special-css" id="reject-wrap">
				<div className="tit">特批意见</div>
				<List>
					<TextareaItem
		            	placeholder="请输入特批意见"
		            	data-seed="logId"
		            	autoFocus
		            	autoHeight
		            	onChange={ (e) => this.setState({ advice:e }) }
		        	/>
	        	</List>
	        	<div className="l-btn" onClick={ () => this.commit() }>确认驳回</div>
			</div>
		);
	}
}

export default RejectSpecial;