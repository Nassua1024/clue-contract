
import { Button } from 'antd-mobile';

import './ApplyReFundAudit.less';

class ApplyRefundAudit extends React.Component {
	render(){
		return(
			<div className="refund-audit base-css">
				<ul>
					<li>
						<label>发起人</label>
						<p>胖婶</p>
					</li>
					<li>
						<label>分馆</label>
						<p>镇平馆</p>
					</li>
					<li>
						<label>学员</label>
						<p>胖婶</p>
					</li>
					<li>
						<label>合同课时</label>
						<p>80</p>
					</li>
					<li>
						<label>退费理由</label>
						<p>退费理由退费理由退费理由退费理由退费理由退费理由退费理由退费理由退费理由退费理由退费理由退费理由退费理由退费理由</p>
					</li>
					<li>
						<label>审核状态</label>
						<p className="type">审核中</p>
					</li>
					<li>
						<label>申请日期</label>
						<p className="name">2017-09-20</p>
					</li>
				</ul>
				<Button className="btn-css">返回</Button>
			</div>
		);
	}
}

export default ApplyRefundAudit;