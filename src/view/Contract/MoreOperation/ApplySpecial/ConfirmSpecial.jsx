
import React from 'react';
import { Toast } from 'antd-mobile';

import './ConfirmSpecial.less';

const { Link } = ReactRouterDOM;

const Http = Base;
const api = Base.url.Api; 

class ApplySpecial extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			leadId: this.props.match.params.leadId, //线索id
			auditStaffs: new Array(),
			length: 0
		};
	}

	componentWillMount() {
		this.getAuditStaffs();
	}

	getAuditStaffs() {
		Http.ajax(`${api}/changgui/get-special-audit-staffs`,{}).then(res => {
			if(res.code == 0) {
				this.setState({
					auditStaffs: res.data.auditStaffs,
					length: res.data.auditStaffs.length
				});			
			}
		});
	}

	commit() {

		const { leadId } = this.state;
		const params = JSON.parse(sessionStorage.getItem('specialParams'));
			
		if(params == undefined){
			Toast.info('请先选择特批类型',1);
			return false;
		}

		Http.ajax(`${api}/changgui/apply-contract-special`,params).then(res => {
			if(res.code == 0) {
				sessionStorage.removeItem('specialParams');
				sessionStorage.setItem('specialContract','1');
				this.props.history.push(`/clueDetail/${leadId}`);
			}
		});
	}

	render() {

		const { leadId, auditStaffs, length } = this.state;

		return (
			<div className="confirm-special special-css">
				<div className="step">
					<div className="left">
						<p>1</p>
						<i></i>
						<p>2</p>
						{
							length > 2 &&
							<i></i>
						}
						{
							length > 2 &&
							<p>3</p>
						}
					</div>
					<ul className="right">
						{
							auditStaffs.map((item,index) => {
								return(
									<li key={ index }>
										<label>{ item.title + '审批：'}</label>
										<span>{ item.staffName }</span>
									</li>
								)
							})
						}
					</ul>
				</div>

				<div className="tip">完成以上特批流程，才能签订特批合同</div>

				<div className="btn">
					<Link to={`/ApplySpecial/${leadId}`}>返回</Link>
					<a href="javascript:void(0);" onClick={ () => this.commit() }>确认并提交</a>		
				</div>
			</div>
		)
	}
}

export default ApplySpecial;