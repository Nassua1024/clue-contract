
import { TextareaItem, List, Modal, Button, Flex, Toast } from 'antd-mobile';
import * as action from '../../../../redux/action/action';
import './ApplyRefund.less';


const alert=Modal.alert;
const Http=Base;

const {Api:URL}=Http.url;
const { connect } = ReactRedux;

class ApplyRefund extends React.Component {
	constructor(props){
		super(props);
		this.state={
			marginTop:'',
			modal:false, //弹框显示状态
			inputVal:'', //退费理由
			contractId:props.match.params.contractId,
			amount:''
		};
	}

	componentWillMount(){
      
		const paramsstu={
            method:'post',
            formData:true,
            data:{
            	contractId:this.props.match.params.contractId
            }
        };
        
        Http.ajax(`${URL}/contracts/refund-contract-amount`,paramsstu).then(res=>{
            if(res.code == 0){
            	let amount=res.data.amount;
            	this.setState({
            		amount:amount
            	});
            }
        });
	}

	componentDidMount(){
		let { marginTop } = this.state;
		marginTop = document.body.clientHeight - document.getElementById('cont').offsetHeight - 176;
		this.setState({
			marginTop
		});		
	}

	alertok(){

		const { contractId } = this.state;

		alert('', '合同退费提交成功', [
	        {
	           text: '查看详情', onPress: () => this.props.history.push(`/ContractDetail/${contractId}`)
	        },
	        {
	           text: '返回列表',onPress: () => this.props.history.push(`/NormalList/all`)
	        },
	    ]);
	}

	commit(){

		const { inputVal, amount, contractId } = this.state;
		
		if(inputVal === ''){
			Toast.info('请填写合同作废理由',1);
			return false;
		}else if(contractId==null){
            Toast.info('无效合同',1);
            return false;
        }else if(amount==''){
        	  Toast.info('退费金额不能为空',1);
            return false;
        }

		const promes={
			method:'post',
			formData:true,
			data:{
				contractId:contractId,
				amount:amount,
				reason:inputVal
			}
		};

		Http.ajax(`${URL}/contracts/refund-contract`,promes).then((res)=>{
			if(res.code==0){
				this.alertok();
			};
		});
	}

	render(){
		const { modal, amount, marginTop } = this.state;
		return(
			<div className="apply-refund base-css">
				<div className="title"><i></i><h3>申请退费</h3></div>
				<div id="cont">
					<Flex>
						<Flex.Item>退费金额</Flex.Item>
						<Flex.Item>
						<span>{ amount }元</span>
						</Flex.Item>
					</Flex>
					<List>
						<TextareaItem
		            		title=""
				            placeholder="请填写退费理由"
				            data-seed="logId"
				            autoFocus
				            autoHeight
				            onChange = { (e) => this.setState({ inputVal:e }) } //e表示输入的内容
				        />
			        </List>
			        <span className="tip">申请退费时，请准备好学员的合同和发票</span>
				</div>
				<Button onClick={ () => this.commit() } style={{ marginTop:marginTop }}>提交</Button>		       
				<Modal
		          	transparent
		          	maskClosable={ false }
		          	visible={ modal }
		          	onClose={ () => this.setState({ modal:false }) }
		          	footer={[{ text: '确定', onPress: () => { this.setState({modal:false}) } }]}
		        >
		          	抱歉，该学员已消课超过1/3，不支持退费操作
		        </Modal>
			</div>
		);
	}
}

const sdStateToProps = (state) => ({
    ConcernLabels: state.ConcernLabels
})
const APPLYRefund = connect(
    sdStateToProps,
    action
)(ApplyRefund)
export default APPLYRefund;