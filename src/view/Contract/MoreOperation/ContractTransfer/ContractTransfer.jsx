
import { Button, List, TextareaItem,  Modal, WhiteSpace, WingBlank, Toast, InputItem } from 'antd-mobile';

import './ContractTransfer.less'; 
const alert=Modal.alert
const Http=Base
const {Api:URL}=Http.url

class ContractTransfer extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			marginTop:'',
			inputName:'', //姓名
			inputTel:'', //手机号
			inputReason:'', //合同转让理由
			contractId:props.match.params.contractId,
			reg:/^1[3|4|5|7|8][0-9]{9}$/, //手机号正则
			tipState:'tip',
		}
	}
	
	componentDidMount(){
		let { marginTop } = this.state;
		marginTop = document.body.clientHeight - document.getElementById('cont').offsetHeight -136;
		this.setState({
			marginTop
		});		
	}

	alertok(){
		alert('提示', '修改成功', [
	        { 
	           text: '查看详情', onPress: () => this.props.history.push(`/ContractDetail`)
	        },
	        {
	           text: '返回列表',onPress: () => this.props.history.push(`/NormalList`)
	        },
	    ])
	}

	commit(){
		
		let { inputName, inputTel, inputReason, reg, tipState } = this.state;
		
		if(inputTel === ''){

			Toast.info('请输入手机号',1);
			return false;

		}else if(!reg.test(inputTel.replace(/\s/g, ''))){

			Toast.info('请输入正确的手机号',1);
			return false;

		}else if(inputReason === ''){

			Toast.info('请输入合同转让理由',1);
			return false;

		}else{

			const params={
				method:'post',
				formData:true,
				data:{
					contractId:this.state.contractId,
					mobile:this.state.inputTel,
					reason:this.state.inputReason
				}
			}
			Http.ajax(`${URL}/changgui/contracts/check-transfer`,params).then((res)=>{
				if(res.code == 0){
					localStorage.setItem('transfer',JSON.stringify(params.data));
					this.props.history.push(`/TransferDetail/${this.state.contractId}`);
				}
			})
		}
	}

	render(){
		const { height, inputReason, inputTel, tipState, marginTop } = this.state;
		return(
			<div id='contract-transfer' className="base-css" style={{height:height}}>
				<div id="cont">
					<div className="title"><i></i><h3>合同转让</h3></div>
	        		<div className="iput">
	        			<InputItem  
	        				placeholder="请输入电话" 
	        				type="phone"
	        				value={ inputTel.replace(/\s/g, '-') }
	        				onChange={ (e) => this.setState({ inputTel:e }) } 
	        			/>
	        		</div>
	        		<List>
						<TextareaItem
				            placeholder="请输入合同转让理由"
				            data-seed="logId"
				            className="CtText"
				            autoFocus
				            autoHeight
				            onChange = { (e) => this.setState({ inputReason:e}) }
				        />
			        </List>
				</div>
		        <Button onClick={ () => this.commit() } style={{marginTop:marginTop}}>提交</Button>
			</div>
		)
	}
}

export default  ContractTransfer;